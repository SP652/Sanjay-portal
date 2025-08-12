import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { ResumeView } from './apps/ResumeView';
import { ProjectsView } from './apps/ProjectsView';
import { SkillsView } from './apps/SkillsView';
import { ChatBot } from './apps/ChatBot';
import { GitHubView } from './apps/GitHubView';
import { LeetCodeView } from './apps/LeetCodeView';
import { SettingsView } from './apps/SettingsView';
import type { AppWindow as AppWindowType } from './Desktop';

interface AppWindowProps {
  window: AppWindowType;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

const componentMap = {
  ResumeView,
  ProjectsView,
  SkillsView,
  ChatBot,
  GitHubView,
  LeetCodeView,
  SettingsView,
};

export const AppWindow: React.FC<AppWindowProps> = ({
  window,
  onClose,
  onMinimize,
  onFocus,
}) => {
  const Component = componentMap[window.component as keyof typeof componentMap];

  if (!Component) {
    return (
      <div className="glass-window rounded-2xl overflow-hidden h-full">
        <div className="p-4">
          <p>Component {window.component} not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-window rounded-2xl overflow-hidden h-full flex flex-col"
      onMouseDown={onFocus}
      layout
    >
      {/* Window Header */}
      <div className="window-drag-handle flex items-center justify-between p-4 border-b border-glass-border bg-glass/50">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <WindowButton color="bg-red-500" onClick={onClose} />
            <WindowButton color="bg-yellow-500" onClick={onMinimize} />
            <WindowButton color="bg-green-500" />
          </div>
          <h2 className="text-foreground font-semibold text-sm">{window.title}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            className="p-1 hover:bg-glass-hover rounded"
            onClick={onMinimize}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Minus size={16} className="text-muted-foreground" />
          </motion.button>
          <motion.button
            className="p-1 hover:bg-glass-hover rounded"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Maximize2 size={16} className="text-muted-foreground" />
          </motion.button>
          <motion.button
            className="p-1 hover:bg-glass-hover rounded"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} className="text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        <Component />
      </div>
    </motion.div>
  );
};

interface WindowButtonProps {
  color: string;
  onClick?: () => void;
}

const WindowButton: React.FC<WindowButtonProps> = ({ color, onClick }) => {
  return (
    <motion.button
      className={`w-3 h-3 rounded-full ${color} hover:brightness-110`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
  );
};