import React from 'react';

export const PropertyCardSkeleton = () => (
  <div className="glass-card" style={{ overflow: 'hidden', height: '390px' }}>
    <div className="skeleton" style={{ width: '100%', height: '210px' }} />
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ width: '80px', height: '20px' }} />
        <div className="skeleton" style={{ width: '60px', height: '20px' }} />
      </div>
      <div className="skeleton" style={{ width: '100%', height: '24px' }} />
      <div className="skeleton" style={{ width: '60%', height: '16px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <div className="skeleton" style={{ width: '100px', height: '28px' }} />
        <div className="skeleton" style={{ width: '90px', height: '32px' }} />
      </div>
    </div>
  </div>
);

export const EmptyState = ({
  icon,
  title = 'No records found',
  description = 'Try adjusting your search criteria or filters.',
  action,
}) => (
  <div
    style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      margin: '2rem 0',
    }}
  >
    {icon && <div style={{ color: 'var(--text-sub)' }}>{icon}</div>}
    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.95rem' }}>{description}</p>
    {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
  </div>
);
