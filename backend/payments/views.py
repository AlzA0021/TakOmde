"""
Views for payments app
"""
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import redirect
from django.conf import settings
from orders.models import Order
from .models import Payment, PaymentLog
from .serializers import PaymentSerializer, PaymentRequestSerializer
from .services import PaymentGatewayFactory


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for payments"""
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)

    @action(detail=False, methods=['post'])
    def request(self, request):
        """Request a new payment"""
        serializer = PaymentRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        order_id = serializer.validated_data['order_id']
        gateway = serializer.validated_data['gateway']
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {'error': 'سفارش یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if order.is_paid:
            return Response(
                {'error': 'این سفارش قبلاً پرداخت شده است'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create payment
        payment = Payment.objects.create(
            order=order,
            gateway=gateway,
            amount=order.total,
        )
        
        # Get gateway and request payment
        try:
            gateway_service = PaymentGatewayFactory.get_gateway(gateway)
            result = gateway_service.request_payment(payment)
            
            if result['success']:
                return Response({
                    'success': True,
                    'payment_url': result['url'],
                    'payment_id': payment.id,
                    'authority': result.get('authority') or result.get('code')
                })
            else:
                return Response(
                    {'error': result['error']},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET', 'POST'])
@permission_classes([])
def zarinpal_verify(request):
    """Verify Zarinpal payment"""
    authority = request.GET.get('Authority') or request.POST.get('Authority')
    status_param = request.GET.get('Status') or request.POST.get('Status')
    
    if not authority:
        return Response({'error': 'Authority یافت نشد'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        payment = Payment.objects.get(authority=authority, gateway='zarinpal')
    except Payment.DoesNotExist:
        return Response({'error': 'پرداخت یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
    
    if status_param != 'OK':
        payment.status = 'cancelled'
        payment.save()
        
        # Redirect to frontend with error
        frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/failed?reason=cancelled"
        return redirect(frontend_url)
    
    # Verify payment
    try:
        gateway = PaymentGatewayFactory.get_gateway('zarinpal')
        result = gateway.verify_payment(payment, authority)
        
        if result['success']:
            # Redirect to success page
            frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/success?ref_id={result['ref_id']}&order={payment.order.order_number}"
            return redirect(frontend_url)
        else:
            # Redirect to failed page
            frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/failed?reason={result['error']}"
            return redirect(frontend_url)
            
    except Exception as e:
        frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/failed?reason={str(e)}"
        return redirect(frontend_url)


@api_view(['GET', 'POST'])
@permission_classes([])
def paypint_verify(request):
    """Verify PayPing payment"""
    ref_id = request.GET.get('refid') or request.POST.get('refid')
    client_ref_id = request.GET.get('clientrefid') or request.POST.get('clientrefid')
    
    if not ref_id:
        return Response({'error': 'RefID یافت نشد'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        payment = Payment.objects.get(id=client_ref_id, gateway='paypint')
    except Payment.DoesNotExist:
        return Response({'error': 'پرداخت یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
    
    # Verify payment
    try:
        gateway = PaymentGatewayFactory.get_gateway('paypint')
        result = gateway.verify_payment(payment, ref_id)
        
        if result['success']:
            # Redirect to success page
            frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/success?ref_id={result['ref_id']}&order={payment.order.order_number}"
            return redirect(frontend_url)
        else:
            # Redirect to failed page
            frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/failed?reason={result['error']}"
            return redirect(frontend_url)
            
    except Exception as e:
        frontend_url = f"{settings.CORS_ALLOWED_ORIGINS[0]}/payment/failed?reason={str(e)}"
        return redirect(frontend_url)
