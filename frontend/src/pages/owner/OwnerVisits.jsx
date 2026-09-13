import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { EmptyState } from '../../components/LoadingSkeleton';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock4,
  Check,
  X,
} from 'lucide-react';
import { Tag, Button, message, Tabs, Spin, Modal } from 'antd';
import dayjs from 'dayjs';

const OwnerVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await API.get('/visits/owner');
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

  const handleAcceptVisit = async (visitId) => {
    try {
      await API.patch(`/visits/${visitId}/accept`);
      message.success('Visit request accepted');
      fetchVisits();
    } catch (err) {
      message.error(err.message || 'Failed to accept visit');
    }
  };

  const handleRejectVisit = async (visitId) => {
    try {
      await API.patch(`/visits/${visitId}/reject`);
      message.info('Visit request declined');
      fetchVisits();
    } catch (err) {
      message.error(err.message || 'Failed to reject visit');
    }
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      await API.patch(`/visits/${visitId}/complete`);
      message.success('Visit marked as completed');
      fetchVisits();
    } catch (err) {
      message.error(err.message || 'Failed to complete visit');
    }
  };

  const statusConfig = {
    Pending: { color: 'gold', icon: <Clock4 size={14} />, text: 'Pending Confirmation' },
    Accepted: { color: 'green', icon: <CheckCircle size={14} />, text: 'Accepted' },
    Rejected: { color: 'red', icon: <XCircle size={14} />, text: 'Declined' },
    Completed: { color: 'blue', icon: <CheckCircle size={14} />, text: 'Completed' },
    Cancelled: { color: 'default', icon: <XCircle size={14} />, text: 'Cancelled' },
  };

  const filtered =
    activeTab === 'All' ? visits : visits.filter((v) => v.status === activeTab);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          Schedule Manager
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Property Visit Requests</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Accept or manage scheduled physical tour appointments with prospective tenants.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'All', label: `All Visits (${visits.length})` },
            { key: 'Pending', label: `Pending Requests (${visits.filter((v) => v.status === 'Pending').length})` },
            { key: 'Accepted', label: `Accepted Tours (${visits.filter((v) => v.status === 'Accepted').length})` },
            { key: 'Completed', label: `Completed (${visits.filter((v) => v.status === 'Completed').length})` },
            { key: 'Rejected', label: `Declined (${visits.filter((v) => v.status === 'Rejected').length})` },
          ]}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading visits..." />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Calendar size={48} />}
          title="No visits found"
          description="You do not have any property tour appointments under this category."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((visit) => {
            const conf = statusConfig[visit.status] || statusConfig.Pending;
            const prop = visit.propertyId;
            const tenant = visit.tenantId;

            return (
              <div
                key={visit._id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Tag color={conf.color} icon={conf.icon} style={{ margin: 0, fontWeight: 600 }}>
                      {visit.status.toUpperCase()}
                    </Tag>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                      Property: {prop?.title || 'Listing'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
                      <Calendar size={16} color="var(--primary)" />
                      {dayjs(visit.visitDate).format('dddd, DD MMMM YYYY')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <Clock size={15} color="var(--primary)" />
                      {visit.visitTime}
                    </div>
                  </div>

                  {tenant && (
                    <div style={{ marginTop: '0.75rem', background: '#f8fafc', padding: '0.65rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <span>Visitor: <strong>{tenant.name}</strong></span>
                      {tenant.phone && <span>Phone: <strong>{tenant.phone}</strong></span>}
                      {tenant.email && <span>Email: {tenant.email}</span>}
                    </div>
                  )}

                  {visit.notes && (
                    <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Note from tenant: "{visit.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                  {visit.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleAcceptVisit(visit._id)}
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', background: '#10b981' }}
                      >
                        <Check size={15} /> Accept Visit
                      </button>
                      <button
                        onClick={() => handleRejectVisit(visit._id)}
                        className="btn btn-outline"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', color: '#ef4444', borderColor: '#fca5a5' }}
                      >
                        <X size={15} /> Decline
                      </button>
                    </>
                  )}

                  {visit.status === 'Accepted' && (
                    <button
                      onClick={() => handleCompleteVisit(visit._id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                    >
                      <CheckCircle size={15} color="#10b981" /> Mark Tour Done
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

export default OwnerVisits;
