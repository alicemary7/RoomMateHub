import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Building2,
  Heart,
  Calendar,
  MessageSquare,
  PlusCircle,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Users,
  CheckCircle,
} from 'lucide-react';
import { Dropdown, Avatar, Button, Tag } from 'antd';

const Navbar = () => {
  const { user, isAuthenticated, isTenant, isOwner, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const roleTagColor = {
    tenant: 'blue',
    owner: 'purple',
    admin: 'gold',
  }[user?.role || 'tenant'];

  const userMenuItems = [
    {
      key: 'header',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</div>
          <Tag color={roleTagColor} style={{ marginTop: 4, textTransform: 'capitalize' }}>
            {user?.role}
          </Tag>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'profile',
      label: 'Profile Settings',
      icon: <User size={16} />,
      onClick: () => navigate('/profile'),
    },
    ...(isTenant
      ? [
          {
            key: 'favorites',
            label: 'Saved Favorites',
            icon: <Heart size={16} />,
            onClick: () => navigate('/favorites'),
          },
          {
            key: 'visits',
            label: 'My Visits',
            icon: <Calendar size={16} />,
            onClick: () => navigate('/my-visits'),
          },
          {
            key: 'inquiries',
            label: 'My Inquiries',
            icon: <MessageSquare size={16} />,
            onClick: () => navigate('/my-inquiries'),
          },
        ]
      : []),
    ...(isOwner
      ? [
          {
            key: 'owner-dash',
            label: 'Owner Dashboard',
            icon: <LayoutDashboard size={16} />,
            onClick: () => navigate('/owner/dashboard'),
          },
          {
            key: 'my-props',
            label: 'My Properties',
            icon: <Building2 size={16} />,
            onClick: () => navigate('/owner/properties'),
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: 'admin-dash',
            label: 'Admin Control Panel',
            icon: <ShieldAlert size={16} />,
            onClick: () => navigate('/admin/dashboard'),
          },
        ]
      : []),
    { type: 'divider' },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogOut size={16} color="#ef4444" />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Home size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              RoomMate<span style={{ color: 'var(--primary)' }}>Hub</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-3px' }}>
              Find a room that feels like home
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <Link
            to="/properties"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 500,
              fontSize: '0.95rem',
              color: isActive('/properties') ? 'var(--primary)' : 'var(--text-main)',
              transition: 'color 0.2s',
            }}
          >
            <Compass size={18} />
            Browse Rooms & PGs
          </Link>

          {isTenant && (
            <>
              <Link
                to="/favorites"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/favorites') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <Heart size={18} />
                Favorites
              </Link>
              <Link
                to="/my-visits"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/my-visits') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <Calendar size={18} />
                My Visits
              </Link>
              <Link
                to="/my-inquiries"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/my-inquiries') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <MessageSquare size={18} />
                Inquiries
              </Link>
            </>
          )}

          {isOwner && (
            <>
              <Link
                to="/owner/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/owner/dashboard') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link
                to="/owner/properties"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/owner/properties') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <Building2 size={18} />
                My Listings
              </Link>
              <Link
                to="/owner/add-property"
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                <PlusCircle size={16} />
                List Property
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/admin/dashboard') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <LayoutDashboard size={18} />
                Admin Dashboard
              </Link>
              <Link
                to="/admin/properties"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/admin/properties') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <CheckCircle size={18} />
                Moderation
              </Link>
              <Link
                to="/admin/reports"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive('/admin/reports') ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                <ShieldAlert size={18} />
                Reports
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Auth / Profile Dropdown */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', padding: '4px 8px', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
                <Avatar src={user?.profileImage} icon={<User size={16} />} style={{ backgroundColor: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'block',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: 'var(--text-main)',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--border-light)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {isAuthenticated && (
            <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</div>
              <Tag color={roleTagColor} style={{ marginTop: '0.25rem' }}>{user?.role}</Tag>
            </div>
          )}

          <Link to="/properties" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
            <Compass size={18} /> Browse Properties
          </Link>

          {isTenant && (
            <>
              <Link to="/favorites" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Heart size={18} /> Saved Favorites
              </Link>
              <Link to="/my-visits" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> My Visits
              </Link>
              <Link to="/my-inquiries" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} /> My Inquiries
              </Link>
            </>
          )}

          {isOwner && (
            <>
              <Link to="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutDashboard size={18} /> Owner Dashboard
              </Link>
              <Link to="/owner/properties" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} /> My Listings
              </Link>
              <Link to="/owner/add-property" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                <PlusCircle size={18} /> List New Property
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LayoutDashboard size={18} /> Admin Dashboard
              </Link>
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> Manage Users
              </Link>
              <Link to="/admin/properties" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} /> Moderation
              </Link>
              <Link to="/admin/reports" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={18} /> Reports
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} /> Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: '0.5rem 0',
                }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Style block for media queries */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
