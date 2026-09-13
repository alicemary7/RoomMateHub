import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { EmptyState } from '../components/LoadingSkeleton';
import {
  MessageSquare,
  Building,
  User,
  Clock,
  CheckCircle2,
  ExternalLink,
  CornerDownRight,
} from 'lucide-react';
import { Tag, Spin, message, Button } from 'antd';
import dayjs from 'dayjs';

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await API.get('/inquiries/my');
      if (res.data?.success) {
        setInquiries(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          <MessageSquare size={16} /> Direct Messages
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Inquiries</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track questions and responses from property owners.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading inquiries..." />
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={48} />}
          title="No inquiries sent yet"
          description="Have questions about a room or PG? Click 'Contact Owner' on any property to ask questions directly."
          action={
            <Link to="/properties" className="btn btn-primary">
              Find Accommodations
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {inquiries.map((inq) => {
            const prop = inq.propertyId;
            const owner = inq.ownerId;
            const statusColor = inq.status === 'Responded' ? 'green' : inq.status === 'Closed' ? 'default' : 'gold';

            return (
              <div key={inq._id} className="glass-card" style={{ padding: '1.75rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Tag color={statusColor} style={{ fontWeight: 600 }}>
                        {inq.status.toUpperCase()}
                      </Tag>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-sub)' }}>
                        {dayjs(inq.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {prop ? prop.title : 'Property'}
                    </h3>
                  </div>

                  {prop && (
                    <Link
                      to={`/properties/${prop._id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      <ExternalLink size={14} /> View Property
                    </Link>
                  )}
                </div>

                {/* Tenant Question Message */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: inq.ownerResponse ? '1.5rem' : '0' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, fontWeight: 700 }}>
                    You
                  </div>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', flex: 1, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
                      Your Question:
                    </div>
                    <div style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {inq.message}
                    </div>
                  </div>
                </div>

                {/* Owner Reply */}
                {inq.ownerResponse ? (
                  <div style={{ display: 'flex', gap: '1rem', paddingLeft: '2rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0, fontWeight: 700 }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '10px', flex: 1, border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#065f46', marginBottom: '0.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Response from Host ({owner?.name || 'Owner'}):
                      </div>
                      <div style={{ color: '#166534', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {inq.ownerResponse}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: '3.25rem' }}>
                    Waiting for owner response...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInquiries;
