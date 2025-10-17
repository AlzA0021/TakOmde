"""
Views for products app
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from .models import Category, Product, ProductReview
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductReviewSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for categories"""
    queryset = Category.objects.filter(is_active=True, parent=None)
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get products in a category"""
        category = self.get_object()
        products = Product.objects.filter(
            category=category,
            is_active=True
        )
        
        serializer = ProductListSerializer(
            products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for products"""
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'is_active']
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['price', 'created_at', 'name', 'stock_quantity']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by stock status
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # Filter by sale
        on_sale = self.request.query_params.get('on_sale')
        if on_sale == 'true':
            queryset = queryset.filter(sale_price__isnull=False)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = self.queryset.filter(is_featured=True)[:8]
        serializer = ProductListSerializer(
            products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get products on sale"""
        products = self.queryset.filter(sale_price__isnull=False)[:12]
        serializer = ProductListSerializer(
            products,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def related(self, request, slug=None):
        """Get related products"""
        product = self.get_object()
        related = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id)[:6]
        
        serializer = ProductListSerializer(
            related,
            many=True,
            context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def review(self, request, slug=None):
        """Add a review to a product"""
        product = self.get_object()
        
        # Check if user already reviewed this product
        if ProductReview.objects.filter(product=product, user=request.user).exists():
            return Response(
                {'error': 'شما قبلاً برای این محصول نظر ثبت کرده‌اید'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ProductReviewSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product)
        
        return Response(
            {'message': 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود'},
            status=status.HTTP_201_CREATED
        )


class ProductReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for product reviews"""
    queryset = ProductReview.objects.filter(is_approved=True)
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product', 'rating']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # If user is staff, show all reviews
        if self.request.user.is_staff:
            return ProductReview.objects.all()
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
