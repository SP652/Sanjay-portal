import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, GitCommit, Trophy, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [githubStats, setGithubStats] = useState({
    stars: 150,
    commits: 500,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // TODO: Implement actual GitHub API calls
  // useEffect(() => {
  //   const fetchGitHubStats = async () => {
  //     try {
  //       const response = await fetch('/api/github-stats');
  //       const data = await response.json();
  //       setGithubStats(data);
  //     } catch (error) {
  //       console.error('Failed to fetch GitHub stats:', error);
  //     }
  //   };
  //   
  //   fetchGitHubStats();
  //   const interval = setInterval(fetchGitHubStats, 300000); // 5 minutes
  //   return () => clearInterval(interval);
  // }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-12 glass-dock border-b border-glass-border"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="text-foreground font-semibold">SanjayOS</span>
        </div>

        {/* Center - Stats */}
        <div className="flex items-center space-x-6">
          <StatItem
            icon={<Star size={16} />}
            label="Stars"
            value={githubStats.stars}
            color="text-yellow-400"
          />
          <StatItem
            icon={<GitCommit size={16} />}
            label="Commits"
            value={githubStats.commits}
            color="text-green-400"
          />
          <StatItem
            icon={<Trophy size={16} />}
            label="LeetCode"
            value={245}
            color="text-orange-400"
          />
        </div>

        {/* Right side - Time */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-foreground font-mono text-sm">
              {formatTime(currentTime)}
            </div>
            <div className="text-muted-foreground text-xs">
              {formatDate(currentTime)}
            </div>
          </div>
          <Clock size={18} className="text-muted-foreground" />
        </div>
      </div>
    </motion.header>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, color }) => {
  return (
    <motion.div
      className="flex items-center space-x-2 px-3 py-1 rounded-lg glass hover:glass-hover transition-all duration-200"
      whileHover={{ scale: 1.05 }}
    >
      <div className={color}>{icon}</div>
      <div className="text-xs">
        <div className="text-foreground font-medium">{value}</div>
        <div className="text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
};