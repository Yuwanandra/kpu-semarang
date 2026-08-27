import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StampSeal from '../components/StampSeal';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-28 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <StampSeal size={140} label="TIDAK DITEMUKAN" />
      </motion.div>
      <h1 className="mt-6 font-display text-2xl font-semibold text-ink">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-ink-soft">Halaman yang Anda cari mungkin telah dipindahkan atau dihapus.</p>
      <Link to="/" className="btn-primary mt-6">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
