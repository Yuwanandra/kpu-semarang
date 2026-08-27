import { motion } from 'framer-motion';

/**
 * Elemen signature portal ini: sebuah "cap resmi" — merujuk pada budaya
 * pemilu Indonesia (tinta di jari setelah mencoblos, dan stempel/cap basah
 * pada dokumen resmi). Dipakai di hero dan sebagai penanda berita resmi.
 * Prop `light` dipakai saat cap ditampilkan di atas latar gelap (mis. hero
 * biru bercorak batik) agar kontrasnya tetap terjaga.
 */
export default function StampSeal({ size = 220, label = 'RESMI', animate = true, light = false }) {
  const lineColor = light ? '#FFFFFF' : '#141414';
  return (
    <motion.div
      initial={animate ? { scale: 1.6, opacity: 0, rotate: -18 } : false}
      animate={animate ? { scale: 1, opacity: 1, rotate: -8 } : false}
      transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
      style={{ width: size, height: size }}
      className="relative select-none"
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="h-full w-full drop-shadow-[0_10px_25px_rgba(20,20,20,0.3)]"
      >
        <defs>
          <path id="stampCirclePath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke={lineColor} strokeWidth="2.5" opacity="0.5" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="#CE1126" strokeWidth="6" />
        <circle cx="100" cy="100" r="60" fill={lineColor} opacity={light ? 0.1 : 0.05} />
        <text fill={lineColor} fontSize="15" fontWeight="700" letterSpacing="4">
          <textPath href="#stampCirclePath" startOffset="2%">
            KPU KOTA SEMARANG • {label} •
          </textPath>
        </text>
        {/* Ink-dipped fingerprint mark, iconic to Indonesian voting */}
        <g transform="translate(72,68) scale(1.15)">
          <path
            d="M28 0C15 0 5 12 5 28c0 10 4 16 4 24 0 8-4 10-4 16 0 5 4 8 9 8s7-4 11-4 6 4 10 4 6-4 10-4 6 4 10 4 9-3 9-8c0-6-4-8-4-16 0-8 4-14 4-24C56 12 41 0 28 0z"
            fill="#CE1126"
          />
        </g>
      </motion.svg>
    </motion.div>
  );
}
