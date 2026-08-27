import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import Reveal from '../components/Reveal';

const initialForm = { nama: '', email: '', subjek: '', pesan: '', jenis: 'umum', website: '' };

export default function Kontak() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.get('/auth/csrf-token'); // pastikan cookie CSRF ada sebelum submit
      await api.post('/kontak', form);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setError(err?.response?.data?.error || 'Gagal mengirim pesan. Silakan coba lagi.');
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Reveal>
        <p className="eyebrow mb-2">Hubungi Kami</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">Kontak &amp; Pengaduan</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Sampaikan pertanyaan, permohonan informasi, atau pengaduan Anda kepada KPU Kota Semarang.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-surface flex flex-col items-center gap-3 p-10 text-center"
            >
              <CheckCircle2 className="text-abu-dark" size={40} />
              <p className="font-display text-lg font-semibold text-ink">Pesan terkirim</p>
              <p className="text-sm text-ink-soft">
                Terima kasih. Tim kami akan menindaklanjuti pesan Anda secepatnya.
              </p>
              <button onClick={() => setStatus('idle')} className="btn-secondary mt-2">
                Kirim pesan lain
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="card-surface space-y-4 p-6"
            >
              {/* Honeypot: disembunyikan dari pengguna asli lewat CSS, bot pengisi form otomatis biasanya tetap mengisinya */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Nama</label>
                  <input
                    required
                    value={form.nama}
                    onChange={(e) => update('nama', e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Jenis Pesan</label>
                <select
                  value={form.jenis}
                  onChange={(e) => update('jenis', e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                >
                  <option value="umum">Pertanyaan Umum</option>
                  <option value="ppid">Layanan PPID</option>
                  <option value="pengaduan">Pengaduan</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Subjek</label>
                <input
                  required
                  value={form.subjek}
                  onChange={(e) => update('subjek', e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink">Pesan</label>
                <textarea
                  required
                  rows={5}
                  value={form.pesan}
                  onChange={(e) => update('pesan', e.target.value)}
                  className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-abu-dark"
                />
              </div>

              {error && <p className="text-sm text-merah">{error}</p>}

              <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center disabled:opacity-60">
                {status === 'sending' ? 'Mengirim…' : 'Kirim Pesan'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </div>
  );
}
