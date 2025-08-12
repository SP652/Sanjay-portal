import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Dock } from './Dock';
import { WindowManager } from './WindowManager';
import wallpaperSpace from '@/assets/wallpaper-space.jpg';
import wallpaperTech from '@/assets/wallpaper-tech.jpg';
import wallpaperGradient from '@/assets/wallpaper-gradient.jpg';

export interface AppWindow {
  id: string;
  title: string;
  component: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

const wallpapers = {
  space: wallpaperSpace,
  tech: wallpaperTech,
  gradient: wallpaperGradient,
};

export const Desktop: React.FC = () => {
  const [currentWallpaper, setCurrentWallpaper] = useState<keyof typeof wallpapers>('space');
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = (app: { id: string; title: string; component: string }) => {
    const existingWindow = windows.find(w => w.id === app.id);
    
    if (existingWindow) {
      // Bring to front and unminimize
      setWindows(prev => prev.map(w => 
        w.id === app.id 
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : w
      ));
      setNextZIndex(prev => prev + 1);
      return;
    }

    const newWindow: AppWindow = {
      id: app.id,
      title: app.title,
      component: app.component,
      isMinimized: false,
      position: { 
        x: 100 + windows.length * 50, 
        y: 80 + windows.length * 30 
      },
      size: { width: 800, height: 600 },
      zIndex: nextZIndex,
    };

    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };

  const focusWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  const updateWindow = (windowId: string, updates: Partial<AppWindow>) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, ...updates } : w
    ));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Desktop Background */}
      <motion.div
        key={currentWallpaper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${wallpapers[currentWallpaper]})`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/40" />

      {/* Header */}
      <Header />

      {/* Desktop Icons */}
      <div className="absolute top-24 left-8 space-y-6">
        <DesktopIcon
          icon="📝"
          label="Resume"
          onDoubleClick={() => openWindow({ id: 'resume', title: 'Resume', component: 'ResumeView' })}
        />
        <DesktopIcon
          icon="🚀"
          label="Projects"
          onDoubleClick={() => openWindow({ id: 'projects', title: 'Projects', component: 'ProjectsView' })}
        />
        <DesktopIcon
          icon="⚡"
          label="Skills"
          onDoubleClick={() => openWindow({ id: 'skills', title: 'Skills', component: 'SkillsView' })}
        />
        <DesktopIcon
          icon="🤖"
          label="SanjayBot"
          onDoubleClick={() => openWindow({ id: 'chat', title: 'SanjayBot AI Assistant', component: 'ChatBot' })}
        />
      </div>

      {/* Window Manager */}
      <WindowManager
        windows={windows}
        onClose={closeWindow}
        onMinimize={minimizeWindow}
        onFocus={focusWindow}
        onUpdate={updateWindow}
      />

      {/* Dock */}
      <Dock 
        windows={windows}
        onOpenApp={openWindow}
        onRestoreWindow={focusWindow}
        onWallpaperChange={setCurrentWallpaper}
        currentWallpaper={currentWallpaper}
      />
    </div>
  );
};

interface DesktopIconProps {
  icon: string;
  label: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick }) => {
  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer group"
      onDoubleClick={onDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-16 h-16 rounded-xl glass flex items-center justify-center text-3xl mb-2 group-hover:glow-primary transition-all duration-200">
        {icon}
      </div>
      <span className="text-sm text-foreground/90 text-center max-w-20 leading-tight">
        {label}
      </span>
    </motion.div>
  );
};