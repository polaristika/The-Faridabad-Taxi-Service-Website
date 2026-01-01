
import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig, Vehicle, Review, FAQ, Stat } from '../types';

interface AdminProps {
  config: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ config, onUpdate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'general' | 'vehicles' | 'gallery' | 'reviews' | 'faqs' | 'sync'>('hero');
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cloudSettings, setCloudSettings] = useState(() => {
    const saved = localStorage.getItem('cloud_settings');
    return saved ? JSON.parse(saved) : { url: '', key: '' };
  });

  const handleSaveDraft = () => {
    onUpdate(localConfig);
    setSaveStatus('Draft saved to this device!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handlePublish = async () => {
    if (!cloudSettings.url || !cloudSettings.key) {
      alert("Please go to 'Cloud Setup' tab and enter your Supabase URL and Key first.");
      setActiveTab('sync');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch(`${cloudSettings.url}/rest/v1/site_config?id=eq.1`, {
        method: 'PATCH',
        headers: {
          'apikey': cloudSettings.key,
          'Authorization': `Bearer ${cloudSettings.key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ data: localConfig })
      });

      if (res.ok) {
        onUpdate(localConfig);
        setSaveStatus('🚀 Published LIVE! Changes are now visible on all devices.');
      } else {
        throw new Error('Cloud update failed');
      }
    } catch (err) {
      alert('Cloud Sync Error. Check your URL/Key in Cloud Setup.');
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
      setLocalConfig(prev => ({ ...prev, gallery: [...prev.gallery, ...results] }));
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const inputClass = "w-full bg-white text-slate-900 border-2 border-slate-200 p-4 rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Admin Nav */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <i className="fas fa-magic text-blue-600"></i> Website Manager
            </h1>
            <div className="flex gap-3">
              <button 
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <i className={`fas ${isPublishing ? 'fa-spinner fa-spin' : 'fa-globe-americas'}`}></i>
                {isPublishing ? 'Updating...' : 'Update Website'}
              </button>
              <button onClick={onLogout} className="text-slate-400 hover:text-red-500 font-bold px-4 py-2 transition-colors">Logout</button>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto no-scrollbar border-t border-slate-50">
            {(['hero', 'stats', 'general', 'vehicles', 'gallery', 'reviews', 'faqs', 'sync'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-4 font-bold text-xs transition-all whitespace-nowrap uppercase tracking-widest ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'sync' ? '⚙️ Cloud Setup' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {saveStatus && (
          <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl mb-8 font-bold flex items-center gap-3 animate-bounce shadow-xl">
            <i className="fas fa-check-circle"></i> {saveStatus}
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Connect to Cloud</h2>
              <p className="text-slate-500 text-sm">Enter the codes from your Supabase project once. After this, clicking "Update Website" will change the site for all your customers instantly.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Supabase URL</label>
                <input 
                  className={inputClass}
                  placeholder="https://xyz.supabase.co"
                  value={cloudSettings.url}
                  onChange={e => setCloudSettings({...cloudSettings, url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Supabase API Key (Anon)</label>
                <input 
                  type="password"
                  className={inputClass}
                  placeholder="Paste long key here..."
                  value={cloudSettings.key}
                  onChange={e => setCloudSettings({...cloudSettings, key: e.target.value})}
                />
              </div>
              <button 
                onClick={() => {
                  localStorage.setItem('cloud_settings', JSON.stringify(cloudSettings));
                  setSaveStatus('Cloud keys saved!');
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Save Connection Keys
              </button>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
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

        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localConfig.vehicles.map(v => (
                <div key={v.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold mb-4">{v.name} Price Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Base Fare</label>
                      <input type="number" className={inputClass} value={v.base} onChange={e => {
                        const updated = localConfig.vehicles.map(veh => veh.id === v.id ? {...veh, base: parseInt(e.target.value)} : veh);
                        setLocalConfig({...localConfig, vehicles: updated});
                      }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Extra KM Rate</label>
                      <input type="number" className={inputClass} value={v.km} onChange={e => {
                        const updated = localConfig.vehicles.map(veh => veh.id === v.id ? {...veh, km: parseInt(e.target.value)} : veh);
                        setLocalConfig({...localConfig, vehicles: updated});
                      }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Full Day Rate</label>
                      <input type="number" className={inputClass} value={v.fullDay} onChange={e => {
                        const updated = localConfig.vehicles.map(veh => veh.id === v.id ? {...veh, fullDay: parseInt(e.target.value)} : veh);
                        setLocalConfig({...localConfig, vehicles: updated});
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-8">
            <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 group hover:border-blue-400 transition-all relative">
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="text-center">
                <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-images'} text-3xl text-blue-600 mb-4`}></i>
                <h3 className="font-bold">Add Fleet Photos</h3>
                <p className="text-xs text-slate-400">Select photos from your phone/laptop gallery</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {localConfig.gallery.map((item, i) => (
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
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {localConfig.reviews.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <input className={inputClass} value={r.name} onChange={e => {
                  setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, name: e.target.value} : rev)})
                }} />
                <textarea className={inputClass} rows={2} value={r.comment} onChange={e => {
                  setLocalConfig({...localConfig, reviews: localConfig.reviews.map(rev => rev.id === r.id ? {...rev, comment: e.target.value} : rev)})
                }} />
                <button onClick={() => setLocalConfig({...localConfig, reviews: localConfig.reviews.filter(rev => rev.id !== r.id)})} className="text-red-500 text-xs font-bold uppercase tracking-widest">Delete Review</button>
              </div>
            ))}
            <button onClick={() => setLocalConfig({...localConfig, reviews: [...localConfig.reviews, {id: Date.now().toString(), name: 'New Client', comment: 'Great service!', rating: 5, date: '2024-01-01'}]})} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:text-blue-500 hover:border-blue-500 transition-all">+ Add Review</button>
          </div>
        )}

        {/* Sync/Update Reminder */}
        {activeTab !== 'sync' && (
          <div className="mt-12 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-lg font-black mb-2 flex items-center gap-2">
              <i className="fas fa-check-double text-green-400"></i> Done with changes?
            </h3>
            <p className="text-slate-400 text-sm mb-6">Always click "Update Website" at the top to make your changes visible to the public.</p>
            <button onClick={handlePublish} className="w-full py-4 bg-green-600 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-900/20">
              Apply to Live Website Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;