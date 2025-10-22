"""
Management command to fix Persian slugs in products and categories
"""

from django.core.management.base import BaseCommand
from products.models import Product, Category
from products.utils import generate_unique_slug


class Command(BaseCommand):
    help = 'Convert all Persian slugs to English transliterated slugs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be changed without actually changing it',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be saved'))

        # Fix Category slugs
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('Fixing Category slugs...'))
        self.stdout.write('='*60 + '\n')

        categories = Category.objects.all()
        category_count = 0

        for category in categories:
            old_slug = category.slug
            # Check if slug contains Persian characters
            has_persian = any(ord(char) > 127 for char in old_slug)

            if has_persian or not old_slug:
                new_slug = generate_unique_slug(Category, category.name, category)

                if old_slug != new_slug:
                    self.stdout.write(
                        f'Category: {category.name}\n'
                        f'  Old slug: {old_slug}\n'
                        f'  New slug: {new_slug}'
                    )

                    if not dry_run:
                        category.slug = new_slug
                        category.save()

                    category_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Fixed {category_count} category slugs')
        )

        # Fix Product slugs
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('Fixing Product slugs...'))
        self.stdout.write('='*60 + '\n')

        products = Product.objects.all()
        product_count = 0

        for product in products:
            old_slug = product.slug
            # Check if slug contains Persian characters
            has_persian = any(ord(char) > 127 for char in old_slug)

            if has_persian or not old_slug:
                new_slug = generate_unique_slug(Product, product.name, product)

                if old_slug != new_slug:
                    self.stdout.write(
                        f'Product: {product.name}\n'
                        f'  Old slug: {old_slug}\n'
                        f'  New slug: {new_slug}'
                    )

                    if not dry_run:
                        product.slug = new_slug
                        product.save()

                    product_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Fixed {product_count} product slugs')
        )

        # Summary
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('SUMMARY'))
        self.stdout.write('='*60)
        self.stdout.write(f'Categories fixed: {category_count}')
        self.stdout.write(f'Products fixed: {product_count}')
        self.stdout.write(f'Total fixed: {category_count + product_count}')

        if dry_run:
            self.stdout.write(self.style.WARNING('\nThis was a DRY RUN - no changes were saved.'))
            self.stdout.write('Run without --dry-run to apply changes.')
        else:
            self.stdout.write(self.style.SUCCESS('\n✓ All slugs have been fixed!'))
