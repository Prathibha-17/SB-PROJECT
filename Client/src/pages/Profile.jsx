import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import OrderCard from '../components/OrderCard';
import { User, Mail, Shield, Save, CheckCircle2, Lock, ShoppingBag, Clock } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { orders } = useBooks();

  // Profile update form states
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter orders for the logged-in user
  const userOrders = orders.filter(order => order.userId === user?.id);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg('Name field is required');
      return;
    }

    if (password && password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await updateProfile({
        name,
        password: password || undefined
      });
      setSuccessMsg('Your profile details were updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title text-gradient">My Account</h1>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>Manage your personal details and view your ordering history.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-3" style={{ gap: '32px', gridTemplateColumns: '1fr 2fr', alignItems: 'start' }}>
        
        {/* Left Column: Profile Card & Settings Form */}
        <div className="flex flex-col gap-lg">
          {/* Avatar Banner Card */}
          <div className="card flex flex-col align-center text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--accent)',
                marginBottom: '16px'
              }} 
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>{user?.name}</h3>
            <div className="flex align-center gap-sm text-secondary" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>

            <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-accent'}`} style={{ textTransform: 'uppercase', padding: '6px 12px' }}>
              <Shield size={12} style={{ marginRight: '4px' }} />
              {user?.role} Account
            </span>
          </div>

          {/* Edit Profile Form */}
          <div className="card" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} style={{ color: 'var(--accent)' }} />
              <span>Update Details</span>
            </h4>

            {successMsg && (
              <div className="badge badge-success" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                textTransform: 'none',
                letterSpacing: 'none',
                lineHeight: '1.4'
              }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="badge badge-danger" style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '16px',
                textAlign: 'center',
                textTransform: 'none',
                letterSpacing: 'none',
                lineHeight: '1.4'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                    required
                  />
                  <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="profile-password">New Password (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="profile-password"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="profile-confirm-password">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="profile-confirm-password"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '44px', boxSizing: 'border-box' }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', gap: '8px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
              >
                <Save size={16} />
                <span>{loading ? 'Saving Updates...' : 'Save Settings'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order History List */}
        <div className="flex flex-col gap-lg">
          <div className="card" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={20} style={{ color: 'var(--accent)' }} />
              <span>Purchase History ({userOrders.length})</span>
            </h2>

            {userOrders.length > 0 ? (
              <div className="flex flex-col gap-lg">
                {userOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col align-center justify-center gap-md" style={{
                textAlign: 'center',
                padding: '60px 20px',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)'
              }}>
                <Clock size={36} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>No Orders Found</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '300px' }}>
                  You haven't placed any purchases yet. Your completed receipts will show up here.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
      <style>{`
        @media (max-width: 1024px) {
          .grid-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
