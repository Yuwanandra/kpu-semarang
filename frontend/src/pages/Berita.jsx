import { useEffect, useState } from 'react';
import api from '../lib/api';
import NewsCard from '../components/NewsCard';
import Loader from '../components/Loader';
import Reveal from '../components/Reveal';

const kategoris = [
  { value: '', label: 'Semua' },
  { value: 'berita', label: 'Berita' },
  { value: 'pengumuman', label: 'Pengumuman' },
  { value: 'siaran_pers', label: 'Siaran Pers' },
];

export default function Berita() {
  const [items, setItems] = useState([]);
  const [kategori, setKategori] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 9;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit });
    if (kategori) params.set('kategori', kategori);
    api
      .get(`/berita?${params.toString()}`)
      .then((r) => {
        setItems(r.data.data);
        setTotal(r.data.pagination.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [kategori, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Reveal>
        <p className="eyebrow mb-2">Ruang Berita</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">Berita &amp; Pengumuman</h1>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2">
        {kategoris.map((k) => (
          <button
            key={k.value}
            onClick={() => {
              setKategori(k.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              kategori === k.value
                ? 'bg-abu-dark text-paper'
                : 'border border-ink/15 text-ink-soft hover:border-abu-dark hover:text-abu-dark'
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <p className="text-ink-soft">Tidak ada konten pada kategori ini.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((b, i) => (
              <NewsCard key={b.id} item={b} index={i} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-full font-mono text-sm ${
                p === page ? 'bg-merah text-paper' : 'text-ink-soft hover:bg-ink/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
