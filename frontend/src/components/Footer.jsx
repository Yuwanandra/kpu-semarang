import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-paperDeep">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <img src="/logo-lengkap.png" alt="KPU Kota Semarang" className="h-14 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Komisi Pemilihan Umum Kota Semarang menyelenggarakan pemilu yang jujur, adil, transparan,
            dan dapat dipertanggungjawabkan kepada seluruh warga.
          </p>
        </div>

        <div className="text-sm text-ink-soft">
          <p className="eyebrow mb-3">Kontak</p>
          <div className="flex items-start gap-2 mb-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-merah" />
            <span>Jl. Pemuda No. 175, Semarang Tengah, Kota Semarang, Jawa Tengah</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Phone size={16} className="text-merah" />
            <span>(024) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-merah" />
            <span>info@kpu-semarangkota.go.id</span>
          </div>
        </div>

        <div className="text-sm text-ink-soft">
          <p className="eyebrow mb-3">Tautan</p>
          <ul className="space-y-2">
            <li><a href="/ppid" className="hover:text-abu-dark">Layanan Informasi Publik (PPID)</a></li>
            <li><a href="https://www.kpu.go.id" target="_blank" rel="noreferrer" className="hover:text-abu-dark">KPU Republik Indonesia</a></li>
            <li><a href="/kontak" className="hover:text-abu-dark">Pengaduan &amp; Kontak</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10 py-5 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} KPU Kota Semarang. Portal informasi resmi.
      </div>
    </footer>
  );
}
