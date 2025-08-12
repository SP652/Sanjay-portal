import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeetCodeData {
  user: {
    leetcode: string;
  };
  stats: {
    leetcodeSolved: number;
  };
}

interface ProblemStats {
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
}

export const LeetCodeView: React.FC = () => {
  const [leetcodeData, setLeetcodeData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeetCodeData = async () => {
      try {
        const response = await fetch('/data/content.json');
        const data = await response.json();
        setLeetcodeData(data);
      } catch (error) {
        console.error('Failed to load LeetCode data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeetCodeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!leetcodeData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load LeetCode data</p>
      </div>
    );
  }

  // Mock data for demonstration (in real implementation, would fetch from LeetCode API or user input)
  const problemStats: ProblemStats = {
    easy: { solved: 85, total: 150 },
    medium: { solved: 120, total: 300 },
    hard: { solved: 40, total: 200 },
  };

  const totalSolved = problemStats.easy.solved + problemStats.medium.solved + problemStats.hard.solved;
  const totalProblems = problemStats.easy.total + problemStats.medium.total + problemStats.hard.total;

  const recentSubmissions = [
    {
      id: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      status: 'Accepted',
      date: '2024-01-20',
      runtime: '68ms',
    },
    {
      id: 2,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      status: 'Accepted',
      date: '2024-01-19',
      runtime: '12ms',
    },
    {
      id: 3,
      title: 'Median of Two Sorted Arrays',
      difficulty: 'Hard',
      status: 'Accepted',
      date: '2024-01-18',
      runtime: '24ms',
    },
    {
      id: 4,
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      status: 'Accepted',
      date: '2024-01-17',
      runtime: '0ms',
    },
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
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy size={32} className="text-orange-400" />
            <h1 className="text-2xl font-bold text-foreground">LeetCode Profile</h1>
          </div>
          <p className="text-muted-foreground mb-4">
            Coding challenges and algorithmic problem solving
          </p>
          <Button asChild>
            <a 
              href={`https://leetcode.com/${leetcodeData.user.leetcode}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} className="mr-2" />
              View on LeetCode
            </a>
          </Button>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Overall Progress</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalSolved}</div>
              <div className="text-sm text-muted-foreground">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{totalProblems}</div>
              <div className="text-sm text-muted-foreground">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {Math.round((totalSolved / totalProblems) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">⭐</div>
              <div className="text-sm text-muted-foreground">LeetCoder</div>
            </div>
          </div>
        </motion.div>

        {/* Problem Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-foreground">Problem Breakdown</h2>
          
          <DifficultyCard
            difficulty="Easy"
            solved={problemStats.easy.solved}
            total={problemStats.easy.total}
            color="text-green-400"
            bgColor="bg-green-500/10"
          />
          
          <DifficultyCard
            difficulty="Medium"
            solved={problemStats.medium.solved}
            total={problemStats.medium.total}
            color="text-yellow-400"
            bgColor="bg-yellow-500/10"
          />
          
          <DifficultyCard
            difficulty="Hard"
            solved={problemStats.hard.solved}
            total={problemStats.hard.total}
            color="text-red-400"
            bgColor="bg-red-500/10"
          />
        </motion.div>

        {/* Recent Submissions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Submissions</h2>
          <div className="space-y-3">
            {recentSubmissions.map((submission, index) => (
              <SubmissionCard key={submission.id} submission={submission} delay={index * 0.1} />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

interface DifficultyCardProps {
  difficulty: string;
  solved: number;
  total: number;
  color: string;
  bgColor: string;
}

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  solved,
  total,
  color,
  bgColor,
}) => {
  const percentage = (solved / total) * 100;

  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className={color} size={20} />
          <span className="font-semibold text-foreground">{difficulty}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {solved} / {total}
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${bgColor.replace('/10', '')}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        {percentage.toFixed(1)}% completed
      </div>
    </div>
  );
};

interface SubmissionCardProps {
  submission: {
    title: string;
    difficulty: string;
    status: string;
    date: string;
    runtime: string;
  };
  delay?: number;
}

const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, delay = 0 }) => {
  const difficultyColors = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-lg p-4 hover:glass-hover transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-1">
            <CheckCircle className="text-green-400" size={16} />
            <h3 className="font-medium text-foreground">{submission.title}</h3>
            <span 
              className={`text-sm ${difficultyColors[submission.difficulty as keyof typeof difficultyColors]}`}
            >
              {submission.difficulty}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <CheckCircle size={12} />
              <span>{submission.status}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{submission.runtime}</span>
            </div>
            <span>{new Date(submission.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};