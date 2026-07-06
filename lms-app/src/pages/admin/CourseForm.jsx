import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, createCourse, updateCourse } from '../../firebase/courseService';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Workplace Safety', 'Environmental', 'Food Safety', 'Fire Safety', 'WHMIS', 'First Aid', 'Other'];
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced'];

const EMPTY = { title: '', description: '', category: '', level: 'Beginner', duration: '', thumbnailUrl: '', published: false };

export default function CourseForm() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const isEdit      = Boolean(id && id !== 'new');
  const [form, setForm]       = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    getCourseById(id).then((c) => { if (c) setForm(c); setLoading(false); });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await updateCourse(id, form);
        toast.success('Course updated!');
      } else {
        const newId = await createCourse(form);
        toast.success('Course created!');
        navigate(`/admin/courses/${newId}/edit`, { replace: true });
      }
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-xl" />;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm mb-6">
        <ArrowLeft size={16} /> Back to courses
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Course' : 'New Course'}</h1>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
          <input name="title" required className="input-field" placeholder="e.g. WHMIS 2015 Fundamentals" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={4} className="input-field resize-none" placeholder="What will learners achieve?" value={form.description} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" className="input-field" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select name="level" className="input-field" value={form.level} onChange={handleChange}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input name="duration" type="number" min="1" className="input-field" placeholder="60" value={form.duration} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
          <input name="thumbnailUrl" type="url" className="input-field" placeholder="https://…" value={form.thumbnailUrl} onChange={handleChange} />
        </div>
        <div className="flex items-center gap-3">
          <input id="published" name="published" type="checkbox" className="w-4 h-4 accent-primary-600" checked={form.published} onChange={handleChange} />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish course (visible to learners)</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Course'}
          </button>
          <button type="button" onClick={() => navigate('/admin/courses')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
