"""
Utility functions for products app
"""

import re
from django.utils.text import slugify


# Persian to English character mapping
PERSIAN_TO_ENGLISH = {
    'ا': 'a', 'آ': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch',
    'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's',
    'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f',
    'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'و': 'v', 'ه': 'h',
    'ی': 'y', 'ئ': 'y', 'ي': 'y', 'ة': 'e',
    # Numbers
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
    # Arabic numbers
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
}


def persian_to_english(text):
    """
    Convert Persian/Arabic characters to English transliteration

    Args:
        text: Input text with Persian characters

    Returns:
        Text with English characters
    """
    if not text:
        return text

    # Convert each character
    result = []
    for char in text:
        if char in PERSIAN_TO_ENGLISH:
            result.append(PERSIAN_TO_ENGLISH[char])
        else:
            result.append(char)

    return ''.join(result)


def generate_unique_slug(model_class, text, instance=None):
    """
    Generate a unique slug for a model instance

    Args:
        model_class: The model class (Product or Category)
        text: The text to create slug from
        instance: The current instance (for updates)

    Returns:
        A unique slug string
    """
    # First, transliterate Persian to English
    transliterated = persian_to_english(text)

    # Then create slug (this will handle spaces, special chars, etc.)
    base_slug = slugify(transliterated, allow_unicode=False)

    # If empty after slugify, use a default
    if not base_slug:
        base_slug = 'item'

    # Check if slug exists
    slug = base_slug
    counter = 1

    while True:
        # Check if slug exists (excluding current instance if updating)
        queryset = model_class.objects.filter(slug=slug)
        if instance and instance.pk:
            queryset = queryset.exclude(pk=instance.pk)

        if not queryset.exists():
            break

        # Add counter and try again
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


def clean_slug(slug):
    """
    Clean a slug to ensure it only contains valid URL characters

    Args:
        slug: The slug to clean

    Returns:
        Cleaned slug
    """
    if not slug:
        return slug

    # Remove any remaining Persian/Arabic characters
    slug = persian_to_english(slug)

    # Remove any characters that aren't alphanumeric, dash, or underscore
    slug = re.sub(r'[^a-z0-9\-_]', '-', slug.lower())

    # Remove multiple consecutive dashes
    slug = re.sub(r'-+', '-', slug)

    # Remove leading/trailing dashes
    slug = slug.strip('-')

    return slug if slug else 'item'
