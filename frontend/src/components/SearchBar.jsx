import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Home, IndianRupee } from 'lucide-react';
import { Select, Input } from 'antd';

const popularLocations = ['All', 'OMR', 'Velachery', 'Guindy', 'Anna Nagar', 'Adyar', 'Tambaram', 'Sholinganallur'];

const SearchBar = ({ initialCity = '', initialType = 'All', initialRoom = 'All' }) => {
  const [city, setCity] = useState(initialCity);
  const [propertyType, setPropertyType] = useState(initialType);
  const [roomType, setRoomType] = useState(initialRoom);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (city && city !== 'All') params.set('city', city);
    if (propertyType && propertyType !== 'All') params.set('propertyType', propertyType);
    if (roomType && roomType !== 'All') params.set('roomType', roomType);

    navigate(`/properties?${params.toString()}`);
  };

  const handleLocationChipClick = (loc) => {
    setCity(loc);
    const params = new URLSearchParams();
    if (loc !== 'All') params.set('city', loc);
    if (propertyType && propertyType !== 'All') params.set('propertyType', propertyType);
    if (roomType && roomType !== 'All') params.set('roomType', roomType);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto' }}>
      {/* Search Input Bar */}
      <form
        onSubmit={handleSearch}
        className="glass-panel"
        style={{
          padding: '0.85rem',
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {/* City / Location Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Enter location (e.g. OMR, Velachery)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              fontWeight: 500,
            }}
          />
        </div>

        {/* Property Type Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Building size={18} color="var(--primary)" style={{ flexShrink: 0, marginLeft: 6 }} />
          <Select
            value={propertyType}
            onChange={setPropertyType}
            bordered={false}
            style={{ width: '100%' }}
            options={[
              { value: 'All', label: 'All Property Types' },
              { value: 'PG', label: 'Paying Guest (PG)' },
              { value: 'Hostel', label: 'Hostel' },
              { value: 'Apartment', label: 'Apartment / Flat' },
              { value: 'House', label: 'House / Villa' },
              { value: 'Shared Room', label: 'Shared Room' },
            ]}
          />
        </div>

        {/* Room Type Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.2rem 0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <Home size={18} color="var(--primary)" style={{ flexShrink: 0, marginLeft: 6 }} />
          <Select
            value={roomType}
            onChange={setRoomType}
            bordered={false}
            style={{ width: '100%' }}
            options={[
              { value: 'All', label: 'All Room Sharing' },
              { value: 'Single', label: 'Single Private Room' },
              { value: 'Double Sharing', label: 'Double Sharing' },
              { value: 'Triple Sharing', label: 'Triple Sharing' },
              { value: 'Multiple Sharing', label: 'Multiple Sharing' },
            ]}
          />
        </div>

        {/* Search CTA Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ height: '44px', padding: '0 1.75rem', fontSize: '0.95rem' }}
        >
          <Search size={18} />
          Search
        </button>
      </form>

      {/* Popular Chennai Hotspots Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Popular in Chennai:</span>
        {popularLocations.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocationChipClick(loc)}
            style={{
              background: (city === loc || (loc === 'All' && !city)) ? 'var(--primary)' : 'rgba(255, 255, 255, 0.9)',
              color: (city === loc || (loc === 'All' && !city)) ? 'white' : 'var(--text-main)',
              border: '1px solid',
              borderColor: (city === loc || (loc === 'All' && !city)) ? 'var(--primary)' : 'var(--border-light)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
