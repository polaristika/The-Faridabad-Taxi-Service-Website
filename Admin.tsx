import React, { useState, useRef, useEffect } from 'react';
import { SiteConfig, Vehicle, Review, FAQ, Stat } from './types';

interface AdminProps {
  config: SiteConfig;
  onUpdate: (config: SiteConfig) => void;
  onLogout: () => void;
}

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
    setSaveStatus('Draft saved!');
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
        setSaveStatus('🚀 Published LIVE!');
      }
    } catch (err) {
      alert('Sync Error.');
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
    Promise.all(promises).then((results: string[]) => {
      setLocalConfig((prev: SiteConfig) => ({ ...prev, gallery: [...(prev.gallery || []), ...results] }));
      setIsUploading(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-black mb-8">Redirecting to updated Manager...</h1>
        <p>Please use the links in the navigation bar to access the Website Manager.</p>
      </div>
    </div>
  );
};

export default Admin;