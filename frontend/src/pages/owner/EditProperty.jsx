import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  Building2,
  Upload,
  Trash2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Input, Select, InputNumber, Checkbox, Button, message, DatePicker, Spin } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

const availableAmenities = [
  'WiFi',
  'AC',
  'Food Included',
  'Power Backup',
  'Geyser',
  'Washing Machine',
  'CCTV',
  'Gym',
  'Parking',
  'Lift',
  'RO Water',
  'Security Guard',
  'Balcony',
  'Housekeeping',
  'Kitchen Access',
];

const chennaiLocalities = [
  'OMR',
  'Sholinganallur',
  'Velachery',
  'Guindy',
  'Anna Nagar',
  'Adyar',
  'Tambaram',
  'Thoraipakkam',
  'Navalur',
  'Perungudi',
  'T. Nagar',
  'Porur',
];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'PG',
    roomType: 'Single',
    genderPreference: 'Any',
    monthlyRent: 8000,
    securityDeposit: 10000,
    address: '',
    city: 'OMR',
    state: 'Tamil Nadu',
    pincode: '600119',
    furnishing: 'Furnished',
    availableFrom: dayjs(),
    amenities: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await API.get(`/properties/${id}`);
        if (res.data?.success) {
          const p = res.data.data;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            propertyType: p.propertyType || 'PG',
            roomType: p.roomType || 'Single',
            genderPreference: p.genderPreference || 'Any',
            monthlyRent: p.monthlyRent || 0,
            securityDeposit: p.securityDeposit || 0,
            address: p.address || '',
            city: p.city || 'OMR',
            state: p.state || 'Tamil Nadu',
            pincode: p.pincode || '',
            furnishing: p.furnishing || 'Furnished',
            availableFrom: p.availableFrom ? dayjs(p.availableFrom) : dayjs(),
            amenities: p.amenities || [],
          });
          setExistingImages(p.images || []);
        }
      } catch (err) {
        message.error(err.message || 'Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles([...newFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...previews]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('propertyType', formData.propertyType);
      data.append('roomType', formData.roomType);
      data.append('genderPreference', formData.genderPreference);
      data.append('monthlyRent', formData.monthlyRent);
      data.append('securityDeposit', formData.securityDeposit);
      data.append('address', formData.address);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pincode', formData.pincode);
      data.append('furnishing', formData.furnishing);
      data.append('availableFrom', formData.availableFrom.toISOString());
      data.append('amenities', JSON.stringify(formData.amenities));
      data.append('existingImages', JSON.stringify(existingImages));

      newFiles.forEach((file) => {
        data.append('images', file);
      });

      const res = await API.put(`/properties/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        message.success('Property updated successfully!');
        navigate('/owner/properties');
      }
    } catch (err) {
      message.error(err.message || 'Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
        <Spin size="large" tip="Loading property details..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '860px' }}>
      <button
        onClick={() => navigate('/owner/properties')}
        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, marginBottom: '1rem' }}
      >
        <ArrowLeft size={16} /> Back to My Properties
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Edit Property Listing</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Update listing details, amenities, pricing, or photos.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Basic Details */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Basic Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Listing Title
              </label>
              <Input
                size="large"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  Property Type
                </label>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  value={formData.propertyType}
                  onChange={(val) => setFormData({ ...formData, propertyType: val })}
                  options={[
                    { value: 'PG', label: 'Paying Guest (PG)' },
                    { value: 'Hostel', label: 'Hostel' },
                    { value: 'Apartment', label: 'Apartment / Flat' },
                    { value: 'House', label: 'Independent House' },
                    { value: 'Shared Room', label: 'Shared Room' },
                  ]}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  Room Sharing
                </label>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  value={formData.roomType}
                  onChange={(val) => setFormData({ ...formData, roomType: val })}
                  options={[
                    { value: 'Single', label: 'Single (Private Room)' },
                    { value: 'Double Sharing', label: 'Double Sharing (2 Beds)' },
                    { value: 'Triple Sharing', label: 'Triple Sharing (3 Beds)' },
                    { value: 'Multiple Sharing', label: 'Multiple Sharing (4+ Beds)' },
                  ]}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  Gender Preference
                </label>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  value={formData.genderPreference}
                  onChange={(val) => setFormData({ ...formData, genderPreference: val })}
                  options={[
                    { value: 'Any', label: 'Any Gender / Co-living' },
                    { value: 'Male', label: 'Male / Boys Only' },
                    { value: 'Female', label: 'Female / Girls Only' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Description
              </label>
              <TextArea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Rent & Availability</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Monthly Rent (₹)
              </label>
              <InputNumber
                size="large"
                style={{ width: '100%' }}
                value={formData.monthlyRent}
                onChange={(val) => setFormData({ ...formData, monthlyRent: val })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Security Deposit (₹)
              </label>
              <InputNumber
                size="large"
                style={{ width: '100%' }}
                value={formData.securityDeposit}
                onChange={(val) => setFormData({ ...formData, securityDeposit: val })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Furnishing
              </label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formData.furnishing}
                onChange={(val) => setFormData({ ...formData, furnishing: val })}
                options={[
                  { value: 'Furnished', label: 'Fully Furnished' },
                  { value: 'Semi-Furnished', label: 'Semi-Furnished' },
                  { value: 'Unfurnished', label: 'Unfurnished' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Location</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Locality / Area
              </label>
              <Select
                size="large"
                style={{ width: '100%' }}
                value={formData.city}
                onChange={(val) => setFormData({ ...formData, city: val })}
                options={chennaiLocalities.map((loc) => ({ value: loc, label: loc }))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Complete Address
              </label>
              <Input
                size="large"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Amenities</h3>
          <Checkbox.Group
            options={availableAmenities}
            value={formData.amenities}
            onChange={(checked) => setFormData({ ...formData, amenities: checked })}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}
          />
        </div>

        {/* Section 5: Photos */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Property Photos</h3>

          {/* Existing Photos */}
          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                Current Photos:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
                {existingImages.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                    <img src={img.url} alt={`Existing ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload More Photos */}
          <div
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
            onClick={() => document.getElementById('edit-file-upload').click()}
          >
            <Upload size={30} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Upload additional photos to Supabase Storage</div>
            <input
              id="edit-file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {newPreviews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
              {newPreviews.map((src, idx) => (
                <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #818cf8' }}>
                  <img src={src} alt={`New Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/owner/properties')}
            className="btn btn-secondary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            {submitting ? 'Saving Changes...' : 'Save & Update Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
