import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun, Image, Palette, Volume2, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  wallpaper: string;
  animations: boolean;
  sounds: boolean;
  notifications: boolean;
}

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    wallpaper: 'space',
    animations: true,
    sounds: false,
    notifications: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('sanjayos-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('sanjayos-settings', JSON.stringify(newSettings));
    
    // Apply theme changes
    if (key === 'theme') {
      applyTheme(value as Settings['theme']);
    }
  };

  const applyTheme = (theme: Settings['theme']) => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
      root.classList.toggle('light', !systemPrefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
    }
  };

  const wallpapers = [
    { id: 'space', name: 'Space', preview: 'bg-blue-600' },
    { id: 'tech', name: 'Tech Circuit', preview: 'bg-cyan-600' },
    { id: 'gradient', name: 'Purple Gradient', preview: 'bg-purple-600' },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your SanjayOS experience</p>
        </motion.div>

        {/* Appearance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ].map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <Button
                      key={theme.value}
                      variant={settings.theme === theme.value ? 'default' : 'outline'}
                      className="flex flex-col items-center space-y-2 h-auto py-4"
                      onClick={() => updateSetting('theme', theme.value as Settings['theme'])}
                    >
                      <Icon size={20} />
                      <span className="text-sm">{theme.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Wallpaper Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Wallpaper
              </label>
              <div className="grid grid-cols-3 gap-3">
                {wallpapers.map((wallpaper) => (
                  <Button
                    key={wallpaper.id}
                    variant={settings.wallpaper === wallpaper.id ? 'default' : 'outline'}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                    onClick={() => updateSetting('wallpaper', wallpaper.id)}
                  >
                    <div className={`w-8 h-6 rounded ${wallpaper.preview}`} />
                    <span className="text-sm">{wallpaper.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* System Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Monitor className="text-primary" size={20} />
            <h2 className="text-lg font-semibold text-foreground">System</h2>
          </div>

          <div className="space-y-4">
            <SettingItem
              icon={<Image size={16} />}
              label="Smooth Animations"
              description="Enable smooth window transitions and effects"
              value={settings.animations}
              onChange={(value) => updateSetting('animations', value)}
            />
            
            <SettingItem
              icon={<Volume2 size={16} />}
              label="System Sounds"
              description="Play sounds for system events and notifications"
              value={settings.sounds}
              onChange={(value) => updateSetting('sounds', value)}
            />
            
            <SettingItem
              icon={<Wifi size={16} />}
              label="Notifications"
              description="Show desktop notifications for updates"
              value={settings.notifications}
              onChange={(value) => updateSetting('notifications', value)}
            />
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">About SanjayOS</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Version: 1.0.0 (MVP)</p>
            <p>Built with React, TypeScript, and modern web technologies</p>
            <p>Designed for showcasing portfolio content with AI assistance</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                React 18
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                TypeScript
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Framer Motion
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                TailwindCSS
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                Vite
              </span>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  description,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start space-x-3">
        <div className="mt-1 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-sm font-medium text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
};