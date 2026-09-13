import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { EmptyState } from '../../components/LoadingSkeleton';
import {
  MessageSquare,
  User,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Building,
} from 'lucide-react';
import { Tag, Modal, Input, Button, message, Tabs, Spin } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const OwnerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await API.get('/inquiries/owner');
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

  const handleOpenReplyModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setReplyText(inquiry.ownerResponse || '');
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      message.error('Please enter your response message');
      return;
    }

    setReplying(true);
    try {
      await API.patch(`/inquiries/${selectedInquiry._id}/respond`, {
        ownerResponse: replyText,
      });
      message.success('Response sent to tenant');
      setSelectedInquiry(null);
      setReplyText('');
      fetchInquiries();
    } catch (err) {
      message.error(err.message || 'Failed to send response');
    } finally {
      setReplying(false);
    }
  };

  const filtered =
    activeTab === 'All' ? inquiries : inquiries.filter((i) => i.status === activeTab);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          Tenant Communication
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Inquiries & Messages</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Respond to student and professional inquiries regarding rent, availability, and facilities.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'All', label: `All Inquiries (${inquiries.length})` },
            { key: 'Pending', label: `Pending Reply (${inquiries.filter((i) => i.status === 'Pending').length})` },
            { key: 'Responded', label: `Responded (${inquiries.filter((i) => i.status === 'Responded').length})` },
            { key: 'Closed', label: `Closed (${inquiries.filter((i) => i.status === 'Closed').length})` },
          ]}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <Spin size="large" tip="Loading inquiries..." />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={48} />}
          title="No inquiries found"
          description="You do not have any inquiries in this category."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((inq) => {
            const tenant = inq.tenantId;
            const prop = inq.propertyId;
            const statusColor = inq.status === 'Responded' ? 'green' : inq.status === 'Closed' ? 'default' : 'gold';

            return (
              <div key={inq._id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Tag color={statusColor} style={{ fontWeight: 600 }}>
                      {inq.status.toUpperCase()}
                    </Tag>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                      {dayjs(inq.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>
                    Property: {prop?.title || 'Listing'}
                  </div>
                </div>

                {/* Tenant Question */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: inq.ownerResponse ? '1.25rem' : '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>
                    <User size={20} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{tenant?.name || 'Prospective Tenant'}</strong>
                      {tenant?.email && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={13} /> {tenant.email}
                        </span>
                      )}
                      {tenant?.phone && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {tenant.phone}
                        </span>
                      )}
                    </div>
                    <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.92rem', color: 'var(--text-main)', border: '1px solid #e2e8f0' }}>
                      {inq.message}
                    </div>
                  </div>
                </div>

                {/* Host Response */}
                {inq.ownerResponse && (
                  <div style={{ paddingLeft: '3.5rem', marginBottom: '1rem' }}>
                    <div style={{ background: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700, marginBottom: '2px' }}>
                        Your Response:
                      </div>
                      <div style={{ color: '#166534', fontSize: '0.92rem' }}>
                        {inq.ownerResponse}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleOpenReplyModal(inq)}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    <Send size={14} /> {inq.ownerResponse ? 'Update Response' : 'Reply to Tenant'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        title={`Respond to ${selectedInquiry?.tenantId?.name || 'Tenant'}`}
        open={Boolean(selectedInquiry)}
        onCancel={() => setSelectedInquiry(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedInquiry(null)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={replying} onClick={handleSendReply}>
            Send Response
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tenant Question:</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
            "{selectedInquiry?.message}"
          </div>
        </div>

        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          Your Reply Message *
        </label>
        <TextArea
          rows={4}
          placeholder="Type your reply here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default OwnerInquiries;
