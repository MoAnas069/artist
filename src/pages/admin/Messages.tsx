import { useEffect, useState } from 'react';
import { Mail, Archive, Trash2, Eye, ShoppingBag, Phone, MapPin, Package, ExternalLink } from 'lucide-react';
import { getMessages, updateMessageStatus, deleteMessage } from '../../services/messageService';
import type { ContactMessage, MessageStatus } from '../../types';
import { formatEditorialDate } from '../../utils/helpers';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

type FilterType = 'all' | 'shop' | 'unread' | 'read' | 'archived';

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    getMessages()
      .then((data) => {
        setMessages(data);
        if (selected) {
          const updated = data.find((m) => m.id === selected.id);
          if (updated) setSelected(updated);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener('studio_messages_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('studio_messages_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleStatusChange = async (msg: ContactMessage, status: MessageStatus) => {
    try {
      await updateMessageStatus(msg.id, status);
      showToast(`Message marked as ${status}`);
      load();
      if (selected?.id === msg.id) setSelected({ ...msg, status });
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMessage(deleteTarget.id);
      showToast('Message deleted');
      if (selected?.id === deleteTarget.id) setSelected(null);
      load();
    } catch {
      showToast('Failed to delete', 'error');
    }
    setDeleteTarget(null);
  };

  const filtered = messages.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'shop') return m.inquiryType === 'shop' || !!m.productTitle || m.projectType?.toLowerCase().includes('shop');
    return m.status === filter;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const shopCount = messages.filter((m) => m.inquiryType === 'shop' || !!m.productTitle || m.projectType?.toLowerCase().includes('shop')).length;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Inquiries & Messages</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {messages.length} total · {unreadCount} unread · {shopCount} shop acquisitions
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: `All (${messages.length})` },
          { key: 'shop', label: `Shop Inquiries (${shopCount})` },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'read', label: 'Read' },
          { key: 'archived', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as FilterType)}
            className="admin-btn"
            style={{
              backgroundColor: filter === tab.key ? 'var(--color-charcoal)' : 'white',
              color: filter === tab.key ? 'white' : '#6b7280',
              border: filter === tab.key ? 'none' : '1px solid #e5e7eb',
              fontSize: '0.75rem',
              fontWeight: filter === tab.key ? 600 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* List */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#9ca3af' }}>
              No messages found under "{filter}".
            </div>
          ) : (
            filtered.map((msg) => {
              const isShop = msg.inquiryType === 'shop' || !!msg.productTitle || msg.projectType?.toLowerCase().includes('shop');
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelected(msg);
                    if (msg.status === 'unread') handleStatusChange(msg, 'read');
                  }}
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    backgroundColor: selected?.id === msg.id ? '#f9fafb' : msg.status === 'unread' ? '#fefce8' : 'transparent',
                    transition: 'background-color 150ms',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: msg.status === 'unread' ? 600 : 500, color: '#111827' }}>
                        {msg.name}
                      </span>
                      {isShop && (
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 999,
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            border: '1px solid #a7f3d0',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Shop
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{formatEditorialDate(msg.createdAt)}</span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: isShop ? '#1e40af' : '#6b7280', fontWeight: isShop ? 500 : 400, margin: '0.15rem 0' }}>
                    {msg.projectType || 'General Inquiry'}
                  </p>

                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: '0.35rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {msg.message.substring(0, 90)}...
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Pane */}
        {selected && (
          <div className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{selected.name}</h2>
                  {(selected.inquiryType === 'shop' || selected.productTitle) && (
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 999,
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        border: '1px solid #a7f3d0',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Shop Acquisition
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'underline' }}>
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <a
                      href={`tel:${selected.phone}`}
                      style={{ fontSize: '0.8125rem', color: '#4b5563', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Phone size={13} />
                      {selected.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  onClick={() => handleStatusChange(selected, selected.status === 'read' ? 'unread' : 'read')}
                  style={iconBtnStyle}
                  title={selected.status === 'unread' ? 'Mark read' : 'Mark unread'}
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleStatusChange(selected, 'archived')}
                  style={iconBtnStyle}
                  title="Archive"
                >
                  <Archive size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(selected)}
                  style={{ ...iconBtnStyle, color: '#ef4444' }}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* If Shop Inquiry: Highlighted Acquisition Card */}
            {(selected.inquiryType === 'shop' || selected.productTitle) && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 10,
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                  <ShoppingBag size={16} style={{ color: '#059669' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0f172a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Acquisition Item
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  {selected.productImage && (
                    <img
                      src={selected.productImage}
                      alt={selected.productTitle || 'Product'}
                      style={{ width: 68, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }}
                    />
                  )}
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600 }}>
                      {selected.productTitle || selected.projectType}
                    </h4>
                    {selected.budget && (
                      <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#059669' }}>
                        Total: {selected.budget}
                      </p>
                    )}
                  </div>
                </div>

                {/* Specific Order Parameters */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.8125rem' }}>
                  {selected.quantity && (
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 500 }}>Quantity</span>
                      <span style={{ fontWeight: 600 }}>{selected.quantity}</span>
                    </div>
                  )}
                  {selected.framing && (
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 500 }}>Framing</span>
                      <span style={{ fontWeight: 500 }}>{selected.framing}</span>
                    </div>
                  )}
                  {selected.country && (
                    <div>
                      <span style={{ display: 'block', color: '#64748b', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 500 }}>Destination</span>
                      <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} style={{ color: '#64748b' }} /> {selected.country}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General Meta Fields */}
            <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Subject', value: selected.projectType },
                { label: 'Date', value: formatEditorialDate(selected.createdAt) },
              ]
                .filter((f) => f.value)
                .map((field) => (
                  <div key={field.label} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '0.5rem' }}>
                    <span style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase' }}>{field.label}</span>
                    <span>{field.value}</span>
                  </div>
                ))}
            </div>

            {/* Message Body */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Client Message & Details
              </span>
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#1f2937' }}>
                  {selected.message}
                </p>
              </div>
            </div>

            {/* Reference Files */}
            {selected.referenceFiles && selected.referenceFiles.length > 0 && (
              <div style={{ marginTop: '1.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Attached Artwork</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {selected.referenceFiles.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt={`Reference ${i + 1}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Actions */}
            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem' }}>
              <a
                href={`mailto:${selected.email}?subject=Re: ${selected.projectType || 'Your inquiry'}`}
                className="admin-btn admin-btn-primary"
                style={{ textDecoration: 'none', justifyContent: 'center', flex: 1, padding: '0.75rem 1.25rem' }}
              >
                <Mail size={16} /> Reply via Email
              </a>

              {selected.phone && (
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn"
                  style={{ textDecoration: 'none', justifyContent: 'center', backgroundColor: '#25D366', color: '#ffffff', border: 'none', padding: '0.75rem 1.25rem' }}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete message"
        message="This message will be permanently deleted from the database."
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  padding: '0.45rem',
  borderRadius: 6,
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
};
