import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

/**
 * کامپوننت تصویر محصول با مدیریت خطا و placeholder
 * این کامپوننت به طور خودکار تصاویر خراب یا موجود را مدیریت می‌کند
 */
const ProductImage = ({ 
  src, 
  alt, 
  width = 400, 
  height = 400,
  className = '',
  priority = false
}: ProductImageProps) => {
  const [imgSrc, setImgSrc] = useState(src || '/images/placeholder.png')
  const [hasError, setHasError] = useState(false)

  // تولید SVG placeholder
  const generatePlaceholder = (w: number, h: number, text: string = 'بدون تصویر') => {
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${w}" height="${h}" fill="#f0f0f0"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Tahoma, Arial, sans-serif" 
          font-size="18" 
          fill="#999" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          ${text}
        </text>
      </svg>
    `
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  }

  const placeholderDataUrl = generatePlaceholder(width, height)

  // مدیریت خطای بارگذاری تصویر
  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(placeholderDataUrl)
    }
  }

  // اگر src موجود نیست، مستقیماً placeholder نشان بده
  const imageSrc = !src || src === '' ? placeholderDataUrl : imgSrc

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className="object-cover w-full h-full"
        onError={handleError}
        placeholder="blur"
        blurDataURL={placeholderDataUrl}
        priority={priority}
        quality={85}
      />
      
      {/* اگر تصویر خطا دارد، یک badge نمایش بده */}
      {hasError && (
        <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          تصویر موجود نیست
        </div>
      )}
    </div>
  )
}

export default ProductImage

/**
 * نحوه استفاده:
 * 
 * import ProductImage from '@/components/ProductImage'
 * 
 * <ProductImage 
 *   src={product.image} 
 *   alt={product.name}
 *   width={300}
 *   height={300}
 *   className="rounded-lg"
 * />
 */
