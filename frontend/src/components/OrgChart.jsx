import { motion } from 'framer-motion';

function Card({ nama, jabatan, sub, deskripsi, accent = false, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay }}
      className={`card-surface w-full max-w-[220px] px-4 py-4 text-center ${
        accent ? 'border-merah/40 shadow-md' : ''
      }`}
    >
      <div
        className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-semibold ${
          accent ? 'bg-merah text-paper' : 'bg-abu-dark text-paper'
        }`}
      >
        {nama
          .split(' ')
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()}
      </div>
      <p className="font-display text-sm font-semibold leading-snug text-ink">{nama}</p>
      <p className="mt-0.5 text-xs font-medium text-merah">{jabatan}</p>
      {sub && <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{sub}</p>}
      {deskripsi && <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft/80">{deskripsi}</p>}
    </motion.div>
  );
}

/**
 * Org chart sederhana berbasis CSS "drop-line" (garis vertikal + horizontal
 * dari div biasa) — tidak memerlukan library chart khusus. Struktur:
 * Ketua di puncak → 4 Anggota Komisioner sejajar di bawahnya → cabang
 * terpisah untuk Sekretariat (fungsi administratif, bukan bagian dari
 * rantai keputusan pleno, sehingga dihubungkan dengan garis putus-putus).
 */
export default function OrgChart({ anggota = [] }) {
  const ketua = anggota.find((a) => a.jabatan?.toLowerCase().includes('ketua'));
  const sekretariat = anggota.find((a) => a.jabatan?.toLowerCase().includes('sekretaris'));
  const komisioner = anggota.filter(
    (a) => a !== ketua && a !== sekretariat && a.jabatan?.toLowerCase().includes('anggota')
  );

  if (!ketua && komisioner.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      {ketua && (
        <>
          <Card nama={ketua.nama} jabatan={ketua.jabatan} deskripsi={ketua.deskripsi} accent />
          <div className="h-8 w-px bg-ink/15" />
        </>
      )}

      {komisioner.length > 0 && (
        <div className="relative w-full max-w-4xl">
          <div className="absolute left-[12%] right-[12%] top-0 hidden h-px bg-ink/15 sm:block" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 pt-0 sm:grid-cols-2 sm:pt-8 lg:grid-cols-4">
            {komisioner.map((a, i) => (
              <div key={a.id || a.nama} className="relative flex flex-col items-center">
                <div className="mb-0 hidden h-8 w-px bg-ink/15 sm:block" />
                <Card nama={a.nama} jabatan={a.jabatan} sub={a.divisi} delay={i * 0.08} />
              </div>
            ))}
          </div>
        </div>
      )}

      {sekretariat && (
        <div className="mt-14 flex flex-col items-center">
          <p className="eyebrow mb-3">Struktur Sekretariat</p>
          <div className="h-6 w-px border-l-2 border-dashed border-ink/25" />
          <Card
            nama={sekretariat.nama}
            jabatan={sekretariat.jabatan}
            sub={sekretariat.divisi}
            deskripsi={sekretariat.deskripsi}
            delay={0.2}
          />
        </div>
      )}
    </div>
  );
}
