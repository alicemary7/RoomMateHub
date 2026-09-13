import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/LoadingSkeleton';
import API from '../services/api';
import {
  ShieldCheck,
  Search,
  CalendarCheck,
  Key,
  Users,
  Building2,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Zap,
} from 'lucide-react';

const neighborhoods = [
  { name: 'OMR & Sholinganallur', count: 'IT Corridor & SEZ Hub', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80', query: 'OMR' },
  { name: 'Velachery', count: 'Near MRTS & Phoenix Mall', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80', query: 'Velachery' },
  { name: 'Anna Nagar', count: 'Upscale & Metro Connected', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80', query: 'Anna Nagar' },
  { name: 'Guindy', count: 'Near Olympia Tech Park', img: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab004?auto=format&fit=crop&w=600&q=80', query: 'Guindy' },
  { name: 'Tambaram', count: 'Near MCC & Railway Station', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80', query: 'Tambaram' },
  { name: 'Adyar', count: 'Beachside & IIT Madras', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', query: 'Adyar' },
];

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get('/properties?limit=6');
        if (res.data?.success) {
          setFeaturedProperties(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching featured listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          paddingTop: '4.5rem',
          paddingBottom: '5rem',
          background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.12) 0%, rgba(248, 250, 252, 0) 70%)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Tagline Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '30px',
              background: 'white',
              border: '1px solid var(--border-light)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} /> Find a room that feels like home
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 800,
              letterSpacing: '-1px',
              color: 'var(--text-main)',
              maxWidth: '840px',
              margin: '0 auto 1.25rem',
              lineHeight: 1.15,
            }}
          >
            Find a place you'll <span className="gradient-text">love to live.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-muted)',
              maxWidth: '650px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Search verified affordable rooms, luxury PGs, hostels, and co-living accommodations near your college or workplace in Chennai.
          </p>

          {/* Search Component */}
          <SearchBar />
        </div>
      </section>

      {/* Popular Neighborhoods in Chennai */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
              Explore Localities
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Popular Chennai Hotspots</h2>
          </div>
          <Link to="/properties" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem' }}>
            View all areas <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {neighborhoods.map((n, i) => (
            <Link
              key={i}
              to={`/properties?city=${n.query}`}
              className="glass-card"
              style={{
                position: 'relative',
                height: '190px',
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '1.25rem',
                textDecoration: 'none',
              }}
            >
              <img
                src={n.img}
                alt={n.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.55)',
                  transition: 'transform 0.4s ease, filter 0.4s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.filter = 'brightness(0.45)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(0.55)';
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: '2px' }}>{n.name}</h3>
                <div style={{ fontSize: '0.82rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {n.count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' }}>
              Handpicked Accommodations
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800 }}>Featured Verified Listings</h2>
          </div>
          <Link to="/properties" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
            Browse All ({featuredProperties.length > 0 ? '10+' : '0'}) Properties
          </Link>
        </div>

        {loading ? (
          <div className="grid-responsive">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <PropertyCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid-responsive">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section style={{ background: '#ffffff', padding: '5rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Seamless Experience
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>How RoomMateHub Works</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto 3.5rem', fontSize: '1.05rem' }}>
            Find, visit, and book your dream accommodation in 3 simple steps without paying any broker commission.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            textAlign: 'left'
          }}>
            {/* Step 1 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Search size={26} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step 01
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.75rem' }}>Search & Filter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Browse by city, budget, gender preference, room sharing, and amenities. View real photos and honest verified reviews.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <CalendarCheck size={26} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step 02
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.75rem' }}>Schedule a Visit</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Pick your convenient date and time slot. Contact property owners directly with zero broker interference.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
              }}>
                <Key size={26} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Step 03
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.5rem 0 0.75rem' }}>Move In Confidently</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Finalize your agreement directly with verified owners, enjoy home-cooked meals, and settle into your new room.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Onboarding Call To Action */}
      <section className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(2rem, 5vw, 4rem)',
            color: 'white',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(49, 46, 129, 0.25)',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
              <Building2 size={16} /> For Property Owners
            </div>
            <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              Have rooms or PGs to rent out in Chennai?
            </h2>
            <p style={{ color: '#c7d2fe', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              List your property on RoomMateHub to connect with verified college students and working professionals. Manage inquiries, visits, and bookings seamlessly from one unified dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  background: 'white',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  padding: '0.8rem 1.75rem',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                }}
              >
                List Your Property For Free
              </Link>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '0.8rem 1.5rem' }}
              >
                Owner Login
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ background: '#10b981', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '1rem' }}>Zero Brokerage Fees</h4>
                <p style={{ color: '#c7d2fe', fontSize: '0.85rem' }}>Keep 100% of your rent income with no hidden agent cuts.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ background: '#8b5cf6', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '1rem' }}>Verified Tenant Inquiries</h4>
                <p style={{ color: '#c7d2fe', fontSize: '0.85rem' }}>Direct inquiries from verified students & IT professionals.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ background: '#0ea5e9', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={20} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '1rem' }}>Instant Visit Scheduling</h4>
                <p style={{ color: '#c7d2fe', fontSize: '0.85rem' }}>Approve or reschedule tenant visits with one tap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
