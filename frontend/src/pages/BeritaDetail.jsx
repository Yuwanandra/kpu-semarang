import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import Reveal from '../components/Reveal';
import Loader from '../components/Loader';

export default function BeritaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/berita/${slug}`)
      .then((r) => setItem(r.data.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;

  if (notFound || !item) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-ink">Berita tidak ditemukan</p>
        <p className="mt-2 text-ink-soft">Konten mungkin telah dihapus atau tautan tidak valid.</p>
        <Link to="/berita" className="btn-secondary mt-6 inline-flex">
          <ArrowLeft size={16} /> Kembali ke daftar berita
        </Link>
      </div>
    );
  }

  const tanggal = new Date(item.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Reveal>
        <Link to="/berita" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-abu-dark hover:underline">
          <ArrowLeft size={15} /> Semua berita
        </Link>
        <p className="eyebrow mb-3">{tanggal}</p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
          {item.judul}
        </h1>
      </Reveal>

      {item.gambar_url && (
        <Reveal delay={0.05} className="mt-8 overflow-hidden rounded-2xl">
          <img src={item.gambar_url} alt={item.judul} className="w-full object-cover" />
        </Reveal>
      )}

      <Reveal delay={0.1} className="prose prose-neutral mt-8 max-w-none text-ink-soft leading-relaxed">
        {/* Konten sudah disanitasi (xss()) di backend sebelum disimpan */}
        <div dangerouslySetInnerHTML={{ __html: item.konten }} />
      </Reveal>
    </article>
  );
}
