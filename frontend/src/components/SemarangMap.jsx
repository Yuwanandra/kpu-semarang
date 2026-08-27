import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, MapPin } from 'lucide-react';
import kecamatan from '../data/kecamatan';

function formatPopulasi(n) {
  return n.toLocaleString('id-ID');
}

export default function SemarangMap() {
  const [activeId, setActiveId] = useState(null);
  const active = kecamatan.find((k) => k.id === activeId) || null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Peta administrasi asli, dengan titik klik transparan di atasnya */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <div className="relative">
          <img
            src="/peta-semarang.png"
            alt="Peta administrasi Kota Semarang dengan 16 kecamatan"
            className="block w-full select-none"
            draggable={false}
          />
          {kecamatan.map((k, i) => {
            const isActive = activeId === k.id;
            return (
              <motion.button
                key={k.id}
                type="button"
                onClick={() => setActiveId(isActive ? null : k.id)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                whileHover={{ scale: 1.15 }}
                style={{ left: `${k.x}%`, top: `${k.y}%` }}
                className={`group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-colors sm:h-8 sm:w-8 ${
                  isActive
                    ? 'border-merah bg-merah/25 shadow-lg'
                    : 'border-transparent bg-transparent hover:border-merah hover:bg-merah/15'
                }`}
                aria-label={`Lihat detail ${k.nama}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full bg-merah transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
                <span
                  className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/90 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 ${
                    isActive ? 'opacity-100' : ''
                  }`}
                >
                  {k.nama}
                </span>
              </motion.button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-ink/10 bg-abu-faint px-4 py-2.5 text-[11px] text-ink-soft">
          <span>Klik area kecamatan untuk melihat detail</span>
          <span>Peta administrasi Kota Semarang</span>
        </div>
      </div>

      {/* Panel detail / daftar kecamatan */}
      <div className="card-surface flex max-h-[420px] flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-1 flex-col p-6"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-merah" size={18} />
                  <h3 className="font-display text-lg font-semibold text-ink">Kecamatan {active.nama}</h3>
                </div>
                <button
                  onClick={() => setActiveId(null)}
                  className="rounded-full p-1 text-ink-soft hover:bg-ink/5"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mb-4 flex items-center gap-2 font-mono text-sm text-abu-dark">
                <Users size={15} />
                {formatPopulasi(active.populasi)} jiwa <span className="text-ink-soft">(estimasi)</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{active.keunikan}</p>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-ink-soft"
            >
              <MapPin className="mb-2 text-abu-dark/40" size={26} />
              Klik salah satu titik pada peta atau daftar di bawah untuk melihat detail kecamatan.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-h-40 overflow-y-auto border-t border-ink/10">
          {kecamatan
            .slice()
            .sort((a, b) => b.populasi - a.populasi)
            .map((k) => (
              <button
                key={k.id}
                onClick={() => setActiveId(k.id)}
                className={`flex w-full items-center justify-between px-5 py-2 text-left text-sm transition-colors hover:bg-abu-faint ${
                  activeId === k.id ? 'bg-abu-faint font-semibold text-merah' : 'text-ink-soft'
                }`}
              >
                <span>{k.nama}</span>
                <span className="font-mono text-xs">{formatPopulasi(k.populasi)}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
