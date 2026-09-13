import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  Building2,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import { Tag, Button, Modal, message, Spin } from 'antd';
import { EmptyState } from '../../components/LoadingSkeleton';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const res = await API.get('/properties/my-properties');
      if (res.data?.success) {
        setProperties(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = (propertyId, title) => {
    Modal.confirm({
      title: 'Delete Listing?',
      content: `Are you sure you want to permanently delete "${title}"? This action will remove all photos, inquiries, and scheduled visits.`,
      okText: 'Delete Property',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await API.delete(`/properties/${propertyId}`);
          message.success('Property deleted successfully');
          fetchMyProperties();
        } catch (err) {
          message.error(err.message || 'Failed to delete property');
        }
      },
    });
  };

  const statusConfig = {
    Approved: { color: 'green', icon: <CheckCircle size={14} />, text: 'Approved (Public)' },
    Pending: { color: 'gold', icon: <Clock size={14} />, text: 'Pending Admin Review' },
    Rejected: { color: 'red', icon: <XCircle size={14} />, text: 'Rejected' },
    Unavailable: { color: 'default', icon: <XCircle size={14} />, text: 'Unavailable' },
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
            My Real Estate Portfolio
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Listed Properties</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your accommodations, edit descriptions, adjust pricing, and track approvals.
          </p>
        </div>

        <Link to="/owner/add-property" className="btn btn-primary">
          <PlusCircle size={18} /> Add New Listing
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading properties..." />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          icon={<Building2 size={48} />}
          title="No properties listed yet"
          description="You haven't added any accommodations to RoomMateHub yet. Create your first listing to start receiving tenant inquiries."
          action={
            <Link to="/owner/add-property" className="btn btn-primary">
              <PlusCircle size={18} /> Create Your First Listing
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {properties.map((prop) => {
            const conf = statusConfig[prop.status] || statusConfig.Pending;
            const mainImg = prop.images && prop.images[0]?.url ? prop.images[0].url : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80';

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
                {/* Image */}
                <div style={{ width: '180px', height: '120px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={mainImg} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <Tag color="blue" style={{ margin: 0 }}>
                      {prop.propertyType}
                    </Tag>
                    <Tag color="default" style={{ margin: 0 }}>
                      {prop.roomType}
                    </Tag>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {prop.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{prop.address}, {prop.city}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                      ₹{prop.monthlyRent?.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ month</span>
                    {prop.securityDeposit > 0 && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)', marginLeft: '0.75rem' }}>
                        (Deposit: ₹{prop.securityDeposit?.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '140px' }}>
                  <Link
                    to={`/properties/${prop._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%' }}
                  >
                    <ExternalLink size={14} /> View Public
                  </Link>

                  <Link
                    to={`/owner/edit-property/${prop._id}`}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%' }}
                  >
                    <Edit size={14} /> Edit Listing
                  </Link>

                  <button
                    onClick={() => handleDelete(prop._id, prop.title)}
                    className="btn btn-danger"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                  >
                    <Trash2 size={14} /> Delete
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

export default MyProperties;
