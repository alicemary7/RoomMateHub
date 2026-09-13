import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import Rating from '../components/Rating';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  MapPin,
  ShieldCheck,
  Heart,
  Calendar,
  MessageSquare,
  Flag,
  Check,
  User,
  Phone,
  Mail,
  Home,
  Bed,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Tag, Modal, Input, DatePicker, Select, Button, message, Spin, Rate } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isTenant } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Modals
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState(null);
  const [visitTime, setVisitTime] = useState('10:00 AM - 11:00 AM');
  const [visitNotes, setVisitNotes] = useState('');
  const [submittingVisit, setSubmittingVisit] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Incorrect Information / Photos');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/properties/${id}`);
      if (res.data?.success) {
        setProperty(res.data.data);
        setIsFavorited(res.data.data.isFavorited || false);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      message.info('Please log in as a Tenant to save properties');
      navigate('/login');
      return;
    }
    if (!isTenant) {
      message.warning('Only tenants can save favorites');
      return;
    }

    try {
      if (isFavorited) {
        await API.delete(`/favorites/${property._id}`);
        setIsFavorited(false);
        message.success('Removed from favorites');
      } else {
        await API.post(`/favorites/${property._id}`);
        setIsFavorited(true);
        message.success('Added to favorites');
      }
    } catch (err) {
      message.error(err.message || 'Failed to update favorites');
    }
  };

  const handleSendInquiry = async () => {
    if (!inquiryMessage.trim()) {
      message.error('Please type your inquiry message');
      return;
    }

    setSubmittingInquiry(true);
    try {
      await API.post('/inquiries', {
        propertyId: property._id,
        message: inquiryMessage,
      });
      message.success('Inquiry sent successfully to the property owner!');
      setInquiryModalOpen(false);
      setInquiryMessage('');
    } catch (err) {
      message.error(err.message || 'Failed to send inquiry');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleScheduleVisit = async () => {
    if (!visitDate) {
      message.error('Please pick a visit date');
      return;
    }

    setSubmittingVisit(true);
    try {
      await API.post('/visits', {
        propertyId: property._id,
        visitDate: visitDate.toISOString(),
        visitTime,
        notes: visitNotes,
      });
      message.success('Visit scheduled successfully! Waiting for owner confirmation.');
      setVisitModalOpen(false);
      setVisitDate(null);
      setVisitNotes('');
    } catch (err) {
      message.error(err.message || 'Failed to schedule visit');
    } finally {
      setSubmittingVisit(false);
    }
  };

  const handleReportListing = async () => {
    if (!reportDesc.trim()) {
      message.error('Please provide a brief description of the issue');
      return;
    }

    setSubmittingReport(true);
    try {
      await API.post('/reports', {
        propertyId: property._id,
        reason: reportReason,
        description: reportDesc,
      });
      message.success('Report submitted to moderation team. Thank you!');
      setReportModalOpen(false);
      setReportDesc('');
    } catch (err) {
      message.error(err.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      message.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await API.post('/reviews', {
        propertyId: property._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      message.success('Review submitted successfully!');
      setReviewComment('');
      fetchProperty();
    } catch (err) {
      message.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="Loading property details..." />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Property not found</h2>
        <Link to="/properties" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  const genderTagColor = {
    Male: 'blue',
    Female: 'magenta',
    Any: 'purple',
  }[property.genderPreference || 'Any'];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to={`/properties?city=${property.city}`} style={{ color: 'var(--text-muted)' }}>{property.city}</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{property.title}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleToggleFavorite}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
            {isFavorited ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={() => setReportModalOpen(true)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#dc2626' }}
          >
            <Flag size={16} /> Report
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }} className="details-layout">
        {/* Left Column: Photos & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Gallery */}
          <ImageGallery images={property.images} />

          {/* Heading Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <Tag color={genderTagColor} style={{ fontSize: '0.85rem', padding: '2px 8px', fontWeight: 600 }}>
                {property.genderPreference} Preferred
              </Tag>
              <Tag color="cyan" style={{ fontSize: '0.85rem', padding: '2px 8px' }}>
                {property.propertyType}
              </Tag>
              <Tag color="geekblue" style={{ fontSize: '0.85rem', padding: '2px 8px' }}>
                {property.roomType}
              </Tag>
              {property.isVerified && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                  <ShieldCheck size={16} /> Verified Property
                </div>
              )}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              {property.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>{property.address}, {property.city}, {property.state} {property.pincode && `- ${property.pincode}`}</span>
            </div>
          </div>

          {/* Key Specs Card */}
          <div
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Room Sharing</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginTop: '2px' }}>
                {property.roomType}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Furnishing</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginTop: '2px' }}>
                {property.furnishing}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Security Deposit</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginTop: '2px' }}>
                ₹{property.securityDeposit?.toLocaleString('en-IN') || '0'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available From</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginTop: '2px' }}>
                {property.availableFrom ? dayjs(property.availableFrom).format('DD MMM YYYY') : 'Immediate'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>About this Accommodation</h3>
            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Amenities & Facilities</h3>
            {property.amenities && property.amenities.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Basic standard amenities provided.</p>
            )}
          </div>

          {/* Reviews Section */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ratings & Reviews</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Rating value={property.avgRating} totalReviews={property.totalReviews} size={20} />
                </div>
              </div>
            </div>

            {/* Submit Review Form for Tenant */}
            {isTenant && (
              <form onSubmit={handleSubmitReview} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Leave a Review</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <Rate value={reviewRating} onChange={setReviewRating} />
                </div>
                <TextArea
                  rows={3}
                  placeholder="Share your stay experience, food quality, cleanliness, WiFi speed..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ marginBottom: '0.75rem' }}
                />
                <Button type="primary" htmlType="submit" loading={submittingReview}>
                  Submit Review
                </Button>
              </form>
            )}

            {/* Reviews List */}
            {property.reviews && property.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {property.reviews.map((rev) => (
                  <div key={rev._id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                          {rev.tenantId?.name ? rev.tenantId.name[0].toUpperCase() : 'T'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.tenantId?.name || 'Verified Tenant'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                            {dayjs(rev.createdAt).format('DD MMM YYYY')}
                          </div>
                        </div>
                      </div>
                      <Rate disabled defaultValue={rev.rating} style={{ fontSize: '14px' }} />
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, paddingLeft: '44px' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Sidebar */}
        <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Rent & Action Card */}
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                ₹{property.monthlyRent?.toLocaleString('en-IN')}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>/ month</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.75rem' }}>
              <CheckCircle2 size={16} /> Zero Brokerage • Direct Owner Booking
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    message.info('Please sign in to schedule a property visit');
                    navigate('/login');
                    return;
                  }
                  setVisitModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              >
                <Calendar size={18} /> Schedule a Free Visit
              </button>

              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    message.info('Please sign in to send an inquiry to the owner');
                    navigate('/login');
                    return;
                  }
                  setInquiryModalOpen(true);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              >
                <MessageSquare size={18} /> Contact Owner / Send Inquiry
              </button>
            </div>
          </div>

          {/* Owner Profile Card */}
          {property.ownerId && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.85rem' }}>
                Property Managed By
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={property.ownerId.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={property.ownerId.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{property.ownerId.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Property Host</div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {property.ownerId.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={15} color="var(--primary)" />
                    <span>+91 {property.ownerId.phone}</span>
                  </div>
                )}
                {property.ownerId.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={15} color="var(--primary)" />
                    <span>{property.ownerId.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inquiry Modal */}
      <Modal
        title={`Contact Owner for ${property.title}`}
        open={inquiryModalOpen}
        onCancel={() => setInquiryModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setInquiryModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={submittingInquiry} onClick={handleSendInquiry}>
            Send Message
          </Button>,
        ]}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Have questions about the room sharing, food menu, gate curfew, or deposit? Message the owner directly.
        </p>
        <TextArea
          rows={4}
          placeholder="Hi, I am interested in this room. Is it available for immediate move-in?..."
          value={inquiryMessage}
          onChange={(e) => setInquiryMessage(e.target.value)}
        />
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal
        title="Schedule a Property Visit"
        open={visitModalOpen}
        onCancel={() => setVisitModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setVisitModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={submittingVisit} onClick={handleScheduleVisit}>
            Confirm Visit Request
          </Button>,
        ]}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Pick a date and time slot for your physical tour of <strong>{property.title}</strong>.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Select Date *
            </label>
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              value={visitDate}
              onChange={setVisitDate}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Preferred Time Slot *
            </label>
            <Select
              style={{ width: '100%' }}
              value={visitTime}
              onChange={setVisitTime}
              options={[
                { value: '09:00 AM - 10:00 AM', label: '09:00 AM - 10:00 AM' },
                { value: '10:00 AM - 11:00 AM', label: '10:00 AM - 11:00 AM' },
                { value: '11:00 AM - 12:00 PM', label: '11:00 AM - 12:00 PM' },
                { value: '02:00 PM - 03:00 PM', label: '02:00 PM - 03:00 PM' },
                { value: '04:00 PM - 05:00 PM', label: '04:00 PM - 05:00 PM' },
                { value: '06:00 PM - 07:00 PM', label: '06:00 PM - 07:00 PM' },
              ]}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Notes for Owner (Optional)
            </label>
            <TextArea
              rows={2}
              placeholder="e.g. Planning to visit with my college roommate..."
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        title="Report Property Listing"
        open={reportModalOpen}
        onCancel={() => setReportModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setReportModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" danger type="primary" loading={submittingReport} onClick={handleReportListing}>
            Submit Report
          </Button>,
        ]}
      >
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Help us keep RoomMateHub safe. Please explain the issue with this listing.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Reason for Report *
            </label>
            <Select
              style={{ width: '100%' }}
              value={reportReason}
              onChange={setReportReason}
              options={[
                { value: 'Incorrect Information / Photos', label: 'Incorrect Information / Photos' },
                { value: 'Duplicate Listing', label: 'Duplicate Listing' },
                { value: 'Property No Longer Available', label: 'Property No Longer Available' },
                { value: 'Suspicious / Fraudulent', label: 'Suspicious / Fraudulent' },
                { value: 'Inappropriate Content', label: 'Inappropriate Content' },
                { value: 'Other', label: 'Other' },
              ]}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              Detailed Description *
            </label>
            <TextArea
              rows={3}
              placeholder="Please provide details about what is wrong..."
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <style>{`
        @media (max-width: 900px) {
          .details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;
