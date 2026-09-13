import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  Building2,
  Upload,
  Plus,
  Trash2,
  MapPin,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Input, Select, InputNumber, Checkbox, Radio, Button, message, DatePicker } from 'antd';
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

const AddProperty = () => {
  const navigate = useNavigate();
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
    amenities: ['WiFi', 'Power Backup', 'RO Water', 'CCTV'],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 10) {
      message.warning('Maximum 10 images allowed per listing');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.address || !formData.city) {
      message.error('Please fill in all mandatory fields');
      return;
    }

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

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      const res = await API.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        message.success('Property submitted successfully! It is now pending admin approval.');
        navigate('/owner/properties');
      }
    } catch (err) {
      message.error(err.message || 'Failed to create property listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem', maxWidth: '860px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>List a New Property</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Provide accurate details and clear photos of your accommodation in Chennai.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Basic Details */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            1. Basic Property Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Listing Title *
              </label>
              <Input
                placeholder="e.g. Modern Luxury PG for Men near OMR Tech Park"
                size="large"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  Property Type *
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
                  Room Sharing *
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
                  Gender Preference *
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
                Detailed Description *
              </label>
              <TextArea
                rows={4}
                placeholder="Describe your room, cleanliness, food offerings, nearby landmarks, metro/bus connectivity..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Availability */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            2. Rent & Availability
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Monthly Rent (₹) *
              </label>
              <InputNumber
                size="large"
                style={{ width: '100%' }}
                min={500}
                max={100000}
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
                min={0}
                max={200000}
                value={formData.securityDeposit}
                onChange={(val) => setFormData({ ...formData, securityDeposit: val })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Available From
              </label>
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                value={formData.availableFrom}
                onChange={(val) => setFormData({ ...formData, availableFrom: val || dayjs() })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Furnishing Status
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

        {/* Section 3: Location Details */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            3. Property Location in Chennai
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Locality / Area *
              </label>
              <Select
                size="large"
                style={{ width: '100%' }}
                showSearch
                value={formData.city}
                onChange={(val) => setFormData({ ...formData, city: val })}
                options={chennaiLocalities.map((loc) => ({ value: loc, label: loc }))}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Complete Street Address *
              </label>
              <Input
                size="large"
                placeholder="e.g. Plot 45, Elcot SEZ Main Road, Near Infosys Gate"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  Pincode
                </label>
                <Input
                  size="large"
                  placeholder="600119"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  State
                </label>
                <Input size="large" disabled value={formData.state} />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
            4. Amenities & Services
          </h3>

          <Checkbox.Group
            options={availableAmenities}
            value={formData.amenities}
            onChange={(checked) => setFormData({ ...formData, amenities: checked })}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}
          />
        </div>

        {/* Section 5: Image Uploads */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            5. Property Images (Supabase Storage)
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Upload up to 10 high-resolution photos of rooms, bathrooms, building facade, and common areas.
          </p>

          <div
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              marginBottom: '1.5rem',
            }}
            onClick={() => document.getElementById('file-upload-input').click()}
          >
            <Upload size={36} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Click to select images to upload</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              PNG, JPG, or WebP (Max 5MB each)
            </div>
            <input
              id="file-upload-input"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Previews Grid */}
          {imagePreviews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
              {imagePreviews.map((src, index) => (
                <div key={index} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <img src={src} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
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

        {/* Submit Action */}
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
            {submitting ? 'Uploading to Supabase & Saving...' : 'Submit Listing For Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
