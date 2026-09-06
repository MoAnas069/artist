import { useEffect, useState } from 'react';
import { getSettings, defaultSettings } from '../services/settingsService';
import type { SiteSettings } from '../types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem('studio_site_settings');
      if (cached) return { ...defaultSettings, ...JSON.parse(cached) };
    } catch {}
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((s) => {
        if (!cancelled && s) setSettings(s);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Listen for real-time local updates from CMS
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettings>;
      if (!cancelled && customEvent.detail) {
        setSettings(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'studio_site_settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener('studio_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener('studio_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return { settings, loading };
}
