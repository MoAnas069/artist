import { useState, useCallback, useRef } from 'react';
import { Upload, X, GripVertical, Link as LinkIcon, Loader2 } from 'lucide-react';
import { uploadFile } from '../../services/storageService';
import { useToast } from '../ui/Toast';

interface ImageUploaderProps {
  images?: string[];
  onChange: (images: string[]) => void;
  folder: string;
  maxFiles?: number;
}

const SAMPLE_PRESETS = [
  { name: 'Dusk Headlands', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Night Lantern', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Gold Leaf Map', url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Misty Shore', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80' },
];

export default function ImageUploader({ images = [], onChange, folder, maxFiles = 20 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const remainingSlots = maxFiles - images.length;
    if (remainingSlots <= 0) {
      showToast(`Maximum limit of ${maxFiles} images reached`, 'error');
      return;
    }

    const fileArray = Array.from(files).slice(0, remainingSlots);
    if (fileArray.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of fileArray) {
      const id = file.name + Date.now();
      try {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const path = `${folder}/${timestamp}_${safeName}`;
        const url = await uploadFile(file, path, (p) => {
          setProgress((prev) => ({ ...prev, [id]: p }));
        });
        if (url) {
          newUrls.push(url);
        }
      } catch (error) {
        console.error('Upload failed:', file.name, error);
        showToast(`Failed to process ${file.name}`, 'error');
      } finally {
        setProgress((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      showToast(`Added ${newUrls.length} image${newUrls.length > 1 ? 's' : ''}`);
    }
    setUploading(false);
  }, [images, onChange, folder, maxFiles, showToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, [handleUpload]);

  const handleAddUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) return;
    if (images.length >= maxFiles) {
      showToast(`Maximum limit of ${maxFiles} images reached`, 'error');
      return;
    }
    onChange([...images, inputUrl.trim()]);
    setInputUrl('');
    setShowUrlInput(false);
    showToast('Image URL added');
  };

  const handleAddSample = (url: string) => {
    if (images.length >= maxFiles) {
      showToast(`Maximum limit of ${maxFiles} images reached`, 'error');
      return;
    }
    onChange([...images, url]);
    showToast('Sample artwork added');
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onChange(reordered);
  };

  return (
    <div>
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#1a1a1a' : '#d1d5db'}`,
          borderRadius: 12,
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 150ms ease',
          backgroundColor: dragOver ? '#f9fafb' : '#fafafa',
          marginBottom: '0.75rem',
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Loader2 size={24} color="#6366f1" style={{ marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: '#4f46e5', fontWeight: 500 }}>Optimizing & uploading image...</p>
          </div>
        ) : (
          <>
            <Upload size={24} color="#9ca3af" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500, marginBottom: '0.25rem' }}>
              Drop image files here or click to browse
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Supports JPG, PNG, WebP — {images.length}/{maxFiles} uploaded
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUpload(e.target.files);
              e.target.value = ''; // Reset so the exact same file can be uploaded again if deleted
            }
          }}
          style={{ display: 'none' }}
        />
      </div>

      {/* Alternative options: Add via URL & Quick Presets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: 'none',
            border: 'none',
            color: '#4f46e5',
            fontSize: '0.8125rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: 0,
            fontWeight: 500,
          }}
        >
          <LinkIcon size={14} /> {showUrlInput ? 'Hide URL input' : 'Or paste an image URL'}
        </button>

        {images.length < maxFiles && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Preset art:</span>
            {SAMPLE_PRESETS.slice(0, 2).map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddSample(preset.url)}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: 4,
                  fontSize: '0.6875rem',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  color: '#4b5563',
                }}
              >
                + {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* URL Input Form */}
      {showUrlInput && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="url"
            className="admin-input"
            placeholder="https://images.unsplash.com/..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
            style={{ fontSize: '0.8125rem', padding: '0.5rem 0.75rem' }}
          />
          <button
            type="button"
            onClick={() => handleAddUrl()}
            className="admin-btn admin-btn-secondary"
            style={{ whiteSpace: 'nowrap', padding: '0.5rem 0.875rem' }}
          >
            Add URL
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {Object.entries(progress).map(([id, p]) => (
        <div key={id} style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginBottom: 2 }}>
            <span>Processing...</span>
            <span>{p}%</span>
          </div>
          <div style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                backgroundColor: '#1a1a1a',
                width: `${p}%`,
                transition: 'width 200ms ease',
              }}
            />
          </div>
        </div>
      ))}

      {/* Image Previews / Grid */}
      {images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {images.map((img, i) => (
            <div
              key={`uploader-img-${i}-${img.slice(0, 24)}`}
              draggable={images.length > 1}
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) {
                  handleReorder(dragIndex, i);
                  setDragIndex(null);
                }
              }}
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
                border: i === 0 ? '2px solid #1a1a1a' : '1px solid #e5e7eb',
                cursor: images.length > 1 ? 'grab' : 'default',
              }}
            >
              <img
                src={img}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80';
                }}
              />

              {/* Cover badge */}
              {i === 0 && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '1px 6px',
                    borderRadius: 3,
                    zIndex: 2,
                  }}
                >
                  Cover
                </span>
              )}

              {/* Drag Handle */}
              {images.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    color: 'white',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))',
                    cursor: 'grab',
                    zIndex: 2,
                  }}
                >
                  <GripVertical size={14} />
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                draggable={false}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(i);
                }}
                title="Remove image"
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.75)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'background-color 150ms ease, transform 100ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.75)')}
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
