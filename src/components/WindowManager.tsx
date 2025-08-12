import React from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { AppWindow } from './AppWindow';
import type { AppWindow as AppWindowType } from './Desktop';

interface WindowManagerProps {
  windows: AppWindowType[];
  onClose: (windowId: string) => void;
  onMinimize: (windowId: string) => void;
  onFocus: (windowId: string) => void;
  onUpdate: (windowId: string, updates: Partial<AppWindowType>) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onClose,
  onMinimize,
  onFocus,
  onUpdate,
}) => {
  return (
    <AnimatePresence>
      {windows.map((window) => (
        !window.isMinimized && (
          <motion.div
            key={window.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3 
            }}
            style={{ zIndex: window.zIndex }}
            className="absolute"
          >
            <Rnd
              size={window.size}
              position={window.position}
              onDragStop={(e, d) => {
                onUpdate(window.id, { position: { x: d.x, y: d.y } });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                onUpdate(window.id, {
                  size: {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                  },
                  position,
                });
              }}
              minWidth={400}
              minHeight={300}
              bounds="window"
              dragHandleClassName="window-drag-handle"
              onMouseDown={() => onFocus(window.id)}
              enableResizing={{
                top: true,
                right: true,
                bottom: true,
                left: true,
                topRight: true,
                bottomRight: true,
                bottomLeft: true,
                topLeft: true,
              }}
              resizeHandleStyles={{
                bottomRight: {
                  width: '20px',
                  height: '20px',
                  background: 'transparent',
                  cursor: 'nw-resize',
                },
              }}
            >
              <AppWindow
                window={window}
                onClose={() => onClose(window.id)}
                onMinimize={() => onMinimize(window.id)}
                onFocus={() => onFocus(window.id)}
              />
            </Rnd>
          </motion.div>
        )
      ))}
    </AnimatePresence>
  );
};