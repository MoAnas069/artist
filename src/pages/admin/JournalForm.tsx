import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { createPost, getPostById, updatePost } from '../../services/journalService';
import type { JournalPostFormData } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';
import { useToast } from '../../components/ui/Toast';
import { slugify } from '../../utils/helpers';
import { Timestamp } from 'firebase/firestore';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

const emptyForm: JournalPostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  content: '',
  author: '',
  published: true,
  publishedAt: null,
  tags: [],
  seoTitle: '',
  seoDescription: '',
};

export default function JournalForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState<JournalPostFormData>(emptyForm);
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = !!id && id !== 'new';

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      getPostById(id)
        .then((p) => {
          if (p) {
            const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = p;
            setForm(rest as JournalPostFormData);
            setTagsInput(rest.tags.join(', '));
            editor?.commands.setContent(rest.content);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, editor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && !isEditing) {
      setForm((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    setForm((prev) => ({
      ...prev,
      tags: value.split(',').map((t) => t.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = async (e: FormEvent, publish = false) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        published: publish || form.published,
        ...(publish && !form.publishedAt ? { publishedAt: Timestamp.now() } : {}),
      };
      if (isEditing) {
        await updatePost(id, data);
        showToast('Entry updated');
      } else {
        await createPost(data);
        showToast('Entry created');
      }
      navigate('/admin/journal');
    } catch {
      showToast('Failed to save entry', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (loading) return <p>Loading...</p>;

  const toolbarBtnStyle = (active?: boolean): React.CSSProperties => ({
    padding: '0.375rem',
    borderRadius: 4,
    backgroundColor: active ? '#e5e7eb' : 'transparent',
    color: active ? '#1a1a1a' : '#6b7280',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/admin/journal')} className="admin-btn admin-btn-secondary">
          <ArrowLeft size={16} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          {isEditing ? 'Edit Entry' : 'New Entry'}
        </h1>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div className="admin-card">
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" name="title" required value={form.title} onChange={handleChange} />
                </div>
                <div>
                  <label className="admin-label">Slug</label>
                  <input className="admin-input" name="slug" value={form.slug} onChange={handleChange} />
                </div>
                <div>
                  <label className="admin-label">Excerpt</label>
                  <textarea className="admin-textarea" name="excerpt" value={form.excerpt} onChange={handleChange} rows={2} />
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="admin-card">
              <label className="admin-label" style={{ marginBottom: '0.75rem' }}>Content</label>

              {/* Toolbar */}
              {editor && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.125rem',
                  padding: '0.5rem',
                  borderBottom: '1px solid #e5e7eb',
                  marginBottom: '0.75rem',
                }}>
                  <button type="button" style={toolbarBtnStyle(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></button>
                  <button type="button" style={toolbarBtnStyle(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></button>
                  <button type="button" style={toolbarBtnStyle(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></button>
                  <div style={{ width: 1, backgroundColor: '#e5e7eb', margin: '0 0.25rem' }} />
                  <button type="button" style={toolbarBtnStyle(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></button>
                  <button type="button" style={toolbarBtnStyle(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></button>
                  <div style={{ width: 1, backgroundColor: '#e5e7eb', margin: '0 0.25rem' }} />
                  <button type="button" style={toolbarBtnStyle(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></button>
                  <button type="button" style={toolbarBtnStyle(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></button>
                  <button type="button" style={toolbarBtnStyle(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></button>
                  <div style={{ width: 1, backgroundColor: '#e5e7eb', margin: '0 0.25rem' }} />
                  <button type="button" style={toolbarBtnStyle(editor.isActive('link'))} onClick={addLink}><Link2 size={16} /></button>
                  <button type="button" style={toolbarBtnStyle()} onClick={addImage}><ImageIcon size={16} /></button>
                  <div style={{ width: 1, backgroundColor: '#e5e7eb', margin: '0 0.25rem' }} />
                  <button type="button" style={toolbarBtnStyle()} onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></button>
                  <button type="button" style={toolbarBtnStyle()} onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></button>
                </div>
              )}

              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                minHeight: 400,
                padding: '1rem',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
              }}>
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Cover Image */}
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Cover Image</h2>
              <ImageUploader
                images={form.coverImage ? [form.coverImage] : []}
                onChange={(imgs) => setForm((prev) => ({ ...prev, coverImage: imgs[0] || '' }))}
                folder="journal/covers"
                maxFiles={1}
              />
            </div>
          </div>

          {/* Side */}
          <div style={{ display: 'grid', gap: '1.5rem', position: 'sticky', top: '1rem' }}>
            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Publish</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={() => setForm((prev) => ({ ...prev, published: !prev.published }))} />
                  Published
                </label>
                <div>
                  <label className="admin-label">Author</label>
                  <input className="admin-input" name="author" value={form.author} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>Tags & SEO</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label className="admin-label">Tags (comma separated)</label>
                  <input className="admin-input" value={tagsInput} onChange={(e) => handleTagsChange(e.target.value)} placeholder="art, process, thoughts" />
                </div>
                <div>
                  <label className="admin-label">SEO Title</label>
                  <input className="admin-input" name="seoTitle" value={form.seoTitle} onChange={handleChange} />
                </div>
                <div>
                  <label className="admin-label">SEO Description</label>
                  <textarea className="admin-textarea" name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={2} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                disabled={saving}
                onClick={(e) => handleSubmit(e as any, true)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saving ? 'Publishing...' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
