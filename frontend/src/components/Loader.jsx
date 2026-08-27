import { motion } from 'framer-motion';

export default function Loader({ label = 'Memuat data…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-soft">
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-abu-dark/20 border-t-abu-dark"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <p className="font-mono text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}
