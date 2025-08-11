// components/cms/UserManagement.jsx
import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'editor',
    permissions: []
  });

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full access to all features',
      permissions: ['manage_users', 'manage_forms', 'view_analytics', 'manage_content', 'manage_settings']
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can create and edit content',
      permissions: ['manage_forms', 'manage_content', 'view_analytics']
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Can only view content and analytics',
      permissions: ['view_analytics']
    },
    {
      id: 'form_manager',
      name: 'Form Manager',
      description: 'Specializes in form creation and management',
      permissions: ['manage_forms', 'view_analytics']
    }
  ];

  const permissions = [
    { id: 'manage_users', name: 'Manage Users', description: 'Add, edit, and remove users' },
    { id: 'manage_forms', name: 'Manage Forms', description: 'Create, edit, and delete forms' },
    { id: 'view_analytics', name: 'View Analytics', description: 'Access form analytics and reports' },
    { id: 'manage_content', name: 'Manage Content', description: 'Create and edit page content' },
    { id: 'manage_settings', name: 'Manage Settings', description: 'Access system settings' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const user = await response.json();
        setUsers([...users, user]);
        setNewUser({ name: '', email: '', role: 'editor', permissions: [] });
        setShowAddUser(false);
      }
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const removeUser = async (userId) => {
    if (!confirm('Are you sure you want to remove this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  const getRolePermissions = (roleId) => {
    return roles.find(role => role.id === roleId)?.permissions || [];
  };

  // Mock data for demonstration
  const mockUsers = users.length > 0 ? users : [
    {
      id: '1',
      name: 'Pastor John',
      email: 'pastor@firstchurchofgod.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@firstchurchofgod.com',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-01-14T14:20:00Z',
      createdAt: '2024-01-05T00:00:00Z'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@firstchurchofgod.com',
      role: 'form_manager',
      status: 'active',
      lastLogin: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-10T00:00:00Z'
    }
  ];

  return (
    <div className="user-management">
      <style jsx>{`
        .user-management {
          padding: 24px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .management-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .management-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .add-user-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }

        .add-user-btn:hover {
          background: #2563eb;
        }

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .user-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .user-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .user-email {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .user-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-inactive {
          background: #fef2f2;
          color: #991b1b;
        }

        .user-role {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .role-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .role-name {
          font-weight: 500;
          color: #374151;
          text-transform: capitalize;
        }

        .role-description {
          font-size: 12px;
          color: #6b7280;
        }

        .role-select {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .user-permissions {
          margin-bottom: 16px;
        }

        .permissions-title {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .permissions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .permission-badge {
          background: #eff6ff;
          color: #3b82f6;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .user-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .user-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn {
          background: white;
          color: #374151;
        }

        .edit-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .remove-btn {
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        }

        .remove-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }

        .add-user-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 500px;
          margin: 20px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-input, .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .cancel-btn {
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
        }

        .save-btn {
          padding: 10px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .save-btn:hover {
          background: #2563eb;
        }

        .roles-overview {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .overview-title {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
        }

        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .role-card {
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }

        .role-card-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .role-card-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .role-permissions {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
      `}</style>

      <div className="management-header">
        <h1 className="management-title">👥 User Management</h1>
        <button className="add-user-btn" onClick={() => setShowAddUser(true)}>
          <span>+</span>
          Add User
        </button>
      </div>

      <div className="users-grid">
        {mockUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
              </div>
              <div className={`user-status status-${user.status}`}>
                {user.status}
              </div>
            </div>

            <div className="user-role">
              <div className="role-info">
                <div className="role-name">
                  {roles.find(r => r.id === user.role)?.name || user.role}
                </div>
                <div className="role-description">
                  {roles.find(r => r.id === user.role)?.description}
                </div>
              </div>
              <select
                className="role-select"
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="user-permissions">
              <div className="permissions-title">Permissions</div>
              <div className="permissions-list">
                {getRolePermissions(user.role).map(permissionId => (
                  <div key={permissionId} className="permission-badge">
                    {permissions.find(p => p.id === permissionId)?.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="user-meta">
              <span>Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
              <span>Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="user-actions">
              <button className="action-btn edit-btn">
                Edit
              </button>
              <button 
                className="action-btn remove-btn"
                onClick={() => removeUser(user.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="roles-overview">
        <h2 className="overview-title">📋 Role Definitions</h2>
        <div className="roles-grid">
          {roles.map(role => (
            <div key={role.id} className="role-card">
              <div className="role-card-title">{role.name}</div>
              <div className="role-card-description">{role.description}</div>
              <div className="role-permissions">
                {role.permissions.map(permissionId => (
                  <div key={permissionId} className="permission-badge">
                    {permissions.find(p => p.id === permissionId)?.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddUser && (
        <div className="add-user-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New User</h2>
              <button className="close-btn" onClick={() => setShowAddUser(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowAddUser(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={addUser}>
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
