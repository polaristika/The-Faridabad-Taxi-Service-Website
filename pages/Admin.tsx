import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig, Vehicle, Review, FAQ, Stat } from '../types';

interface AdminProps {
  config: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  onLogout: () => void;
}

// Hardcoded keys for seamless syncing without setup
const CLOUD_CONFIG = {
  url: "https://jcaieopwycitxqcmiamm.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYWllb3B3eWNpdHhxY21pYW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyODIxMzcsImV4cCI6MjA4Mjg1ODEzN30.H7lOV9_GIAXN4Wpei9tim0ER09VEzP7rG-bhYIbSm8E"
};

const Admin: React.FC<AdminProps> = ({ config, onUpdate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'general' | 'vehicles' | 'gallery' | 'reviews' | 'faqs'>('hero');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSaveDraft = () => {
    onUpdate(localConfig);
    setSaveStatus('Draft saved to this device!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`${CLOUD_CONFIG.url}/rest/v1/site_config?id=eq.1`, {
        method: 'PATCH',
        headers: {
          'apikey': CLOUD_CONFIG.key,
          'Authorization': `Bearer ${CLOUD_CONFIG.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ data: localConfig })
      });

      if (res.ok) {
        onUpdate(localConfig);
        setSaveStatus('🚀 Published LIVE! Changes are now visible to everyone.');
      } else {
        throw new Error('Cloud update failed');
      }
    } catch (err) {
      alert('Sync Error. Please check your internet.');
    } finally {
      setIsPublishing(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
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
      setLocalConfig(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...results] }));
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const inputClass = "w-full bg-white text-slate-900 border-2 border-slate-200 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Fixed Header with Mobile Optimization */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 md:h-20 gap-4">
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <i className="fas fa-magic text-blue-600"></i> Website Manager
            </h1>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                <i className={`fas ${isPublishing ? 'fa-spinner fa-spin' : 'fa-globe-americas'}`}></i>
                {isPublishing ? 'Updating...' : 'Update Website'}
              </button>
              <button onClick={onLogout} className="text-slate-400 hover:text-red-500 font-bold px-4 py-2 transition-colors text-sm">Logout</button>
            </div>
          </div>
          
          {/* Scrolling Tabs */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar border-t border-slate-50">
            {(['hero', 'stats', 'general', 'vehicles', 'gallery', 'reviews', 'faqs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-4 font-bold text-[10px] md:text-xs transition-all whitespace-nowrap uppercase tracking-widest ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        {saveStatus && (
          <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl mb-8 font-bold flex items-center gap-3 animate-bounce shadow-xl">
            <i className="fas fa-check-circle"></i> {saveStatus}
          </div>
        )}

        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900">Front Page Text</h2>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Big Title</label>
              <input 
                className={inputClass}
                value={localConfig.hero.title}
                onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, title: e.target.value}})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
              <textarea 
                rows={4}
                className={inputClass}
                value={localConfig.hero.subtitle}
                onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, subtitle: e.target.value}})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Hero Image URL</label>
              <input 
                className={inputClass}
                value={localConfig.hero.imageUrl}
                onChange={e => setLocalConfig({...localConfig, hero: {...localConfig.hero, imageUrl: e.target.value}})}
              />
            </div>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}

        {/* Stats Section */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 mb-2">Key Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(localConfig.stats || []).map(stat => (
                <div key={stat.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Value</label>
                    <input 
                      className={inputClass} 
                      value={stat.value} 
                      onChange={e => {
                        const updated = localConfig.stats.map(s => s.id === stat.id ? {...s, value: e.target.value} : s);
                        setLocalConfig({...localConfig, stats: updated});
                      }} 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Label</label>
                    <input 
                      className={inputClass} 
                      value={stat.label} 
                      onChange={e => {
                        const updated = localConfig.stats.map(s => s.id === stat.id ? {...s, label: e.target.value} : s);
                        setLocalConfig({...localConfig, stats: updated});
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}

        {/* General Info */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-slate-900">Contact & Areas</h2>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Primary Phone</label>
              <input 
                className={inputClass}
                value={localConfig.phones[0] || ''}
                onChange={e => setLocalConfig({...localConfig, phones: [e.target.value, ...localConfig.phones.slice(1)]})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Office Address</label>
              <textarea 
                rows={3}
                className={inputClass}
                value={localConfig.address}
                onChange={e => setLocalConfig({...localConfig, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Service Areas (Comma Separated)</label>
              <input 
                className={inputClass}
                value={(localConfig.serviceAreas || []).join(', ')}
                onChange={e => setLocalConfig({...localConfig, serviceAreas: e.target.value.split(',').map(s => s.trim())})}
              />
            </div>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}

        {/* Vehicle Pricing */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">Vehicle Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(localConfig.vehicles || []).map(v => (
                <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold border-b border-slate-100 pb-2">{v.name}</h4>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Base Fare</label>
                    <input type="number" className={inputClass} value={v.base} onChange={e => {
                      const updated = localConfig.vehicles.map(veh => veh.id === v.id ? {...veh, base: parseInt(e.target.value)} : veh);
                      setLocalConfig({...localConfig, vehicles: updated});
                    }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Per KM Rate</label>
                    <input type="number" className={inputClass} value={v.km} onChange={e => {
                      const updated = localConfig.vehicles.map(veh => veh.id === v.id ? {...veh, km: parseInt(e.target.value)} : veh);
                      setLocalConfig({...localConfig, vehicles: updated});
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 space-y-8">
            <h2 className="text-xl font-black text-slate-900">Gallery Management</h2>
            <div className="flex flex-col items-center justify-center p-8 md:p-12 border-4 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 group hover:border-blue-400 transition-all relative">
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="text-center">
                <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-images'} text-3xl text-blue-600 mb-4`}></i>
                <h3 className="font-bold">Upload Photos</h3>
                <p className="text-xs text-slate-400">Tap to select images from your gallery</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(localConfig.gallery || []).map((item, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-slate-100">
                  <img src={item} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setLocalConfig({...localConfig, gallery: localConfig.gallery.filter((_, idx) => idx !== i)})}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">Client Reviews</h2>
            {(localConfig.reviews || []).map(r => (
              <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <input className={inputClass} placeholder="Client Name" value={r.name} onChange={e => {
                  setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, name: e.target.value} : rev)})
                }} />
                <textarea className={inputClass} rows={2} placeholder="Review text" value={r.comment} onChange={e => {
                  setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, comment: e.target.value} : rev)})
                }} />
                <button onClick={() => setLocalConfig({...localConfig, reviews: localConfig.reviews.filter(rev => rev.id !== r.id)})} className="text-red-500 text-xs font-bold uppercase">Remove Review</button>
              </div>
            ))}
            <button onClick={() => setLocalConfig({...localConfig, reviews: [...(localConfig.reviews || []), {id: Date.now().toString(), name: 'New Client', comment: 'Excellent service!', rating: 5, date: new Date().toISOString().split('T')[0]}]})} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:text-blue-500 transition-all">+ Add New Review</button>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">Frequently Asked Questions</h2>
            {(localConfig.faqs || []).map(f => (
              <div key={f.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <input className={inputClass} placeholder="Question" value={f.question} onChange={e => {
                  setLocalConfig({...localConfig, faqs: localConfig.faqs.map(faq => faq.id === f.id ? {...faq, question: e.target.value} : faq)})
                }} />
                <textarea className={inputClass} rows={2} placeholder="Answer" value={f.answer} onChange={e => {
                  setLocalConfig({...localConfig, faqs: localConfig.faqs.map(faq => faq.id === f.id ? {...faq, answer: e.target.value} : faq)})
                }} />
                <button onClick={() => setLocalConfig({...localConfig, faqs: localConfig.faqs.filter(faq => faq.id !== f.id)})} className="text-red-500 text-xs font-bold uppercase">Remove FAQ</button>
              </div>
            ))}
            <button onClick={() => setLocalConfig({...localConfig, faqs: [...(localConfig.faqs || []), {id: Date.now().toString(), question: 'New Question?', answer: 'Answer here.'}]})} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:text-blue-500 transition-all">+ Add New FAQ</button>
            <button onClick={handleSaveDraft} className="w-full py-4 bg-blue-100 text-blue-600 rounded-xl font-bold hover:bg-blue-200 transition-colors">Save Local Draft</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;