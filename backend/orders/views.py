"""
Views for orders app
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.utils import timezone
from .models import Order, OrderItem, Cart, CartItem, Wishlist
from products.models import Product
from .serializers import (
    OrderSerializer, OrderCreateSerializer, CartSerializer,
    CartItemSerializer, WishlistSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for orders"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Create order from cart"""
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Get or create cart
        cart, _ = Cart.objects.get_or_create(user=user)
        
        if not cart.items.exists():
            return Response(
                {'error': 'سبد خرید شما خالی است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate totals
        subtotal = cart.subtotal
        shipping_cost = 30000  # Fixed shipping cost - customize as needed
        tax = 0  # Add tax calculation if needed
        discount = 0  # Add discount logic if needed
        total = subtotal + shipping_cost + tax - discount
        
        # Create order
        order = Order.objects.create(
            user=user,
            shipping_name=serializer.validated_data['shipping_name'],
            shipping_address=serializer.validated_data['shipping_address'],
            shipping_city=serializer.validated_data['shipping_city'],
            shipping_state=serializer.validated_data['shipping_state'],
            shipping_postal_code=serializer.validated_data['shipping_postal_code'],
            shipping_phone=serializer.validated_data['shipping_phone'],
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax=tax,
            discount=discount,
            total=total,
            notes=serializer.validated_data.get('notes', ''),
            payment_method=serializer.validated_data['payment_method'],
        )
        
        # Create order items from cart
        for cart_item in cart.items.all():
            # Check stock
            if cart_item.product.stock_quantity < cart_item.quantity:
                transaction.set_rollback(True)
                return Response(
                    {'error': f'موجودی کافی برای {cart_item.product.name} وجود ندارد'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_sku=cart_item.product.sku,
                unit_price=cart_item.unit_price,
                quantity=cart_item.quantity,
            )
            
            # Reduce stock
            cart_item.product.stock_quantity -= cart_item.quantity
            cart_item.product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        return Response({
            'message': 'سفارش با موفقیت ثبت شد',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        if order.status not in ['pending', 'processing']:
            return Response(
                {'error': 'فقط سفارشات در حال پردازش قابل لغو هستند'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore stock
        for item in order.items.all():
            item.product.stock_quantity += item.quantity
            item.product.save()
        
        order.status = 'cancelled'
        order.save()
        
        return Response({'message': 'سفارش لغو شد'})


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet for shopping cart"""
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Get user's cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not product_id:
            return Response(
                {'error': 'محصول مشخص نشده است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'محصول یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check stock
        if product.stock_quantity < quantity:
            return Response(
                {'error': 'موجودی کافی نیست'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        return Response({
            'message': 'محصول به سبد خرید اضافه شد',
            'cart': CartSerializer(cart, context={'request': request}).data
        })

    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """Update cart item quantity"""
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'آیتم یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if quantity <= 0:
            cart_item.delete()
            message = 'محصول از سبد خرید حذف شد'
        else:
            # Check stock
            if cart_item.product.stock_quantity < quantity:
                return Response(
                    {'error': 'موجودی کافی نیست'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item.quantity = quantity
            cart_item.save()
            message = 'تعداد محصول به‌روزرسانی شد'
        
        cart = cart_item.cart
        return Response({
            'message': message,
            'cart': CartSerializer(cart, context={'request': request}).data
        })

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """Remove item from cart"""
        item_id = request.data.get('item_id')
        
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
            cart = cart_item.cart
            cart_item.delete()
            
            return Response({
                'message': 'محصول از سبد خرید حذف شد',
                'cart': CartSerializer(cart, context={'request': request}).data
            })
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'آیتم یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear cart"""
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        
        return Response({'message': 'سبد خرید خالی شد'})


class WishlistViewSet(viewsets.ModelViewSet):
    """ViewSet for wishlist"""
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        """Get user's wishlist"""
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(wishlist, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_product(self, request):
        """Add product to wishlist"""
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'محصول یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        wishlist.products.add(product)
        
        return Response({
            'message': 'محصول به لیست علاقه‌مندی اضافه شد',
            'wishlist': WishlistSerializer(wishlist, context={'request': request}).data
        })

    @action(detail=False, methods=['post'])
    def remove_product(self, request):
        """Remove product from wishlist"""
        product_id = request.data.get('product_id')
        
        try:
            product = Product.objects.get(id=product_id)
            wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
            wishlist.products.remove(product)
            
            return Response({
                'message': 'محصول از لیست علاقه‌مندی حذف شد',
                'wishlist': WishlistSerializer(wishlist, context={'request': request}).data
            })
        except Product.DoesNotExist:
            return Response(
                {'error': 'محصول یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )
