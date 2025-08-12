import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  FolderOpen, 
  Zap, 
  MessageCircle, 
  Github, 
  Settings,
  Code,
  Trophy
} from 'lucide-react';
import type { AppWindow } from './Desktop';

interface DockProps {
  windows: AppWindow[];
  onOpenApp: (app: { id: string; title: string; component: string }) => void;
  onRestoreWindow: (windowId: string) => void;
  onWallpaperChange: (wallpaper: 'space' | 'tech' | 'gradient') => void;
  currentWallpaper: string;
}

const dockApps = [
  { id: 'resume', title: 'Resume', component: 'ResumeView', icon: FileText, color: 'text-blue-400' },
  { id: 'projects', title: 'Projects', component: 'ProjectsView', icon: FolderOpen, color: 'text-purple-400' },
  { id: 'skills', title: 'Skills', component: 'SkillsView', icon: Zap, color: 'text-yellow-400' },
  { id: 'chat', title: 'SanjayBot AI Assistant', component: 'ChatBot', icon: MessageCircle, color: 'text-green-400' },
  { id: 'github', title: 'GitHub Profile', component: 'GitHubView', icon: Github, color: 'text-gray-400' },
  { id: 'leetcode', title: 'LeetCode Profile', component: 'LeetCodeView', icon: Code, color: 'text-orange-400' },
  { id: 'settings', title: 'Settings', component: 'SettingsView', icon: Settings, color: 'text-primary' },
];

export const Dock: React.FC<DockProps> = ({ 
  windows, 
  onOpenApp, 
  onRestoreWindow,
  onWallpaperChange,
  currentWallpaper 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="glass-dock rounded-2xl px-4 py-3 flex items-center space-x-3">
        {dockApps.map((app) => {
          const window = windows.find(w => w.id === app.id);
          const isActive = window && !window.isMinimized;
          const isMinimized = window && window.isMinimized;

          return (
            <DockIcon
              key={app.id}
              app={app}
              isActive={isActive}
              isMinimized={isMinimized}
              onClick={() => {
                if (isMinimized) {
                  onRestoreWindow(app.id);
                } else {
                  onOpenApp(app);
                }
              }}
            />
          );
        })}
        
        {/* Divider */}
        <div className="w-px h-8 bg-border/50 mx-2" />
        
        {/* Wallpaper Selector */}
        <WallpaperSelector 
          currentWallpaper={currentWallpaper}
          onWallpaperChange={onWallpaperChange}
        />
      </div>
    </motion.div>
  );
};

interface DockIconProps {
  app: {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    color: string;
  };
  isActive?: boolean;
  isMinimized?: boolean;
  onClick: () => void;
}

const DockIcon: React.FC<DockIconProps> = ({ app, isActive, isMinimized, onClick }) => {
  const Icon = app.icon;

  return (
    <motion.button
      className={`
        relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
        ${isActive ? 'glass-hover glow-primary' : 'glass hover:glass-hover'}
        ${isMinimized ? 'opacity-60' : ''}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      title={app.title}
    >
      <Icon size={24} className={app.color} />
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 w-2 h-2 bg-primary rounded-full glow-primary"
        />
      )}
      
      {/* Minimized indicator */}
      {isMinimized && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 w-1 h-1 bg-muted-foreground rounded-full"
        />
      )}
    </motion.button>
  );
};

interface WallpaperSelectorProps {
  currentWallpaper: string;
  onWallpaperChange: (wallpaper: 'space' | 'tech' | 'gradient') => void;
}

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ 
  currentWallpaper, 
  onWallpaperChange 
}) => {
  const wallpapers = [
    { id: 'space', color: 'bg-blue-600', label: 'Space' },
    { id: 'tech', color: 'bg-cyan-600', label: 'Tech' },
    { id: 'gradient', color: 'bg-purple-600', label: 'Gradient' },
  ];

  return (
    <div className="flex space-x-1">
      {wallpapers.map((wallpaper) => (
        <motion.button
          key={wallpaper.id}
          className={`
            w-6 h-6 rounded-full border-2 transition-all duration-200
            ${wallpaper.color}
            ${currentWallpaper === wallpaper.id 
              ? 'border-primary glow-primary' 
              : 'border-border hover:border-primary/50'
            }
          `}
          onClick={() => onWallpaperChange(wallpaper.id as 'space' | 'tech' | 'gradient')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={`Switch to ${wallpaper.label} wallpaper`}
        />
      ))}
    </div>
  );
};