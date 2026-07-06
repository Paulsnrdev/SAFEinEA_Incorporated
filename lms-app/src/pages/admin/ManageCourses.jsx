import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, deleteCourse, updateCourse } from '../../firebase/courseService';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCourses() {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const load = async () => {
    const c = await getCourses();
    setCourses(c);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePublish = async (course) => {
    await updateCourse(course.id, { published: !course.published });
    toast.success(course.published ? 'Course unpublished.' : 'Course published!');
    load();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteCourse(id);
    toast.success('Course deleted.');
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
        <Link to="/admin/courses/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Course
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4].map((i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wide">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 py-3 hidden md:table-cell">Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{c.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.category ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{c.level ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {c.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(c)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-primary-600"
                        title={c.published ? 'Unpublish' : 'Publish'}
                      >
                        {c.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link
                        to={`/admin/courses/${c.id}/lessons`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-primary-600"
                        title="Manage lessons"
                      >
                        <BookOpen size={15} />
                      </Link>
                      <Link
                        to={`/admin/courses/${c.id}/edit`}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-primary-600"
                        title="Edit course"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-10">
                    No courses yet. <Link to="/admin/courses/new" className="text-primary-600 underline">Create the first one.</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
