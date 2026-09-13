import React, { useState } from 'react';
import { Image } from 'antd';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const fallback = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80';
  const imgList = images.length > 0 ? images.map((img) => img.url) : [fallback];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? imgList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev === imgList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {/* Featured Big Image Preview */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
        }}
      >
        <Image
          src={imgList[activeIdx]}
          alt="Property view"
          style={{ width: '100%', height: '420px', objectFit: 'cover' }}
          preview={{
            src: imgList[activeIdx],
          }}
          fallback={fallback}
        />

        {imgList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                top: '50%',
                left: '16px',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.7)',
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                zIndex: 2,
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                top: '50%',
                right: '16px',
                transform: 'translateY(-50%)',
                background: 'rgba(15, 23, 42, 0.7)',
                color: 'white',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                zIndex: 2,
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
            zIndex: 2,
          }}
        >
          {activeIdx + 1} / {imgList.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {imgList.length > 1 && (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {imgList.map((url, index) => (
            <div
              key={index}
              onClick={() => setActiveIdx(index)}
              style={{
                width: '90px',
                height: '65px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeIdx === index ? '2.5px solid var(--primary)' : '2px solid transparent',
                opacity: activeIdx === index ? 1 : 0.6,
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              <img src={url} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
