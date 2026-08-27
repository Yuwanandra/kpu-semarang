import { motion } from 'framer-motion';

/**
 * Membungkus konten dengan animasi fade+rise saat masuk viewport.
 * `prefers-reduced-motion` sudah ditangani secara global lewat CSS,
 * dan framer-motion sendiri menghormati pengaturan itu di level OS.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
