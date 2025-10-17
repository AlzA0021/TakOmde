"""
SMS notification services for Iranian providers
"""
import requests
from django.conf import settings


class KavenegarSMS:
    """Kavenegar SMS Service"""
    
    BASE_URL = 'https://api.kavenegar.com/v1/'
    
    def __init__(self):
        self.api_key = settings.KAVENEGAR_API_KEY
        self.sender = settings.KAVENEGAR_SENDER
    
    def send_sms(self, receptor, message):
        """Send SMS"""
        url = f"{self.BASE_URL}{self.api_key}/sms/send.json"
        
        data = {
            'sender': self.sender,
            'receptor': receptor,
            'message': message,
        }
        
        try:
            response = requests.post(url, data=data, timeout=10)
            result = response.json()
            
            if result.get('return', {}).get('status') == 200:
                return {'success': True, 'message_id': result['entries'][0]['messageid']}
            else:
                return {'success': False, 'error': result.get('return', {}).get('message', 'خطای نامشخص')}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def send_verify(self, receptor, token, template):
        """Send verification SMS using template"""
        url = f"{self.BASE_URL}{self.api_key}/verify/lookup.json"
        
        data = {
            'receptor': receptor,
            'token': token,
            'template': template,
        }
        
        try:
            response = requests.post(url, data=data, timeout=10)
            result = response.json()
            
            if result.get('return', {}).get('status') == 200:
                return {'success': True}
            else:
                return {'success': False, 'error': result.get('return', {}).get('message', 'خطای نامشخص')}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}


class GhasedakSMS:
    """Ghasedak SMS Service"""
    
    BASE_URL = 'https://api.ghasedaksms.com/v2/'
    
    def __init__(self):
        self.api_key = settings.GHASEDAK_API_KEY
    
    def send_sms(self, receptor, message):
        """Send SMS"""
        url = f"{self.BASE_URL}sms/send/simple"
        
        headers = {
            'apikey': self.api_key,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        
        data = {
            'receptor': receptor,
            'message': message,
        }
        
        try:
            response = requests.post(url, data=data, headers=headers, timeout=10)
            result = response.json()
            
            if result.get('result', {}).get('code') == 200:
                return {'success': True}
            else:
                return {'success': False, 'error': result.get('result', {}).get('message', 'خطای نامشخص')}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def send_verify(self, receptor, param1, template):
        """Send verification SMS using template"""
        url = f"{self.BASE_URL}verification/send/simple"
        
        headers = {
            'apikey': self.api_key,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        
        data = {
            'receptor': receptor,
            'type': '1',
            'template': template,
            'param1': param1,
        }
        
        try:
            response = requests.post(url, data=data, headers=headers, timeout=10)
            result = response.json()
            
            if result.get('result', {}).get('code') == 200:
                return {'success': True}
            else:
                return {'success': False, 'error': result.get('result', {}).get('message', 'خطای نامشخص')}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}


class SMSService:
    """Main SMS Service that can use different providers"""
    
    @staticmethod
    def send_order_confirmation(phone_number, order_number):
        """Send order confirmation SMS"""
        message = f'سفارش شما با شماره {order_number} ثبت شد. از خرید شما متشکریم.'
        
        try:
            sms = KavenegarSMS()
            return sms.send_sms(phone_number, message)
        except:
            try:
                sms = GhasedakSMS()
                return sms.send_sms(phone_number, message)
            except Exception as e:
                return {'success': False, 'error': str(e)}
    
    @staticmethod
    def send_payment_confirmation(phone_number, order_number, ref_id):
        """Send payment confirmation SMS"""
        message = f'پرداخت سفارش {order_number} با موفقیت انجام شد. کد پیگیری: {ref_id}'
        
        try:
            sms = KavenegarSMS()
            return sms.send_sms(phone_number, message)
        except:
            try:
                sms = GhasedakSMS()
                return sms.send_sms(phone_number, message)
            except Exception as e:
                return {'success': False, 'error': str(e)}
    
    @staticmethod
    def send_shipping_notification(phone_number, order_number, tracking_code):
        """Send shipping notification SMS"""
        message = f'سفارش {order_number} ارسال شد. کد رهگیری پستی: {tracking_code}'
        
        try:
            sms = KavenegarSMS()
            return sms.send_sms(phone_number, message)
        except:
            try:
                sms = GhasedakSMS()
                return sms.send_sms(phone_number, message)
            except Exception as e:
                return {'success': False, 'error': str(e)}
    
    @staticmethod
    def send_verification_code(phone_number, code):
        """Send verification code SMS"""
        message = f'کد تایید شما: {code}'
        
        try:
            sms = KavenegarSMS()
            return sms.send_sms(phone_number, message)
        except:
            try:
                sms = GhasedakSMS()
                return sms.send_sms(phone_number, message)
            except Exception as e:
                return {'success': False, 'error': str(e)}
