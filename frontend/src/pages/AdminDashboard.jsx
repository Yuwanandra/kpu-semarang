import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, LogOut, X } from 'lucide-react';
import api from '../lib/api';
import Loader from '../components/Loader';

const emptyForm = { judul: '', ringkasan: '', konten: '', kategori: 'berita', gambar_url: '', status: 'terbit' };

export default function AdminDashboard() {
  const [me, setMe] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await api.get('/auth/me');
      setMe(meRes.data);
      const beritaRes = await api.get('/berita?limit=50');
      setItems(beritaRes.data.data);
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError('');
  }

  function openEdit(item) {
    setForm({
      judul: item.judul,
      ringkasan: item.ringkasan || '',
      konten: item.konten || '',
      kategori: item.kategori,
      gambar_url: item.gambar_url || '',
      status: item.status || 'terbit',
    });
    setEditingId(item.id);
    setShowForm(true);
    setError('');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await api.put(`/berita/${editingId}`, form);
      } else {
        await api.post('/berita', form);
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.error || 'Gagal menyimpan berita.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus berita ini? Tindakan tidak dapat dibatalkan.')) return;
    try {
      await api.delete(`/berita/${id}`);
      await loadData();
    } catch (err) {
      alert(err?.response?.data?.error || 'Gagal menghapus.');
    }
  }

  async function handleLogout() {
    await api.post('/auth/logout').catch(() => {});
    navigate('/admin/login');
  }

  if (loading) return <Loader label="Memuat dashboard…" />;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">Panel Internal</p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Halo, {me?.username} <span className="text-sm font-normal text-ink-soft">({me?.role})</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Berita Baru
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-paperDeep text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Judul</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Dilihat</th>
              <th className="px-4 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-ink">{item.judul}</td>
                <td className="px-4 py-3 text-ink-soft">{item.kategori}</td>
                <td className="px-4 py-3 text-ink-soft">{item.status}</td>
                <td className="px-4 py-3 font-mono text-ink-soft">{item.dilihat ?? '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="rounded-full p-2 text-ink-soft hover:bg-ink/5 hover:text-abu-dark">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-full p-2 text-ink-soft hover:bg-merah/10 hover:text-merah">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-soft">
                  Belum ada berita. Klik &quot;Berita Baru&quot; untuk membuat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.form
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-paper p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {editingId ? 'Sunting Berita' : 'Berita Baru'}
                </h2>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-full p-1.5 hover:bg-ink/5">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  required
                  placeholder="Judul"
                  value={form.judul}
                  onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                />
                <input
                  placeholder="Ringkasan singkat"
                  value={form.ringkasan}
                  onChange={(e) => setForm((f) => ({ ...f, ringkasan: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                />
                <textarea
                  required
                  rows={6}
                  placeholder="Isi konten (mendukung HTML dasar)"
                  value={form.konten}
                  onChange={(e) => setForm((f) => ({ ...f, konten: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                />
                <input
                  placeholder="URL Gambar (opsional)"
                  value={form.gambar_url}
                  onChange={(e) => setForm((f) => ({ ...f, gambar_url: e.target.value }))}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
                    className="rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                  >
                    <option value="berita">Berita</option>
                    <option value="pengumuman">Pengumuman</option>
                    <option value="siaran_pers">Siaran Pers</option>
                  </select>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                  >
                    <option value="draft">Draft</option>
                    <option value="terbit">Terbit</option>
                    <option value="arsip">Arsip</option>
                  </select>
                </div>
              </div>

              {error && <p className="mt-3 text-sm text-merah">{error}</p>}

              <button type="submit" disabled={saving} className="btn-primary mt-5 w-full justify-center disabled:opacity-60">
                {saving ? 'Menyimpan…' : 'Simpan Berita'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
