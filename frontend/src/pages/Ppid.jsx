import { FileText, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';

const layanan = [
  {
    icon: FileText,
    title: 'Permohonan Informasi',
    desc: 'Ajukan permintaan data atau dokumen publik terkait penyelenggaraan pemilu di Kota Semarang.',
  },
  {
    icon: Clock,
    title: 'Waktu Layanan',
    desc: 'Permohonan diproses maksimal 10 hari kerja, dapat diperpanjang 7 hari kerja sesuai UU KIP.',
  },
  {
    icon: ShieldCheck,
    title: 'Keberatan Informasi',
    desc: 'Jika permohonan ditolak, pemohon berhak mengajukan keberatan kepada atasan PPID.',
  },
];

export default function Ppid() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Reveal>
        <p className="eyebrow mb-2">Pejabat Pengelola Informasi dan Dokumentasi</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          Layanan Informasi Publik (PPID)
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft leading-relaxed">
          Setiap warga negara berhak memperoleh informasi publik sesuai Undang-Undang No. 14 Tahun
          2008 tentang Keterbukaan Informasi Publik. KPU Kota Semarang menyediakan layanan ini
          melalui PPID.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {layanan.map((l, i) => (
          <Reveal key={l.title} delay={i * 0.08} className="card-surface p-6">
            <l.icon className="mb-3 text-merah" size={26} />
            <p className="font-display font-semibold text-ink">{l.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{l.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-12 card-surface p-6">
        <p className="font-display text-lg font-semibold text-ink">Ingin mengajukan permohonan?</p>
        <p className="mt-2 text-sm text-ink-soft">
          Gunakan formulir kontak dan pilih jenis pesan &quot;Layanan PPID&quot; agar permohonan Anda
          diteruskan ke petugas PPID yang berwenang.
        </p>
        <Link to="/kontak" className="btn-primary mt-5">
          Ajukan Permohonan
        </Link>
      </Reveal>
    </div>
  );
}
