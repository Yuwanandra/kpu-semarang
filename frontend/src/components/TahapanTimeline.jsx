import { motion } from 'framer-motion';

const statusStyles = {
  selesai: { dot: 'bg-abu-dark', text: 'text-abu-dark', label: 'Selesai' },
  berjalan: { dot: 'bg-merah animate-pulse', text: 'text-merah', label: 'Sedang Berjalan' },
  akan_datang: { dot: 'bg-ink/25', text: 'text-ink-soft', label: 'Akan Datang' },
};

function formatTanggal(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TahapanTimeline({ items }) {
  return (
    <ol className="relative border-l border-ink/10 pl-8">
      {items.map((item, i) => {
        const s = statusStyles[item.status] || statusStyles.akan_datang;
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="relative mb-10 last:mb-0"
          >
            <span className={`absolute -left-[41px] top-1 h-4 w-4 rounded-full ring-4 ring-paper ${s.dot}`} />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-ink-soft">
                {String(item.urutan).padStart(2, '0')}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{item.nama_tahapan}</h3>
              <span className={`font-mono text-[11px] uppercase tracking-wider ${s.text}`}>{s.label}</span>
            </div>
            {item.deskripsi && <p className="mt-1.5 max-w-xl text-sm text-ink-soft">{item.deskripsi}</p>}
            <p className="mt-1.5 font-mono text-xs text-ink-soft">
              {formatTanggal(item.tanggal_mulai)} — {formatTanggal(item.tanggal_selesai)}
            </p>
          </motion.li>
        );
      })}
    </ol>
  );
}
