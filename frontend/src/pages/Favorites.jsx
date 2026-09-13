import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { PropertyCardSkeleton, EmptyState } from '../components/LoadingSkeleton';
import API from '../services/api';
import { Heart, Compass } from 'lucide-react';
import { message } from 'antd';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await API.get('/favorites');
      if (res.data?.success) {
        setFavorites(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load favorite properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (propId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((p) => p._id !== propId));
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          <Heart size={16} fill="#ef4444" /> Shortlisted Places
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Saved Favorite Properties</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Keep track of your top room and PG choices for quick comparison and booking.
        </p>
      </div>

      {loading ? (
        <div className="grid-responsive">
          {[1, 2, 3].map((i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} />}
          title="No favorites saved yet"
          description="Browse rooms and PGs in Chennai and click the heart icon on any card to save it here."
          action={
            <Link to="/properties" className="btn btn-primary">
              <Compass size={18} /> Explore Properties
            </Link>
          }
        />
      ) : (
        <div className="grid-responsive">
          {favorites.map((prop) => (
            <PropertyCard
              key={prop._id}
              property={prop}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
