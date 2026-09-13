import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  ShieldAlert,
  Users,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import { Spin } from 'antd';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="Loading admin metrics..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          Platform Governance
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Admin Control Panel</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Real-time oversight of users, listings moderation, reports, and system activity.
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Users</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
            {stats?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.totalTenants || 0} Tenants • {stats?.totalOwners || 0} Owners
          </div>
          <Link to="/admin/users" style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.75rem' }}>
            Manage Users <ArrowRight size={13} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Properties</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-main)' }}>
            {stats?.totalProperties || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.approvedProperties || 0} Approved & Live
          </div>
          <Link to="/admin/properties" style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.75rem' }}>
            All Properties <ArrowRight size={13} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid #fde68a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: 700 }}>Pending Moderation</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', color: '#d97706' }}>
            {stats?.pendingProperties || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Awaiting verification & approval
          </div>
          <Link to="/admin/properties?status=Pending" style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.75rem' }}>
            Review Queue <ArrowRight size={13} />
          </Link>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', border: '1.5px solid #fecaca' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 700 }}>Active Reports</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', color: '#dc2626' }}>
            {stats?.pendingReports || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {stats?.totalReports || 0} total reports filed
          </div>
          <Link to="/admin/reports" style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.75rem' }}>
            Resolve Reports <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Admin Modules Quick Launch */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Administration Tools</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Link to="/admin/properties" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <CheckCircle size={24} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Listing Verification & Approval</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Inspect newly uploaded listings, grant verified badges, or reject non-compliant accommodations.
          </p>
        </Link>

        <Link to="/admin/users" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <UserCheck size={24} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>User & Host Management</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            View all tenant and owner accounts, monitor activity, and deactivate suspicious users.
          </p>
        </Link>

        <Link to="/admin/reports" className="glass-card" style={{ padding: '1.75rem', textDecoration: 'none' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldAlert size={24} />
          </div>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>Flagged Listing Reports</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Investigate complaints filed by tenants regarding fake listings, incorrect locations, or price discrepancies.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
