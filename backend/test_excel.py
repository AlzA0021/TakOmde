"""
اسکریپت تست فایل اکسل bonakdari.xlsx
این اسکریپت فایل اکسل را می‌خواند و نتایج را نمایش می‌دهد
"""
import pandas as pd
import sys


def test_excel_file(file_path):
    """تست خواندن فایل اکسل"""
    
    print("="*60)
    print("تست فایل اکسل")
    print("="*60)
    
    try:
        # خواندن فایل با skiprows
        df = pd.read_excel(file_path, engine='openpyxl', skiprows=3)
        print(f"✅ فایل با موفقیت خوانده شد")
        print(f"📊 تعداد کل ردیف‌ها (با header): {len(df)}")
        
        # حذف ستون اول خالی
        if 'Unnamed: 0' in df.columns:
            df = df.drop(columns=['Unnamed: 0'])
            print("✅ ستون خالی حذف شد")
        
        # بررسی ردیف اول
        first_row = df.iloc[0]
        print(f"\n📋 ردیف اول: {list(first_row.values)[:5]}...")
        
        if 'واحد' in first_row.values:
            # استفاده از ردیف اول به عنوان header
            df.columns = first_row.values
            df = df.drop(df.index[0])
            df = df.reset_index(drop=True)
            print("✅ Header از ردیف اول استخراج شد")
        
        # حذف ردیف‌های خالی
        original_len = len(df)
        df = df.dropna(how='all')
        print(f"✅ {original_len - len(df)} ردیف خالی حذف شد")
        
        print(f"\n📊 تعداد نهایی ردیف‌ها: {len(df)}")
        print(f"📋 ستون‌های موجود: {list(df.columns)}")
        
        # نمایش 5 ردیف اول
        print("\n" + "="*60)
        print("نمونه داده (5 ردیف اول):")
        print("="*60)
        print(df.head())
        
        # آمار ستون‌ها
        print("\n" + "="*60)
        print("اطلاعات ستون‌ها:")
        print("="*60)
        print(df.info())
        
        # بررسی ستون کد کالا
        if 'کد کالا' in df.columns:
            null_count = df['کد کالا'].isnull().sum()
            print(f"\n✅ ستون 'کد کالا' موجود است")
            print(f"   - تعداد مقادیر خالی: {null_count}")
            print(f"   - نمونه کدها: {df['کد کالا'].head(3).tolist()}")
        else:
            print("\n⚠️  ستون 'کد کالا' یافت نشد!")
        
        # بررسی ستون قیمت
        price_columns = ['قیمت', 'آخرین خرید', 'قیمت فروش']
        found_price = False
        for col in price_columns:
            if col in df.columns:
                print(f"\n✅ ستون '{col}' موجود است")
                print(f"   - نمونه قیمت‌ها: {df[col].head(3).tolist()}")
                found_price = True
        
        if not found_price:
            print("\n⚠️  هیچ ستون قیمتی یافت نشد!")
        
        # خلاصه
        print("\n" + "="*60)
        print("خلاصه:")
        print("="*60)
        print(f"✅ تعداد محصولات قابل ورود: {len(df)}")
        print(f"✅ ستون‌های شناسایی شده: {len(df.columns)}")
        
        return True
        
    except Exception as e:
        print(f"❌ خطا در خواندن فایل: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "bonakdari.xlsx"
    
    print(f"فایل مورد تست: {file_path}\n")
    test_excel_file(file_path)
