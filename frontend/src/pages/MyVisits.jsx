import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { EmptyState } from '../components/LoadingSkeleton';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock4,
  ExternalLink,
} from 'lucide-react';
import { Tag, Button, Modal, message, Tabs, Spin } from 'antd';
import dayjs from 'dayjs';

const MyVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await API.get('/visits/my');
      if (res.data?.success) {
        setVisits(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleCancelVisit = (visitId) => {
    Modal.confirm({
      title: 'Cancel Visit Request?',
      content: 'Are you sure you want to cancel this scheduled property visit?',
      okText: 'Yes, Cancel Visit',
      okType: 'danger',
      cancelText: 'No, Keep',
      onOk: async () => {
        try {
          await API.patch(`/visits/${visitId}/cancel`);
          message.success('Visit request cancelled');
          fetchVisits();
        } catch (err) {
          message.error(err.message || 'Failed to cancel visit');
        }
      },
    });
  };

  const statusConfig = {
    Pending: { color: 'gold', icon: <Clock4 size={14} />, text: 'Waiting Owner Confirmation' },
    Accepted: { color: 'green', icon: <CheckCircle size={14} />, text: 'Visit Confirmed' },
    Rejected: { color: 'red', icon: <XCircle size={14} />, text: 'Declined by Owner' },
    Completed: { color: 'blue', icon: <CheckCircle size={14} />, text: 'Tour Completed' },
    Cancelled: { color: 'default', icon: <AlertCircle size={14} />, text: 'Cancelled' },
  };

  const filteredVisits =
    activeTab === 'All' ? visits : visits.filter((v) => v.status === activeTab);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          <Calendar size={16} /> Property Tours
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Scheduled Visits</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Track the status of your physical property visits and connect with hosts.
        </p>
      </div>

      {/* Tabs Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'All', label: `All Visits (${visits.length})` },
            { key: 'Pending', label: `Pending (${visits.filter((v) => v.status === 'Pending').length})` },
            { key: 'Accepted', label: `Accepted (${visits.filter((v) => v.status === 'Accepted').length})` },
            { key: 'Completed', label: `Completed (${visits.filter((v) => v.status === 'Completed').length})` },
            { key: 'Cancelled', label: `Cancelled (${visits.filter((v) => v.status === 'Cancelled').length})` },
          ]}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading visits..." />
        </div>
      ) : filteredVisits.length === 0 ? (
        <EmptyState
          icon={<Calendar size={48} />}
          title="No visits found"
          description="You haven't scheduled any property tours under this status."
          action={
            <Link to="/properties" className="btn btn-primary">
              Browse Rooms to Schedule Visit
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredVisits.map((visit) => {
            const conf = statusConfig[visit.status] || statusConfig.Pending;
            const prop = visit.propertyId;
            const owner = visit.ownerId;
            const imgUrl = prop?.images && prop.images[0]?.url ? prop.images[0].url : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={visit._id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: '140px', height: '100px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={imgUrl} alt={prop?.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Tag color={conf.color} icon={conf.icon} style={{ margin: 0, fontWeight: 600 }}>
                      {visit.status.toUpperCase()}
                    </Tag>
                    {prop && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {prop.roomType} • {prop.propertyType}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                    {prop ? prop.title : 'Property No Longer Available'}
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={15} color="var(--primary)" />
                      <strong>{dayjs(visit.visitDate).format('ddd, DD MMM YYYY')}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={15} color="var(--primary)" />
                      <span>{visit.visitTime}</span>
                    </div>
                    {prop && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={15} color="var(--primary)" />
                        <span>{prop.city}, Chennai</span>
                      </div>
                    )}
                  </div>

                  {owner && (
                    <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span>Host: <strong>{owner.name}</strong></span>
                      {owner.phone && <span>Phone: {owner.phone}</span>}
                    </div>
                  )}

                  {visit.notes && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Note: "{visit.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '130px' }}>
                  {prop && (
                    <Link
                      to={`/properties/${prop._id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', width: '100%' }}
                    >
                      <ExternalLink size={14} /> View Details
                    </Link>
                  )}
                  {['Pending', 'Accepted'].includes(visit.status) && (
                    <button
                      onClick={() => handleCancelVisit(visit._id)}
                      className="btn btn-outline"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#fca5a5', width: '100%' }}
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyVisits;
