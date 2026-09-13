import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Building2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Clock,
  Eye,
} from 'lucide-react';
import { Tag, Button, Select, message, Tabs, Spin, Modal } from 'antd';
import { EmptyState } from '../../components/LoadingSkeleton';

const ManageProperties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusFilter);

      const res = await API.get(`/admin/properties?${params.toString()}`);
      if (res.data?.success) {
        setProperties(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load properties for moderation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleApprove = async (propId) => {
    try {
      await API.patch(`/properties/${propId}/approve`);
      message.success('Property approved and is now live!');
      fetchProperties();
    } catch (err) {
      message.error(err.message || 'Failed to approve property');
    }
  };

  const handleReject = async (propId) => {
    Modal.confirm({
      title: 'Reject Property Listing?',
      content: 'Are you sure you want to reject this property? It will be hidden from public search.',
      okText: 'Reject',
      okType: 'danger',
      onOk: async () => {
        try {
          await API.patch(`/properties/${propId}/reject`);
          message.info('Property rejected');
          fetchProperties();
        } catch (err) {
          message.error(err.message || 'Failed to reject property');
        }
      },
    });
  };

  const handleToggleVerified = async (propId) => {
    try {
      const res = await API.patch(`/admin/properties/${propId}/verify`);
      message.success(res.data?.message || 'Verification updated');
      fetchProperties();
    } catch (err) {
      message.error(err.message || 'Failed to update verification status');
    }
  };

  const statusConfig = {
    Approved: { color: 'green', icon: <CheckCircle size={14} />, text: 'Approved' },
    Pending: { color: 'gold', icon: <Clock size={14} />, text: 'Pending Approval' },
    Rejected: { color: 'red', icon: <XCircle size={14} />, text: 'Rejected' },
    Unavailable: { color: 'default', icon: <XCircle size={14} />, text: 'Unavailable' },
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          Listing Moderation
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Moderate Properties</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Review pending accommodations, verify owner documents, and approve listings for public search.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Tabs
          activeKey={statusFilter}
          onChange={setStatusFilter}
          items={[
            { key: 'All', label: 'All Properties' },
            { key: 'Pending', label: 'Pending Approval' },
            { key: 'Approved', label: 'Approved & Live' },
            { key: 'Rejected', label: 'Rejected' },
          ]}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading properties..." />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={<Building2 size={48} />}
          title="No properties in this moderation category"
          description="There are currently no listings matching this status filter."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {properties.map((prop) => {
            const conf = statusConfig[prop.status] || statusConfig.Pending;
            const imgUrl = prop.images && prop.images[0]?.url ? prop.images[0].url : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80';
            const owner = prop.ownerId;

            return (
              <div
                key={prop._id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr auto',
                  gap: '1.75rem',
                  alignItems: 'center',
                }}
              >
                {/* Photo */}
                <div style={{ width: '180px', height: '125px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={imgUrl} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <Tag color={conf.color} icon={conf.icon} style={{ margin: 0, fontWeight: 600 }}>
                      {conf.text}
                    </Tag>
                    {prop.isVerified && (
                      <Tag color="success" icon={<ShieldCheck size={14} />} style={{ margin: 0, fontWeight: 600 }}>
                        Verified
                      </Tag>
                    )}
                    <Tag color="blue" style={{ margin: 0 }}>{prop.propertyType}</Tag>
                    <Tag color="purple" style={{ margin: 0 }}>{prop.roomType}</Tag>
                    <Tag color="cyan" style={{ margin: 0 }}>{prop.genderPreference}</Tag>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {prop.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{prop.address}, {prop.city}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.88rem' }}>
                    <div>
                      Rent: <strong style={{ color: 'var(--primary)' }}>₹{prop.monthlyRent?.toLocaleString('en-IN')}</strong> / mo
                    </div>
                    {owner && (
                      <div style={{ color: 'var(--text-muted)' }}>
                        Host: <strong>{owner.name}</strong> ({owner.email})
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '160px' }}>
                  <Link
                    to={`/properties/${prop._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%' }}
                  >
                    <ExternalLink size={14} /> Preview Listing
                  </Link>

                  {prop.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(prop._id)}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%', background: '#10b981' }}
                    >
                      <CheckCircle size={14} /> Approve Listing
                    </button>
                  )}

                  {prop.status !== 'Rejected' && (
                    <button
                      onClick={() => handleReject(prop._id)}
                      className="btn btn-outline"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%', color: '#ef4444', borderColor: '#fca5a5' }}
                    >
                      <XCircle size={14} /> Reject Listing
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleVerified(prop._id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%', color: prop.isVerified ? '#d97706' : '#059669' }}
                  >
                    <ShieldCheck size={14} /> {prop.isVerified ? 'Remove Verified' : 'Mark Verified'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageProperties;
