import { useEffect, useState } from 'react';
import api from '../lib/api';
import Reveal from '../components/Reveal';
import Loader from '../components/Loader';
import TahapanTimeline from '../components/TahapanTimeline';

export default function Agenda() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/agenda')
      .then((r) => setItems(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Reveal>
        <p className="eyebrow mb-2">Jadwal Resmi</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">Tahapan Pemilu</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Urutan tahapan penyelenggaraan pemilu di Kota Semarang, dari pemutakhiran data pemilih
          hingga hari pemungutan suara.
        </p>
      </Reveal>

      <div className="mt-12">
        {loading ? <Loader /> : items.length === 0 ? (
          <p className="text-ink-soft">Jadwal belum tersedia.</p>
        ) : (
          <TahapanTimeline items={items} />
        )}
      </div>
    </div>
  );
}
