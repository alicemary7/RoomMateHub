import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import PropertyCard from '../components/PropertyCard';
import { PropertyCardSkeleton, EmptyState } from '../components/LoadingSkeleton';
import API from '../services/api';
import { Search, SlidersHorizontal, ArrowUpDown, Building, MapPin, X } from 'lucide-react';
import { Select, Pagination, Drawer, Button } from 'antd';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse filters from URL search params
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    minRent: Number(searchParams.get('minRent')) || 2000,
    maxRent: Number(searchParams.get('maxRent')) || 30000,
    propertyType: searchParams.getAll('propertyType').length ? searchParams.getAll('propertyType') : (searchParams.get('propertyType') || 'All'),
    roomType: searchParams.getAll('roomType').length ? searchParams.getAll('roomType') : (searchParams.get('roomType') || 'All'),
    genderPreference: searchParams.get('genderPreference') || 'All',
    furnishing: searchParams.get('furnishing') || 'All',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
    isVerified: searchParams.get('isVerified') === 'true',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city && filters.city !== 'All') params.set('city', filters.city);
      if (filters.search) params.set('search', filters.search);
      if (filters.minRent) params.set('minRent', filters.minRent);
      if (filters.maxRent) params.set('maxRent', filters.maxRent);
      if (filters.genderPreference && filters.genderPreference !== 'All') params.set('genderPreference', filters.genderPreference);
      if (filters.furnishing && filters.furnishing !== 'All') params.set('furnishing', filters.furnishing);
      if (filters.isVerified) params.set('isVerified', 'true');
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      params.set('page', filters.page || 1);
      params.set('limit', 12);

      if (Array.isArray(filters.propertyType) && filters.propertyType.length > 0) {
        filters.propertyType.forEach((pt) => params.append('propertyType', pt));
      } else if (filters.propertyType && filters.propertyType !== 'All') {
        params.set('propertyType', filters.propertyType);
      }

      if (Array.isArray(filters.roomType) && filters.roomType.length > 0) {
        filters.roomType.forEach((rt) => params.append('roomType', rt));
      } else if (filters.roomType && filters.roomType !== 'All') {
        params.set('roomType', filters.roomType);
      }

      if (filters.amenities && filters.amenities.length > 0) {
        params.set('amenities', filters.amenities.join(','));
      }

      // Sync URL
      setSearchParams(params);

      const res = await API.get(`/properties?${params.toString()}`);
      if (res.data?.success) {
        setProperties(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      city: '',
      search: '',
      minRent: 2000,
      maxRent: 30000,
      propertyType: 'All',
      roomType: 'All',
      genderPreference: 'All',
      furnishing: 'All',
      amenities: [],
      isVerified: false,
      sortBy: 'newest',
      page: 1,
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Search Header Bar */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          padding: '1.25rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by area, college, tech park or title..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn btn-secondary mobile-filter-btn"
            style={{ display: 'none', gap: '0.4rem' }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Sort by:</span>
            <Select
              value={filters.sortBy}
              onChange={(val) => setFilters({ ...filters, sortBy: val, page: 1 })}
              style={{ width: 170 }}
              options={[
                { value: 'newest', label: 'Newest Listed' },
                { value: 'price_asc', label: 'Rent: Low to High' },
                { value: 'price_desc', label: 'Rent: High to Low' },
                { value: 'oldest', label: 'Oldest' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Properties */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '2rem', alignItems: 'start' }} className="properties-layout">
        {/* Desktop Filter Sidebar */}
        <aside className="desktop-filters" style={{ position: 'sticky', top: '90px' }}>
          <FilterPanel
            filters={filters}
            onFilterChange={(updated) => setFilters({ ...updated, page: 1 })}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Property Grid Results */}
        <main>
          {/* Results Summary */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {loading ? 'Searching properties...' : `${pagination.total} Accommodations Available`}
            </div>
            {filters.city && filters.city !== 'All' && (
              <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600 }}>
                In {filters.city}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid-responsive">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              icon={<Building size={48} />}
              title="No properties match your filters"
              description="Try broadening your rent budget, removing amenity filters, or searching in adjacent Chennai areas."
              action={
                <button onClick={handleResetFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid-responsive">
                {properties.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                  <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onChange={(newPage) => {
                      setFilters({ ...filters, page: newPage });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        title="Filter Properties"
        placement="left"
        onClose={() => setMobileFilterOpen(false)}
        open={mobileFilterOpen}
        width={320}
      >
        <FilterPanel
          filters={filters}
          onFilterChange={(updated) => {
            setFilters({ ...updated, page: 1 });
          }}
          onReset={handleResetFilters}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <Button type="primary" block onClick={() => setMobileFilterOpen(false)}>
            Show {pagination.total} Results
          </Button>
        </div>
      </Drawer>

      <style>{`
        @media (max-width: 900px) {
          .properties-layout {
            grid-template-columns: 1fr !important;
          }
          .desktop-filters {
            display: none !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Properties;
