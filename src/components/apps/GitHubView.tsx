import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Calendar, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  updated: string;
}

interface GitHubData {
  user: {
    github: string;
  };
  github: {
    username: string;
    pinnedRepos: string[];
  };
  stats: {
    githubStars: number;
    githubCommits: number;
  };
}

export const GitHubView: React.FC = () => {
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        // Load user data
        const response = await fetch('/data/content.json');
        const data = await response.json();
        setGithubData(data);

        // Mock repositories data (in real implementation, would fetch from GitHub API)
        const mockRepos: GitHubRepo[] = [
          {
            id: 1,
            name: 'ai-chat-platform',
            description: 'Real-time chat application with AI-powered responses and smart conversation analytics.',
            stars: 45,
            forks: 12,
            language: 'TypeScript',
            url: 'https://github.com/example/ai-chat-platform',
            updated: '2024-01-15',
          },
          {
            id: 2,
            name: 'ecommerce-dashboard',
            description: 'Advanced analytics dashboard for e-commerce businesses with real-time data visualization.',
            stars: 38,
            forks: 8,
            language: 'JavaScript',
            url: 'https://github.com/example/ecommerce-dashboard',
            updated: '2024-01-10',
          },
          {
            id: 3,
            name: 'sanjayos-ai',
            description: 'OS-style portfolio website with integrated AI assistant and modern glassmorphism design.',
            stars: 67,
            forks: 23,
            language: 'TypeScript',
            url: 'https://github.com/example/sanjayos-ai',
            updated: '2024-01-20',
          },
          {
            id: 4,
            name: 'leetcode-solutions',
            description: 'Collection of optimized solutions to LeetCode problems with detailed explanations.',
            stars: 156,
            forks: 42,
            language: 'Python',
            url: 'https://github.com/example/leetcode-solutions',
            updated: '2024-01-18',
          },
        ];

        setRepos(mockRepos);
      } catch (error) {
        console.error('Failed to load GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!githubData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load GitHub data</p>
      </div>
    );
  }

  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Github size={32} className="text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">GitHub Profile</h1>
          </div>
          <Button asChild>
            <a 
              href={`https://github.com/${githubData.github.username}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} className="mr-2" />
              View on GitHub
            </a>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon={<Star className="text-yellow-400" />}
            title="Total Stars"
            value={totalStars}
          />
          <StatCard
            icon={<GitFork className="text-blue-400" />}
            title="Total Forks"
            value={totalForks}
          />
          <StatCard
            icon={<Code className="text-green-400" />}
            title="Repositories"
            value={repos.length}
          />
          <StatCard
            icon={<Calendar className="text-purple-400" />}
            title="Commits"
            value={githubData.stats.githubCommits}
          />
        </motion.div>

        {/* Pinned Repositories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Pinned Repositories</h2>
          <div className="grid gap-4">
            {repos
              .filter(repo => githubData.github.pinnedRepos.includes(repo.name))
              .map((repo, index) => (
                <RepoCard key={repo.id} repo={repo} delay={index * 0.1} />
              ))}
          </div>
        </motion.section>

        {/* All Repositories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">All Repositories</h2>
          <div className="grid gap-3">
            {repos.map((repo, index) => (
              <RepoCard key={repo.id} repo={repo} delay={index * 0.05} compact />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => {
  return (
    <div className="glass rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
};

interface RepoCardProps {
  repo: GitHubRepo;
  delay?: number;
  compact?: boolean;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, delay = 0, compact = false }) => {
  const languageColors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-500',
    Python: 'bg-green-500',
    Java: 'bg-orange-500',
    Go: 'bg-cyan-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-lg p-4 hover:glass-hover transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
            {repo.name}
          </h3>
          <p className={`text-muted-foreground ${compact ? 'text-sm' : ''}`}>
            {repo.description}
          </p>
        </div>
        <Button size="sm" variant="ghost" asChild>
          <a href={repo.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} />
          </a>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div 
              className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-500'}`}
            />
            <span>{repo.language}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork size={14} className="text-blue-400" />
            <span>{repo.forks}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {new Date(repo.updated).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};