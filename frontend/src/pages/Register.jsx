import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Home, Building2, UserCheck, ArrowRight } from 'lucide-react';
import { message, Radio } from 'antd';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('tenant');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      message.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      message.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        phone,
        role,
      });

      message.success(`Account created successfully! Welcome to RoomMateHub, ${user.name}`);
      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/properties');
      }
    } catch (err) {
      message.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08) 0%, rgba(248, 250, 252, 0) 70%)',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 6px 16px rgba(79, 70, 229, 0.3)',
            }}
          >
            <Home size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join thousands of students and property owners on RoomMateHub.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Role Selection Cards */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              I want to:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setRole('tenant')}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: `2px solid ${role === 'tenant' ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: role === 'tenant' ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <UserCheck size={22} color={role === 'tenant' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: role === 'tenant' ? 'var(--primary)' : 'var(--text-main)' }}>
                  Find Accommodation
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student / Professional</div>
              </div>

              <div
                onClick={() => setRole('owner')}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: `2px solid ${role === 'owner' ? 'var(--primary)' : 'var(--border-light)'}`,
                  background: role === 'owner' ? 'var(--primary-light)' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <Building2 size={22} color={role === 'owner' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: role === 'owner' ? 'var(--primary)' : 'var(--text-main)' }}>
                  List Properties
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Property Owner / PG Manager</div>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Full Name *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                required
                placeholder="e.g. Karthik Raja"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Email Address *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <Mail size={18} color="var(--text-muted)" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Phone Number
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Phone size={18} color="var(--text-muted)" />
                <input
                  type="tel"
                  placeholder="9840123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Password (min 6 chars) *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Lock size={18} color="var(--text-muted)" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.92rem' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Get Started'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
