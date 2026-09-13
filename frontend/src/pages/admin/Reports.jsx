import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { EmptyState } from '../../components/LoadingSkeleton';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  ExternalLink,
} from 'lucide-react';
import { Tag, Modal, Input, Checkbox, Button, message, Tabs, Spin } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [selectedReport, setSelectedReport] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [removeProperty, setRemoveProperty] = useState(false);
  const [resolving, setResolving] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reports');
      if (res.data?.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenResolveModal = (report) => {
    setSelectedReport(report);
    setAdminResponse('Issue reviewed and resolved by admin moderation team.');
    setRemoveProperty(false);
  };

  const handleResolve = async () => {
    setResolving(true);
    try {
      await API.patch(`/reports/${selectedReport._id}/resolve`, {
        adminResponse,
        removeProperty,
      });
      message.success('Report marked as resolved');
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      message.error(err.message || 'Failed to resolve report');
    } finally {
      setResolving(false);
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await API.patch(`/reports/${reportId}/reject`, {
        adminResponse: 'Report dismissed after investigation.',
      });
      message.info('Report dismissed');
      fetchReports();
    } catch (err) {
      message.error(err.message || 'Failed to dismiss report');
    }
  };

  const statusConfig = {
    Pending: { color: 'gold', text: 'Pending Investigation' },
    Resolved: { color: 'green', text: 'Resolved' },
    Rejected: { color: 'default', text: 'Dismissed' },
  };

  const filtered =
    activeTab === 'All' ? reports : reports.filter((r) => r.status === activeTab);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          Trust & Safety
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>User Reports & Flagged Listings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Investigate reported complaints regarding misleading photos, wrong addresses, and duplicate listings.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'All', label: `All Reports (${reports.length})` },
            { key: 'Pending', label: `Pending (${reports.filter((r) => r.status === 'Pending').length})` },
            { key: 'Resolved', label: `Resolved (${reports.filter((r) => r.status === 'Resolved').length})` },
            { key: 'Rejected', label: `Dismissed (${reports.filter((r) => r.status === 'Rejected').length})` },
          ]}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading reports..." />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<ShieldAlert size={48} />}
          title="No reports found"
          description="There are currently no reported listings under this category."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((rep) => {
            const conf = statusConfig[rep.status] || statusConfig.Pending;
            const reporter = rep.reportedBy;
            const prop = rep.propertyId;

            return (
              <div key={rep._id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag color={conf.color} style={{ fontWeight: 600 }}>
                      {conf.text.toUpperCase()}
                    </Tag>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                      Reported on {dayjs(rep.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </span>
                  </div>

                  {prop && (
                    <Link to={`/properties/${prop._id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.82rem' }}>
                      <ExternalLink size={13} /> View Listing
                    </Link>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                  {/* Complaint */}
                  <div>
                    <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.35rem' }}>
                      <AlertTriangle size={16} /> Reason: {rep.reason}
                    </div>
                    <div style={{ background: '#fef2f2', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fecaca', fontSize: '0.9rem', color: '#991b1b', lineHeight: 1.5 }}>
                      "{rep.description}"
                    </div>
                  </div>

                  {/* Property Info */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      Reported Listing Details:
                    </div>
                    {prop ? (
                      <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prop.title}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{prop.address}, {prop.city}</div>
                        <div style={{ marginTop: '4px' }}>Status: <Tag color={prop.status === 'Approved' ? 'green' : 'gold'}>{prop.status}</Tag></div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Property was removed or deleted.</div>
                    )}
                  </div>
                </div>

                {/* Reporter Info */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Reported by: <strong>{reporter?.name || 'User'}</strong> ({reporter?.email})
                </div>

                {/* Admin Note if resolved */}
                {rep.adminResponse && (
                  <div style={{ background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.85rem', color: '#166534', marginBottom: '1rem' }}>
                    <strong>Moderation Action:</strong> {rep.adminResponse}
                  </div>
                )}

                {/* Actions */}
                {rep.status === 'Pending' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleDismiss(rep._id)}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleOpenResolveModal(rep)}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                    >
                      Resolve & Take Action
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      <Modal
        title="Resolve Listing Report"
        open={Boolean(selectedReport)}
        onCancel={() => setSelectedReport(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedReport(null)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={resolving} onClick={handleResolve}>
            Confirm Resolution
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Admin Note / Action Description *
            </label>
            <TextArea
              rows={3}
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
            />
          </div>

          <Checkbox
            checked={removeProperty}
            onChange={(e) => setRemoveProperty(e.target.checked)}
          >
            <span style={{ color: '#dc2626', fontWeight: 600 }}>
              Reject and hide property listing from public search
            </span>
          </Checkbox>
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
