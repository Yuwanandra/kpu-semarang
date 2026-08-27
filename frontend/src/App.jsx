import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profil from './pages/Profil';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail';
import Agenda from './pages/Agenda';
import Ppid from './pages/Ppid';
import Kontak from './pages/Kontak';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/profil" element={<PageTransition><Profil /></PageTransition>} />
            <Route path="/berita" element={<PageTransition><Berita /></PageTransition>} />
            <Route path="/berita/:slug" element={<PageTransition><BeritaDetail /></PageTransition>} />
            <Route path="/agenda" element={<PageTransition><Agenda /></PageTransition>} />
            <Route path="/ppid" element={<PageTransition><Ppid /></PageTransition>} />
            <Route path="/kontak" element={<PageTransition><Kontak /></PageTransition>} />
            <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
