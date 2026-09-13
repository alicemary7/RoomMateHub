import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  UserX,
  UserCheck,
} from 'lucide-react';
import { Table, Tag, Input, Select, Button, message, Modal, Avatar } from 'antd';
import dayjs from 'dayjs';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter !== 'All') params.set('role', roleFilter);

      const res = await API.get(`/admin/users?${params.toString()}`);
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      message.error(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = (user) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    Modal.confirm({
      title: `${action.toUpperCase()} Account?`,
      content: `Are you sure you want to ${action} ${user.name}'s account (${user.email})?`,
      okText: `Yes, ${action}`,
      okType: user.isActive ? 'danger' : 'primary',
      onOk: async () => {
        try {
          const res = await API.patch(`/admin/users/${user._id}/toggle-status`);
          message.success(res.data?.message || 'Status updated');
          fetchUsers();
        } catch (err) {
          message.error(err.message || 'Failed to update user status');
        }
      },
    });
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Avatar src={record.profileImage} style={{ backgroundColor: 'var(--primary)' }}>
            {record.name[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{record.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const color = role === 'admin' ? 'gold' : role === 'owner' ? 'purple' : 'blue';
        return <Tag color={color} style={{ textTransform: 'capitalize', fontWeight: 600 }}>{role}</Tag>;
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || <span style={{ color: 'var(--text-sub)' }}>Not provided</span>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Deactivated'}
        </Tag>
      ),
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.role === 'admin') return <span style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>Admin</span>;

        return (
          <button
            onClick={() => handleToggleStatus(record)}
            className="btn btn-outline"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              color: record.isActive ? '#ef4444' : '#10b981',
              borderColor: record.isActive ? '#fca5a5' : '#86efac',
            }}
          >
            {record.isActive ? (
              <>
                <UserX size={14} /> Deactivate
              </>
            ) : (
              <>
                <UserCheck size={14} /> Activate
              </>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
          Account Directory
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Users & Hosts</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Inspect tenant and property owner accounts across RoomMateHub.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-light)', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Filter Role:</span>
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 140 }}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'tenant', label: 'Tenants' },
              { value: 'owner', label: 'Owners' },
              { value: 'admin', label: 'Admins' },
            ]}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
