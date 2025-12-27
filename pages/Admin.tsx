
import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig, Vehicle, Review, FAQ, Stat } from '../types';

interface AdminProps {
  config: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ config, onUpdate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'general' | 'vehicles' | 'gallery' | 'social' | 'reviews' | 'faqs' | 'areas'>('hero');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSave = () => {
    onUpdate(localConfig);
    setSaveStatus('Config saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const promises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(results => {
      setLocalConfig(prev => ({ ...prev, gallery: [...prev.gallery, ...results] }));
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const updateGeneral = (field: keyof SiteConfig, value: any) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  const updateHero = (field: keyof SiteConfig['hero'], value: string) => {
    setLocalConfig({
      ...localConfig,
      hero: { ...localConfig.hero, [field]: value }
    });
  };

  const updateStat = (id: string, field: keyof Stat, value: string) => {
    const updatedStats = localConfig.stats.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    setLocalConfig({ ...localConfig, stats: updatedStats });
  };

  const updateVehicle = (id: string, field: keyof Vehicle, value: any) => {
    const updatedVehicles = localConfig.vehicles.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    setLocalConfig({ ...localConfig, vehicles: updatedVehicles });
  };

  const removeVehicle = (id: string) => {
    setLocalConfig({ ...localConfig, vehicles: localConfig.vehicles.filter(v => v.id !== id) });
  };

  const addVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      name: 'New Vehicle',
      icon: 'fa-car',
      base: 1000,
      km: 10,
      hour: 100,
      fullDay: 2000,
      capacity: 4
    };
    setLocalConfig({ ...localConfig, vehicles: [...localConfig.vehicles, newVehicle] });
  };

  const addArea = (area: string) => {
    if (area.trim() && !localConfig.serviceAreas.includes(area.trim())) {
      setLocalConfig({ ...localConfig, serviceAreas: [...localConfig.serviceAreas, area.trim()] });
    }
  };

  const addFAQ = () => {
    const newFaq: FAQ = { id: Date.now().toString(), question: 'New Question?', answer: 'New Answer' };
    setLocalConfig({...localConfig, faqs: [...localConfig.faqs, newFaq]});
  };

  const addReview = () => {
    const newReview: Review = { id: Date.now().toString(), name: 'Customer Name', rating: 5, comment: 'Nice service', date: new Date().toISOString().split('T')[0] };
    setLocalConfig({...localConfig, reviews: [...localConfig.reviews, newReview]});
  };

  const inputClass = "w-full bg-white text-slate-900 border-2 border-slate-300 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder-slate-400 shadow-sm";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <div className="flex gap-4">
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
              >
                <i className="fas fa-save"></i> Save All Changes
              </button>
              <button 
                onClick={onLogout}
                className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {(['hero', 'stats', 'general', 'vehicles', 'gallery', 'social', 'reviews', 'faqs', 'areas'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-4 font-bold text-xs transition-all whitespace-nowrap uppercase tracking-widest ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {saveStatus && (
          <div className="bg-green-100 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-8 font-bold flex items-center gap-3 animate-bounce">
            <i className="fas fa-check-circle"></i> {saveStatus}
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <i className="fas fa-image text-blue-600"></i> Hero Section Settings
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hero Title</label>
                <textarea 
                  className={inputClass}
                  rows={2}
                  value={localConfig.hero.title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  placeholder="e.g. Premium Taxi Service In Faridabad"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hero Subtitle</label>
                <textarea 
                  className={inputClass}
                  rows={3}
                  value={localConfig.hero.subtitle}
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  placeholder="Main description text on the home page"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hero Background Image URL</label>
                <input 
                  className={inputClass}
                  value={localConfig.hero.imageUrl}
                  onChange={(e) => updateHero('imageUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="mt-2 text-xs text-slate-400">Preview:</p>
                <div className="mt-2 w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                   <img src={localConfig.hero.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <i className="fas fa-chart-line text-blue-600"></i> Trust Indicators (Stats Bar)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {localConfig.stats.map(stat => (
                <div key={stat.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Number/Value (e.g. 5000+)</label>
                    <input 
                      className={inputClass}
                      value={stat.value}
                      onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Label (e.g. Happy Clients)</label>
                    <input 
                      className={inputClass}
                      value={stat.label}
                      onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
             <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <i className="fas fa-info-circle text-blue-600"></i> Business Information
            </h2>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Contact Phones</label>
              <input 
                className={inputClass}
                value={localConfig.phones[0]}
                onChange={(e) => updateGeneral('phones', [e.target.value])}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Contact Email</label>
              <input 
                className={inputClass}
                value={localConfig.emails[0]}
                onChange={(e) => updateGeneral('emails', [e.target.value])}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Business Address</label>
              <textarea 
                rows={3}
                className={inputClass}
                value={localConfig.address}
                onChange={(e) => updateGeneral('address', e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localConfig.vehicles.map(v => (
                <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-lg font-bold text-slate-900">Vehicle: {v.name}</h4>
                    <button 
                      onClick={() => removeVehicle(v.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Model Name</label>
                      <input 
                        className={inputClass}
                        value={v.name}
                        onChange={(e) => updateVehicle(v.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Base Price</label>
                      <input 
                        type="number"
                        className={inputClass}
                        value={v.base}
                        onChange={(e) => updateVehicle(v.id, 'base', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Extra KM Rate</label>
                      <input 
                        type="number"
                        className={inputClass}
                        value={v.km}
                        onChange={(e) => updateVehicle(v.id, 'km', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Full Day Rate</label>
                      <input 
                        type="number"
                        className={inputClass}
                        value={v.fullDay}
                        onChange={(e) => updateVehicle(v.id, 'fullDay', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Capacity</label>
                      <input 
                        type="number"
                        className={inputClass}
                        value={v.capacity}
                        onChange={(e) => updateVehicle(v.id, 'capacity', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={addVehicle}
              className="w-full py-6 bg-white border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-plus-circle"></i> Add New Vehicle
            </button>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8">
            <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 group hover:border-blue-400 transition-all relative">
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-3xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{isUploading ? 'Processing Files...' : 'Upload Media'}</h3>
                <p className="text-sm text-slate-400 font-medium">Select images or videos from your device</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {localConfig.gallery.map((item, i) => (
                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden group shadow-md border-2 border-white bg-slate-100">
                  {item.startsWith('data:video') || item.includes('.mp4') ? (
                    <video src={item} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item} className="w-full h-full object-cover" />
                  )}
                  <button 
                    onClick={() => setLocalConfig({...localConfig, gallery: localConfig.gallery.filter((_, idx) => idx !== i)})}
                    className="absolute top-2 right-2 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
            {localConfig.socialLinks.map((link) => (
              <div key={link.id} className="flex gap-6 items-center">
                <div className="w-32 flex-shrink-0 flex items-center gap-2">
                   <i className={`fab fa-${link.platform.toLowerCase()} text-blue-600`}></i>
                   <span className="text-xs font-black text-slate-500 uppercase">{link.platform}</span>
                </div>
                <input 
                  className={inputClass}
                  value={link.url}
                  onChange={(e) => {
                    const updated = localConfig.socialLinks.map(s => s.id === link.id ? { ...s, url: e.target.value } : s);
                    setLocalConfig({...localConfig, socialLinks: updated});
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {localConfig.reviews.map(r => (
              <div key={r.id} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm hover:border-blue-200 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Customer Name</label>
                    <input className={inputClass} value={r.name} onChange={e => {
                      setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, name: e.target.value} : rev)})
                    }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Rating (1-5)</label>
                    <input className={inputClass} type="number" min="1" max="5" value={r.rating} onChange={e => {
                      setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, rating: parseInt(e.target.value)} : rev)})
                    }} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Feedback Comment</label>
                    <textarea className={inputClass} rows={4} value={r.comment} onChange={e => {
                      setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, comment: e.target.value} : rev)})
                    }} />
                  </div>
                </div>
                <button 
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                  onClick={() => setLocalConfig({...localConfig, reviews: localConfig.reviews.filter(rev => rev.id !== r.id)})}
                >
                  Delete Review
                </button>
              </div>
            ))}
            <button onClick={addReview} className="w-full py-6 bg-white border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold hover:border-blue-500 hover:text-blue-500 transition-all">+ Add New Review</button>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            {localConfig.faqs.map(f => (
              <div key={f.id} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Question</label>
                  <input className={`${inputClass} font-bold`} value={f.question} onChange={e => {
                    setLocalConfig({...localConfig, faqs: localConfig.faqs.map(faq => faq.id === f.id ? {...faq, question: e.target.value} : faq)})
                  }} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block tracking-widest">Answer</label>
                  <textarea className={inputClass} rows={3} value={f.answer} onChange={e => {
                    setLocalConfig({...localConfig, faqs: localConfig.faqs.map(faq => faq.id === f.id ? {...faq, answer: e.target.value} : faq)})
                  }} />
                </div>
                <button 
                  className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm" 
                  onClick={() => setLocalConfig({...localConfig, faqs: localConfig.faqs.filter(faq => faq.id !== f.id)})}
                >
                  Delete FAQ
                </button>
              </div>
            ))}
            <button onClick={addFAQ} className="w-full py-6 bg-white border-2 border-dashed border-slate-300 rounded-3xl text-slate-400 font-bold hover:border-blue-500 hover:text-blue-500 transition-all">+ Add New FAQ</button>
          </div>
        )}

        {activeTab === 'areas' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8">
            <div className="flex gap-4">
              <input 
                id="new-area-input" 
                className={inputClass} 
                placeholder="Type location name..." 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    addArea(target.value);
                    target.value = '';
                  }
                }} 
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('new-area-input') as HTMLInputElement;
                  addArea(input.value);
                  input.value = '';
                }}
                className="bg-blue-600 text-white px-10 rounded-xl font-bold whitespace-nowrap shadow-lg shadow-blue-200"
              >
                Add Area
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {localConfig.serviceAreas.map((area, i) => (
                <div key={i} className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl text-sm font-bold text-slate-700 border-2 border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                  <i className="fas fa-map-marker-alt text-blue-500"></i>
                  {area}
                  <button onClick={() => setLocalConfig({...localConfig, serviceAreas: localConfig.serviceAreas.filter((_, idx) => idx !== i)})} className="text-red-400 hover:text-red-600 ml-2">
                    <i className="fas fa-times-circle"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
