import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

const kategoriLabel = {
  berita: 'Berita',
  pengumuman: 'Pengumuman',
  siaran_pers: 'Siaran Pers',
};

export default function NewsCard({ item, index = 0 }) {
  const tanggal = new Date(item.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isExternal = Boolean(item.tautan_eksternal);
  // Berita hasil kurasi (dengan tautan_eksternal) langsung membuka halaman
  // aslinya di tab baru; berita internal tetap mengarah ke halaman detail kita.
  const linkProps = isExternal
    ? { as: 'a', href: item.tautan_eksternal, target: '_blank', rel: 'noopener noreferrer' }
    : { as: Link, to: `/berita/${item.slug}` };
  const Wrapper = linkProps.as;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="card-surface group overflow-hidden"
    >
      <Wrapper {...(isExternal ? { href: linkProps.href, target: linkProps.target, rel: linkProps.rel } : { to: linkProps.to })}>
        <div className="aspect-[16/10] w-full overflow-hidden bg-abu-faint">
          {item.gambar_url ? (
            <img
              src={item.gambar_url}
              alt={item.judul}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs uppercase tracking-wider text-abu-dark/60">
              KPU Kota Semarang
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-merah">
            <span>{kategoriLabel[item.kategori] || item.kategori}</span>
            <span className="text-ink/20">•</span>
            <span className="text-ink-soft">{tanggal}</span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-abu-dark">
            {item.judul}
          </h3>
          {item.ringkasan && (
            <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{item.ringkasan}</p>
          )}
          {item.sumber && (
            <p className="mt-2 text-xs text-ink-soft/80">Sumber: {item.sumber}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-abu-dark">
            {isExternal ? 'Buka halaman asli' : 'Baca selengkapnya'}
            {isExternal ? (
              <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            ) : (
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </span>
        </div>
      </Wrapper>
    </motion.article>
  );
}
