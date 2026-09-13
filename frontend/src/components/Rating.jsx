import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 5, totalReviews, size = 16, showScore = true }) => {
  const ratingValue = Number(value) || 0;
  const rounded = Math.round(ratingValue * 10) / 10;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = ratingValue >= star;
          const isHalf = !isFilled && ratingValue >= star - 0.5;

          return (
            <Star
              key={star}
              size={size}
              style={{
                fill: isFilled ? '#f59e0b' : isHalf ? '#fde68a' : '#e2e8f0',
                color: isFilled || isHalf ? '#f59e0b' : '#cbd5e1',
              }}
            />
          );
        })}
      </div>

      {showScore && (
        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
          {rounded > 0 ? rounded.toFixed(1) : 'New'}
        </span>
      )}

      {totalReviews !== undefined && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};

export default Rating;
