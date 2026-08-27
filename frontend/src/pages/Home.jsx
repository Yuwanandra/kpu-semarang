import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Vote, FileCheck2 } from 'lucide-react';
import api from '../lib/api';
import Reveal from '../components/Reveal';
import StampSeal from '../components/StampSeal';
import NewsCard from '../components/NewsCard';
import TahapanTimeline from '../components/TahapanTimeline';
import SemarangMap from '../components/SemarangMap';
import Loader from '../components/Loader';

const stats = [
  { icon: Vote, label: 'TPS Aktif', value: '1.842' },
  { icon: Users, label: 'Pemilih Terdaftar', value: '1,3 Juta' },
  { icon: FileCheck2, label: 'Kecamatan', value: '16' },
];

export default function Home() {
  const [berita, setBerita] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/berita?limit=3'), api.get('/agenda')])
      .then(([b, a]) => {
        setBerita(b.data.data);
        setAgenda(a.data.data.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* SPANDUK / BANNER RESMI */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-ink/10 bg-ink"
      >
        <div className="mx-auto max-w-6xl px-5 py-3">
          <img
            src="/banner-kpu.png"
            alt="Spanduk resmi KPU Kota Semarang — update aplikasi informasi pemilu terbaru"
            className="mx-auto w-full rounded-md"
          />
        </div>
      </motion.div>

      {/* HERO — latar biru bercorak batik */}
      <section className="relative overflow-hidden bg-batik">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.2 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <StampSeal size={96} label="TERVERIFIKASI" light />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-4 text-white/75"
          >
            Portal Resmi &middot; Komisi Pemilihan Umum
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-semibold leading-[1.1] text-white md:text-5xl"
          >
            Menjaga suara warga
            <span className="text-merah-soft"> Kota Semarang</span> tetap jujur dan terbuka.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/70"
          >
            Informasi tahapan pemilu, berita resmi, dan layanan publik KPU Kota Semarang —
            disampaikan secara transparan dan dapat diakses oleh siapa saja.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link to="/agenda" className="btn-primary">
              Lihat Tahapan Pemilu <ArrowRight size={16} />
            </Link>
            <Link
              to="/ppid"
              className="btn-secondary border-white/30 text-white hover:border-white hover:text-white"
            >
              Layanan Informasi Publik
            </Link>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-white/10 bg-biru-deep/40">
          <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className="flex items-center gap-3 py-6 sm:justify-center">
                <s.icon className="text-merah-soft" size={22} />
                <div>
                  <p className="font-display text-xl font-semibold text-white">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PETA KOTA SEMARANG */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mb-10">
          <p className="eyebrow mb-2">Wilayah Cakupan</p>
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            Mengenal 16 Kecamatan Kota Semarang
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            Klik tiap titik untuk melihat jumlah penduduk dan ciri khas masing-masing kecamatan.
          </p>
        </Reveal>
        <SemarangMap />
      </section>

      {/* TAHAPAN PREVIEW */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Tahapan Pemilu</p>
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">
              Ke mana proses ini melangkah
            </h2>
          </div>
          <Link to="/agenda" className="text-sm font-semibold text-abu-dark hover:underline">
            Lihat jadwal lengkap →
          </Link>
        </div>
        {loading ? <Loader /> : <TahapanTimeline items={agenda} />}
      </section>

      {/* BERITA TERBARU */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Terbaru</p>
            <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">Berita &amp; Pengumuman</h2>
          </div>
          <Link to="/berita" className="text-sm font-semibold text-abu-dark hover:underline">
            Semua berita →
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : berita.length === 0 ? (
          <p className="text-ink-soft">Belum ada berita yang diterbitkan.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {berita.map((b, i) => (
              <NewsCard key={b.id} item={b} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
