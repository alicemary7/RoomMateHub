import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck, Check, Sparkles, Bed, Home, Users } from 'lucide-react';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { message, Tag } from 'antd';

const PropertyCard = ({ property, onFavoriteToggle }) => {
  const { user, isAuthenticated, isTenant } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(property.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
  const mainImage = property.images && property.images.length > 0 ? property.images[0].url : fallbackImage;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      message.info('Please log in as a Tenant to save properties');
      navigate('/login');
      return;
    }

    if (!isTenant) {
      message.warning('Only tenant accounts can save favorite properties');
      return;
    }

    setLoadingFav(true);
    try {
      if (isFavorited) {
        await API.delete(`/favorites/${property._id}`);
        setIsFavorited(false);
        message.success('Removed from favorites');
        if (onFavoriteToggle) onFavoriteToggle(property._id, false);
      } else {
        await API.post(`/favorites/${property._id}`);
        setIsFavorited(true);
        message.success('Saved to favorites');
        if (onFavoriteToggle) onFavoriteToggle(property._id, true);
      }
    } catch (err) {
      message.error(err.message || 'Failed to update favorites');
    } finally {
      setLoadingFav(false);
    }
  };

  const genderTagColor = {
    Male: 'blue',
    Female: 'magenta',
    Any: 'purple',
  }[property.genderPreference || 'Any'];

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Property Image & Badges */}
      <div style={{ position: 'relative', width: '100%', height: '210px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
        <img
          src={mainImage}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFav}
          aria-label="Save property"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart
            size={18}
            style={{
              fill: isFavorited ? '#ef4444' : 'none',
              color: isFavorited ? '#ef4444' : '#64748b',
              transition: 'all 0.2s',
            }}
          />
        </button>

        {/* Verified Badge */}
        {property.isVerified && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'rgba(16, 185, 129, 0.95)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}
          >
            <ShieldCheck size={14} /> Verified
          </div>
        )}

        {/* Property Type Floating Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {property.propertyType}
        </div>
      </div>

      {/* Property Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
        {/* Rating and Room Type Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Tag color={genderTagColor} style={{ margin: 0, fontWeight: 600 }}>
              {property.genderPreference}
            </Tag>
            <Tag color="default" style={{ margin: 0 }}>
              {property.roomType}
            </Tag>
          </div>
          <Rating value={property.avgRating} totalReviews={property.totalReviews} />
        </div>

        {/* Title */}
        <Link to={`/properties/${property._id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              lineHeight: 1.4,
              height: '2.8rem',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {property.title}
          </h3>
        </Link>

        {/* Address / Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.city}, Chennai
          </span>
        </div>

        {/* Amenities Preview */}
        {property.amenities && property.amenities.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  background: 'var(--bg-alt)',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)', padding: '2px 4px' }}>
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price and Action Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                ₹{property.monthlyRent?.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ month</span>
            </div>
            {property.securityDeposit > 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                Deposit: ₹{property.securityDeposit?.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
