import { useEffect, useState } from 'react';
import api from '../lib/api';
import Reveal from '../components/Reveal';
import Loader from '../components/Loader';
import OrgChart from '../components/OrgChart';

export default function Profil() {
  const [anggota, setAnggota] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/struktur')
      .then((r) => setAnggota(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Reveal>
        <p className="eyebrow mb-2">Profil Lembaga</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">
          KPU Kota Semarang
        </h1>
      </Reveal>

      <Reveal delay={0.05} className="mt-8 space-y-4 text-ink-soft leading-relaxed">
        <p>
          Komisi Pemilihan Umum (KPU) Kota Semarang adalah lembaga penyelenggara pemilu di tingkat
          kota yang bersifat nasional, tetap, dan mandiri, sebagaimana diamanatkan oleh
          Undang-Undang Pemilihan Umum. KPU Kota Semarang bertugas merencanakan dan melaksanakan
          seluruh tahapan pemilihan umum di wilayah Kota Semarang.
        </p>
        <p>
          Sebagai lembaga publik, KPU Kota Semarang berkomitmen menjunjung prinsip mandiri, jujur,
          adil, berkepastian hukum, tertib, terbuka, proporsional, profesional, akuntabel, efektif,
          dan efisien dalam setiap penyelenggaraan pemilu.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="card-surface p-6">
          <p className="eyebrow mb-2">Visi</p>
          <p className="text-ink-soft leading-relaxed">
            Menjadi penyelenggara pemilu yang mandiri, profesional, berintegritas, dan dipercaya
            oleh masyarakat Kota Semarang.
          </p>
        </div>
        <div className="card-surface p-6">
          <p className="eyebrow mb-2">Misi</p>
          <ul className="list-disc space-y-1.5 pl-5 text-ink-soft leading-relaxed">
            <li>Membangun lembaga penyelenggara pemilu yang profesional</li>
            <li>Menyelenggarakan pemilu yang transparan dan akuntabel</li>
            <li>Meningkatkan partisipasi dan kesadaran politik masyarakat</li>
          </ul>
        </div>
      </Reveal>

      <div className="mt-16">
        <p className="eyebrow mb-2">Struktur</p>
        <h2 className="mb-10 font-display text-2xl font-semibold text-ink">Komisioner &amp; Sekretariat</h2>
        {loading ? (
          <Loader />
        ) : anggota.length === 0 ? (
          <p className="text-ink-soft">Data struktur organisasi belum tersedia.</p>
        ) : (
          <OrgChart anggota={anggota} />
        )}
      </div>
    </div>
  );
}
