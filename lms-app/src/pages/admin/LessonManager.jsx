import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCourseById, getLessons, createLesson, updateLesson, deleteLesson,
} from '../../firebase/courseService';
import { uploadLessonVideo } from '../../firebase/storageService';
import {
  ArrowLeft, Plus, Pencil, Trash2, Video, Link2, FileText,
  Clock, GripVertical, Loader, CheckCircle, Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── YouTube helpers ──────────────────────────────────────────────────────────
const extractYouTubeId = (url) => {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return m ? m[1] : null;
};
const toEmbedUrl = (raw) => {
  const id = extractYouTubeId(raw);
  return id ? `https://www.youtube.com/embed/${id}` : '';
};

// ── Empty form state ─────────────────────────────────────────────────────────
const emptyForm = (order) => ({
  title:    '',
  duration: '',
  order,
  type:     'text',
  content:  '',
  videoUrl: '',
});

const TYPE_ICONS = {
  text:    FileText,
  youtube: Link2,
  upload:  Upload,
};

export default function LessonManager() {
  const { id: courseId } = useParams();

  const [course,   setCourse]   = useState(null);
  const [lessons,  setLessons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState('list');       // 'list' | 'form'
  const [editId,   setEditId]   = useState(null);         // null = new lesson
  const [form,     setForm]     = useState(emptyForm(1));
  const [saving,   setSaving]   = useState(false);
  const [ytInput,  setYtInput]  = useState('');           // raw YouTube URL input
  const [uploadPct, setUploadPct] = useState(null);       // 0–100 while uploading

  const load = async () => {
    setLoading(true);
    const [c, ls] = await Promise.all([getCourseById(courseId), getLessons(courseId)]);
    setCourse(c);
    setLessons(ls);
    setLoading(false);
  };

  useEffect(() => { load(); }, [courseId]);

  // ── Open add/edit form ────────────────────────────────────────────────────
  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm(lessons.length + 1));
    setYtInput('');
    setUploadPct(null);
    setView('form');
  };

  const openEdit = (lesson) => {
    setEditId(lesson.id);
    setForm({
      title:    lesson.title    ?? '',
      duration: lesson.duration ?? '',
      order:    lesson.order    ?? 1,
      type:     lesson.type     ?? 'text',
      content:  lesson.content  ?? '',
      videoUrl: lesson.videoUrl ?? '',
    });
    setYtInput(lesson.videoUrl ?? '');
    setUploadPct(null);
    setView('form');
  };

  const cancelForm = () => {
    setView('list');
    setEditId(null);
    setUploadPct(null);
  };

  // ── File upload ───────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxMB = 500;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`File is too large. Max size is ${maxMB} MB.`);
      return;
    }
    const lessonId = editId ?? `temp_${Date.now()}`;
    setUploadPct(0);
    try {
      const url = await uploadLessonVideo(courseId, lessonId, file, setUploadPct);
      setForm((f) => ({ ...f, videoUrl: url }));
      toast.success('Video uploaded!');
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
      setUploadPct(null);
    }
  };

  // ── Save lesson ───────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required.'); return; }

    let videoUrl = form.videoUrl;
    if (form.type === 'youtube') {
      videoUrl = toEmbedUrl(ytInput);
      if (!videoUrl) { toast.error('Enter a valid YouTube URL.'); return; }
    }
    if (form.type === 'upload' && !videoUrl) {
      toast.error('Please upload a video file first.'); return;
    }

    const data = {
      title:    form.title.trim(),
      duration: form.duration ? Number(form.duration) : null,
      order:    form.order    ? Number(form.order)    : lessons.length + 1,
      type:     form.type,
      content:  form.type === 'text' ? form.content : '',
      videoUrl: form.type === 'text' ? '' : videoUrl,
    };

    setSaving(true);
    try {
      if (editId) {
        await updateLesson(courseId, editId, data);
        toast.success('Lesson updated!');
      } else {
        await createLesson(courseId, data);
        toast.success('Lesson added!');
      }
      await load();
      cancelForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete lesson ─────────────────────────────────────────────────────────
  const handleDelete = async (lesson) => {
    if (!confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return;
    try {
      await deleteLesson(courseId, lesson.id);
      toast.success('Lesson deleted.');
      await load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader size={28} className="animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to={`/admin/courses/${courseId}/edit`}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 mb-2"
          >
            <ArrowLeft size={13} /> Back to edit course
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{course?.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage lessons</p>
        </div>
        {view === 'list' && (
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 flex-shrink-0">
            <Plus size={15} /> Add Lesson
          </button>
        )}
      </div>

      {/* ── Lesson list ────────────────────────────────────────────────────── */}
      {view === 'list' && (
        <div className="card p-0 overflow-hidden">
          {lessons.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No lessons yet</p>
              <p className="text-sm mt-1">Click "Add Lesson" to create the first one.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {lessons.map((l, i) => {
                const TypeIcon = TYPE_ICONS[l.type] ?? FileText;
                return (
                  <li key={l.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50">
                    <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500
                      flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <TypeIcon size={15} className="flex-shrink-0 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{l.title}</p>
                      {l.duration && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {l.duration} min
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEdit(l)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(l)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* ── Lesson form ─────────────────────────────────────────────────────── */}
      {view === 'form' && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-5">
            {editId ? 'Edit Lesson' : 'New Lesson'}
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* Title + duration row */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lesson Title <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-field"
                  placeholder="e.g. Introduction to WHMIS"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Duration (min)
                </label>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  placeholder="e.g. 15"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                />
              </div>
            </div>

            {/* Order field */}
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              />
            </div>

            {/* Content type selector */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Content Type</label>
              <div className="flex gap-2">
                {[
                  { value: 'text',    label: 'Text',         Icon: FileText },
                  { value: 'youtube', label: 'YouTube Video', Icon: Link2   },
                  { value: 'upload',  label: 'Upload Video',  Icon: Upload   },
                ].map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: value }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                      ${form.type === value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Text content ──────────────────────────────────────────────── */}
            {form.type === 'text' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Content <span className="text-gray-400">(HTML is supported)</span>
                </label>
                <textarea
                  rows={12}
                  className="input-field font-mono text-xs resize-y"
                  placeholder="<h2>Lesson Title</h2><p>Your content here...</p>"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                />
              </div>
            )}

            {/* ── YouTube ───────────────────────────────────────────────────── */}
            {form.type === 'youtube' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={ytInput}
                  onChange={(e) => setYtInput(e.target.value)}
                />
                {ytInput && toEmbedUrl(ytInput) ? (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={toEmbedUrl(ytInput)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube preview"
                    />
                  </div>
                ) : ytInput ? (
                  <p className="text-xs text-red-500 mt-1.5">
                    Could not parse a valid YouTube URL. Make sure it looks like:<br />
                    <span className="font-mono">https://www.youtube.com/watch?v=VIDEOID</span>
                  </p>
                ) : null}
              </div>
            )}

            {/* ── Upload video ──────────────────────────────────────────────── */}
            {form.type === 'upload' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Video File</label>
                <p className="text-xs text-gray-400 mb-2">
                  Supported formats: MP4, MOV, WebM — max 500 MB
                </p>

                {/* Current video preview */}
                {form.videoUrl && uploadPct === null && (
                  <div className="mb-3 rounded-xl overflow-hidden bg-black">
                    <video
                      src={form.videoUrl}
                      controls
                      className="w-full max-h-64 object-contain"
                    />
                  </div>
                )}

                {/* Upload progress */}
                {uploadPct !== null && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Loader size={12} className="animate-spin" /> Uploading…
                      </span>
                      <span>{uploadPct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{ width: `${uploadPct}%` }}
                      />
                    </div>
                    {uploadPct === 100 && (
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <CheckCircle size={12} /> Upload complete!
                      </p>
                    )}
                  </div>
                )}

                <label className="flex items-center gap-2 w-fit cursor-pointer bg-white border border-gray-300
                  hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm">
                  <Video size={15} />
                  {form.videoUrl ? 'Replace Video' : 'Choose Video File'}
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={cancelForm}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadPct !== null && uploadPct < 100}
                className="btn-primary flex items-center gap-2"
              >
                {saving
                  ? <><Loader size={14} className="animate-spin" /> Saving…</>
                  : <><CheckCircle size={14} /> {editId ? 'Update Lesson' : 'Add Lesson'}</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
