import { FiStar } from 'react-icons/fi';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  editable?: boolean;
  onChange?: (value: number) => void;
}

export default function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  editable = false,
  onChange,
}: RatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (rating: number) => {
    if (editable && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(value);
          const isPartial = starValue === Math.ceil(value) && value % 1 !== 0;
          const fillPercentage = isPartial ? (value % 1) * 100 : 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              disabled={!editable}
              className={`relative ${
                editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              } transition-transform ${sizeClasses[size]}`}
              aria-label={`امتیاز ${starValue} از ${max}`}
            >
              {/* Background (empty) star */}
              <FiStar
                className={`absolute inset-0 ${sizeClasses[size]} text-gray-300`}
              />

              {/* Filled star */}
              {(isFilled || isPartial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: isPartial ? `${fillPercentage}%` : '100%',
                  }}
                >
                  <FiStar
                    className={`${sizeClasses[size]} text-yellow-400 fill-current`}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {value.toFixed(1)} از {max}
        </span>
      )}
    </div>
  );
}
