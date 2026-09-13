import React from 'react';
import { Slider, Checkbox, Radio, Switch, Button } from 'antd';
import { Filter, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

const allAmenities = [
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

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const handleRentChange = (value) => {
    onFilterChange({
      ...filters,
      minRent: value[0],
      maxRent: value[1],
    });
  };

  const handleGenderChange = (e) => {
    onFilterChange({ ...filters, genderPreference: e.target.value });
  };

  const handleFurnishingChange = (e) => {
    onFilterChange({ ...filters, furnishing: e.target.value });
  };

  const handleAmenityChange = (checkedValues) => {
    onFilterChange({ ...filters, amenities: checkedValues });
  };

  const handleVerifiedToggle = (checked) => {
    onFilterChange({ ...filters, isVerified: checked });
  };

  const handlePropertyTypeChange = (checkedValues) => {
    onFilterChange({ ...filters, propertyType: checkedValues });
  };

  const handleRoomTypeChange = (checkedValues) => {
    onFilterChange({ ...filters, roomType: checkedValues });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Header & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
          <Filter size={18} color="var(--primary)" /> Filters
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Verified Only Switch */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--success-bg)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 600, fontSize: '0.9rem' }}>
          <ShieldCheck size={18} color="#059669" /> Verified Only
        </div>
        <Switch checked={Boolean(filters.isVerified)} onChange={handleVerifiedToggle} />
      </div>

      {/* Monthly Rent Range */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Monthly Rent</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            ₹{(filters.minRent || 2000).toLocaleString('en-IN')} - ₹{(filters.maxRent || 30000).toLocaleString('en-IN')}
          </span>
        </div>
        <Slider
          range
          min={2000}
          max={30000}
          step={500}
          value={[filters.minRent || 2000, filters.maxRent || 30000]}
          onChange={handleRentChange}
        />
      </div>

      {/* Gender Preference */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.65rem' }}>Gender Preference</h4>
        <Radio.Group value={filters.genderPreference || 'All'} onChange={handleGenderChange}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Radio value="All">Any Gender</Radio>
            <Radio value="Male">Male / Boys Only</Radio>
            <Radio value="Female">Female / Girls Only</Radio>
          </div>
        </Radio.Group>
      </div>

      {/* Property Type */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.65rem' }}>Property Type</h4>
        <Checkbox.Group
          value={Array.isArray(filters.propertyType) ? filters.propertyType : (filters.propertyType && filters.propertyType !== 'All' ? [filters.propertyType] : [])}
          onChange={handlePropertyTypeChange}
          style={{ width: '100%' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Checkbox value="PG">Paying Guest (PG)</Checkbox>
            <Checkbox value="Hostel">Hostel</Checkbox>
            <Checkbox value="Apartment">Apartment / Flat</Checkbox>
            <Checkbox value="House">Independent House</Checkbox>
            <Checkbox value="Shared Room">Shared Room</Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* Room Sharing Type */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.65rem' }}>Room Sharing</h4>
        <Checkbox.Group
          value={Array.isArray(filters.roomType) ? filters.roomType : (filters.roomType && filters.roomType !== 'All' ? [filters.roomType] : [])}
          onChange={handleRoomTypeChange}
          style={{ width: '100%' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Checkbox value="Single">Single Room (Private)</Checkbox>
            <Checkbox value="Double Sharing">Double Sharing (2 Beds)</Checkbox>
            <Checkbox value="Triple Sharing">Triple Sharing (3 Beds)</Checkbox>
            <Checkbox value="Multiple Sharing">Multiple Sharing (4+ Beds)</Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* Furnishing */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.65rem' }}>Furnishing</h4>
        <Radio.Group value={filters.furnishing || 'All'} onChange={handleFurnishingChange}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Radio value="All">Any Furnishing</Radio>
            <Radio value="Furnished">Fully Furnished</Radio>
            <Radio value="Semi-Furnished">Semi-Furnished</Radio>
            <Radio value="Unfurnished">Unfurnished</Radio>
          </div>
        </Radio.Group>
      </div>

      {/* Amenities */}
      <div>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.65rem' }}>Amenities</h4>
        <Checkbox.Group
          options={allAmenities}
          value={filters.amenities || []}
          onChange={handleAmenityChange}
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
