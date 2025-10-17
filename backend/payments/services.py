"""
Payment gateway services
"""
import requests
from django.conf import settings
from django.utils import timezone
from .models import Payment, PaymentLog


class ZarinpalGateway:
    """Zarinpal Payment Gateway"""
    
    SANDBOX_URL = 'https://sandbox.zarinpal.com/pg/rest/WebGate/'
    PRODUCTION_URL = 'https://api.zarinpal.com/pg/rest/WebGate/'
    PAYMENT_URL = 'https://www.zarinpal.com/pg/StartPay/'
    
    def __init__(self):
        self.merchant_id = settings.ZARINPAL_MERCHANT_ID
        self.callback_url = settings.ZARINPAL_CALLBACK_URL
        self.base_url = self.SANDBOX_URL if settings.ZARINPAL_SANDBOX else self.PRODUCTION_URL
    
    def request_payment(self, payment):
        """Request payment from Zarinpal"""
        url = f"{self.base_url}PaymentRequest.json"
        
        data = {
            'MerchantID': self.merchant_id,
            'Amount': int(payment.amount),
            'Description': f'پرداخت سفارش {payment.order.order_number}',
            'CallbackURL': self.callback_url,
            'Email': payment.order.user.email,
            'Mobile': payment.order.shipping_phone,
        }
        
        try:
            response = requests.post(url, json=data, timeout=10)
            result = response.json()
            
            # Log the request
            PaymentLog.objects.create(
                payment=payment,
                action='request',
                request_data=data,
                response_data=result,
                status_code=response.status_code,
                is_successful=result.get('Status') == 100
            )
            
            if result.get('Status') == 100:
                payment.authority = result['Authority']
                payment.gateway_response = result
                payment.status = 'processing'
                payment.save()
                
                payment_url = f"{self.PAYMENT_URL}{result['Authority']}"
                return {'success': True, 'url': payment_url, 'authority': result['Authority']}
            else:
                error_msg = f"خطا در درخواست پرداخت: کد {result.get('Status')}"
                return {'success': False, 'error': error_msg}
                
        except Exception as e:
            PaymentLog.objects.create(
                payment=payment,
                action='request',
                request_data=data,
                error_message=str(e),
                is_successful=False
            )
            return {'success': False, 'error': str(e)}
    
    def verify_payment(self, payment, authority):
        """Verify payment"""
        url = f"{self.base_url}PaymentVerification.json"
        
        data = {
            'MerchantID': self.merchant_id,
            'Authority': authority,
            'Amount': int(payment.amount),
        }
        
        try:
            response = requests.post(url, json=data, timeout=10)
            result = response.json()
            
            # Log the verification
            PaymentLog.objects.create(
                payment=payment,
                action='verify',
                request_data=data,
                response_data=result,
                status_code=response.status_code,
                is_successful=result.get('Status') == 100
            )
            
            if result.get('Status') == 100:
                payment.ref_id = result['RefID']
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.gateway_response = result
                payment.save()
                
                # Update order
                payment.order.is_paid = True
                payment.order.paid_at = timezone.now()
                payment.order.status = 'processing'
                payment.order.save()
                
                return {'success': True, 'ref_id': result['RefID']}
            else:
                payment.status = 'failed'
                payment.gateway_response = result
                payment.save()
                
                error_msg = f"تراکنش ناموفق: کد {result.get('Status')}"
                return {'success': False, 'error': error_msg}
                
        except Exception as e:
            PaymentLog.objects.create(
                payment=payment,
                action='verify',
                request_data=data,
                error_message=str(e),
                is_successful=False
            )
            
            payment.status = 'failed'
            payment.save()
            
            return {'success': False, 'error': str(e)}


class PayPingGateway:
    """PayPing Payment Gateway"""
    
    BASE_URL = 'https://api.payping.ir/v2/pay'
    
    def __init__(self):
        self.token = settings.PAYPINT_TOKEN
        self.callback_url = settings.PAYPINT_CALLBACK_URL
    
    def request_payment(self, payment):
        """Request payment from PayPing"""
        url = self.BASE_URL
        
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
        }
        
        data = {
            'amount': int(payment.amount),
            'payerIdentity': payment.order.user.phone_number or payment.order.user.email,
            'payerName': payment.order.shipping_name,
            'description': f'پرداخت سفارش {payment.order.order_number}',
            'returnUrl': self.callback_url,
            'clientRefId': str(payment.id),
        }
        
        try:
            response = requests.post(url, json=data, headers=headers, timeout=10)
            result = response.json()
            
            # Log the request
            PaymentLog.objects.create(
                payment=payment,
                action='request',
                request_data=data,
                response_data=result,
                status_code=response.status_code,
                is_successful=response.status_code == 200
            )
            
            if response.status_code == 200 and 'code' in result:
                payment.authority = result['code']
                payment.gateway_response = result
                payment.status = 'processing'
                payment.save()
                
                payment_url = f"https://api.payping.ir/v2/pay/gotoipg/{result['code']}"
                return {'success': True, 'url': payment_url, 'code': result['code']}
            else:
                error_msg = result.get('message', 'خطای نامشخص')
                return {'success': False, 'error': error_msg}
                
        except Exception as e:
            PaymentLog.objects.create(
                payment=payment,
                action='request',
                request_data=data,
                error_message=str(e),
                is_successful=False
            )
            return {'success': False, 'error': str(e)}
    
    def verify_payment(self, payment, ref_id):
        """Verify payment"""
        url = f"{self.BASE_URL}/verify"
        
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json',
        }
        
        data = {
            'refId': ref_id,
            'amount': int(payment.amount),
        }
        
        try:
            response = requests.post(url, json=data, headers=headers, timeout=10)
            result = response.json()
            
            # Log the verification
            PaymentLog.objects.create(
                payment=payment,
                action='verify',
                request_data=data,
                response_data=result,
                status_code=response.status_code,
                is_successful=response.status_code == 200
            )
            
            if response.status_code == 200:
                payment.ref_id = ref_id
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.gateway_response = result
                payment.save()
                
                # Update order
                payment.order.is_paid = True
                payment.order.paid_at = timezone.now()
                payment.order.status = 'processing'
                payment.order.save()
                
                return {'success': True, 'ref_id': ref_id}
            else:
                payment.status = 'failed'
                payment.gateway_response = result
                payment.save()
                
                error_msg = result.get('message', 'تراکنش ناموفق')
                return {'success': False, 'error': error_msg}
                
        except Exception as e:
            PaymentLog.objects.create(
                payment=payment,
                action='verify',
                request_data=data,
                error_message=str(e),
                is_successful=False
            )
            
            payment.status = 'failed'
            payment.save()
            
            return {'success': False, 'error': str(e)}


class PaymentGatewayFactory:
    """Factory to get appropriate payment gateway"""
    
    @staticmethod
    def get_gateway(gateway_name):
        gateways = {
            'zarinpal': ZarinpalGateway,
            'paypint': PayPingGateway,
        }
        
        gateway_class = gateways.get(gateway_name)
        if gateway_class:
            return gateway_class()
        
        raise ValueError(f"درگاه پرداخت {gateway_name} پشتیبانی نمی‌شود")
