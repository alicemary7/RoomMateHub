import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Heart, Shield, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#cbd5e1',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <Home size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff' }}>
                RoomMate<span style={{ color: '#818cf8' }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Your trusted accommodation discovery platform connecting students and professionals with verified rooms, PGs, and shared spaces across Chennai.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>
              <Shield size={16} /> 100% Verified Property Listings
            </div>
          </div>

          {/* Popular Localities in Chennai */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Popular Hotspots</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/properties?city=OMR" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>OMR & Sholinganallur</Link></li>
              <li><Link to="/properties?city=Velachery" style={{ color: '#94a3b8' }}>Velachery & Guindy</Link></li>
              <li><Link to="/properties?city=Anna Nagar" style={{ color: '#94a3b8' }}>Anna Nagar West</Link></li>
              <li><Link to="/properties?city=Tambaram" style={{ color: '#94a3b8' }}>Tambaram & Chromepet</Link></li>
              <li><Link to="/properties?city=Adyar" style={{ color: '#94a3b8' }}>Adyar & Thiruvanmiyur</Link></li>
            </ul>
          </div>

          {/* Accommodation Types */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Room Types</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li><Link to="/properties?propertyType=PG" style={{ color: '#94a3b8' }}>Paying Guest (PGs)</Link></li>
              <li><Link to="/properties?roomType=Single" style={{ color: '#94a3b8' }}>Single Private Rooms</Link></li>
              <li><Link to="/properties?roomType=Double Sharing" style={{ color: '#94a3b8' }}>Double Sharing Hostels</Link></li>
              <li><Link to="/properties?propertyType=Apartment" style={{ color: '#94a3b8' }}>Shared 2BHK / 3BHK Flats</Link></li>
              <li><Link to="/properties?genderPreference=Female" style={{ color: '#94a3b8' }}>Women's Executive PGs</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Help & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={16} color="#818cf8" />
                <span>Chennai, Tamil Nadu, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} color="#818cf8" />
                <span>support@roommatehub.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} color="#818cf8" />
                <span>+91 98401 23456</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} RoomMateHub. Built for students & professionals.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#64748b' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#64748b' }}>Terms of Service</a>
            <a href="#" style={{ color: '#64748b' }}>Trust & Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
