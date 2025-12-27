
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { SiteConfig } from './types';

const INITIAL_CONFIG: SiteConfig = {
  hero: {
    title: "Premium Taxi Service In Faridabad",
    subtitle: "Whether it's a quick local drop, a late-night airport run, or a scenic outstation trip, we've got the perfect ride waiting for you. Safe, reliable, and professional.",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070"
  },
  stats: [
    { id: '1', value: '5000+', label: 'Happy Clients' },
    { id: '2', value: '10+', label: 'Years Exp' },
    { id: '3', value: '24/7', label: 'Availability' },
    { id: '4', value: '15+', label: 'Active Fleet' }
  ],
  phones: ['+91 9999711219'],
  emails: ['Rajnijeetunagar1986@gmail.com'],
  address: 'Near NIT, Faridabad, Haryana – 121001',
  vehicles: [
    { id: '1', name: 'Dzire', icon: 'fa-car', base: 1300, km: 12, hour: 150, fullDay: 3000, capacity: 4 },
    { id: '2', name: 'Ertiga', icon: 'fa-car-side', base: 1600, km: 15, hour: 150, fullDay: 4000, capacity: 6 },
    { id: '3', name: 'Innova', icon: 'fa-shuttle-van', base: 1800, km: 18, hour: 200, fullDay: 4500, capacity: 7 },
    { id: '4', name: 'Innova Crysta', icon: 'fa-van-shuttle', base: 2500, km: 22, hour: 300, fullDay: 5500, capacity: 7 }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1594051808233-e19ecf20cc9c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1605281317010-fe5ffe798156?auto=format&fit=crop&q=80&w=800'
  ],
  socialLinks: [
    { id: 's1', platform: 'Facebook', url: 'https://facebook.com' },
    { id: 's2', platform: 'Instagram', url: 'https://instagram.com' }
  ],
  serviceAreas: ['NIT Faridabad', 'Sector 15', 'Sector 16', 'Ballabgarh', 'Greater Faridabad', 'Green Field', 'Sainik Colony', 'Surajkund'],
  reviews: [
    { id: 'r1', name: 'Anil Kumar', rating: 5, comment: 'Excellent service! The car was clean and the driver was very professional.', date: '2023-10-15' },
    { id: 'r2', name: 'Priya Sharma', rating: 4, comment: 'Reliable and punctual for my airport drop. Highly recommended.', date: '2023-11-02' }
  ],
  faqs: [
    { id: 'f1', question: 'Do you offer 24/7 service?', answer: 'Yes, we operate 24 hours a day, 7 days a week for all your travel needs.' },
    { id: 'f2', question: 'How can I pay for my ride?', answer: 'We accept Cash, UPI (GPay, PhonePe), and Net Banking.' },
    { id: 'f3', question: 'Are there any hidden charges?', answer: 'No, our pricing is transparent. Toll and parking are extra as per actuals.' }
  ]
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('taxi_config');
    const parsed = saved ? JSON.parse(saved) : INITIAL_CONFIG;
    return { ...INITIAL_CONFIG, ...parsed };
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('admin_session') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('taxi_config', JSON.stringify(config));
  }, [config]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  const handleLogin = (status: boolean) => {
    setIsAdmin(status);
    if (status) localStorage.setItem('admin_session', 'true');
    else localStorage.removeItem('admin_session');
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar config={config} />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home config={config} />} />
            <Route path="/gallery" element={<Gallery config={config} />} />
            <Route 
              path="/login" 
              element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={() => handleLogin(true)} />} 
            />
            <Route 
              path="/admin" 
              element={isAdmin ? <Admin config={config} onUpdate={handleUpdateConfig} onLogout={() => handleLogin(false)} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer config={config} />
        
        <a 
          href={`https://wa.me/${config.phones[0].replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50 animate-bounce"
        >
          <i className="fab fa-whatsapp text-2xl"></i>
        </a>
      </div>
    </HashRouter>
  );
};

export default App;
