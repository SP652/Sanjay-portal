import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, Cloud, Wrench, Zap, Brain } from 'lucide-react';

interface SkillsData {
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    cloud: string[];
    tools: string[];
    ai: string[];
  };
}

const skillCategories = [
  {
    key: 'languages',
    title: 'Programming Languages',
    icon: Code,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'frontend',
    title: 'Frontend Technologies',
    icon: Layers,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    key: 'backend',
    title: 'Backend & Database',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    key: 'cloud',
    title: 'Cloud & DevOps',
    icon: Cloud,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    key: 'tools',
    title: 'Development Tools',
    icon: Wrench,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    key: 'ai',
    title: 'AI & Machine Learning',
    icon: Brain,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
];

export const SkillsView: React.FC = () => {
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        const response = await fetch('/data/content.json');
        const data = await response.json();
        setSkillsData(data);
      } catch (error) {
        console.error('Failed to load skills data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSkillsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!skillsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load skills data</p>
      </div>
    );
  }

  const { skills } = skillsData;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Skills & Technologies</h1>
          <p className="text-muted-foreground">My technical expertise and tools I work with</p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {skillCategories.map((category, index) => {
            const categorySkills = skills[category.key as keyof typeof skills];
            const Icon = category.icon;
            const isSelected = selectedCategory === category.key;
            
            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  glass rounded-lg p-6 cursor-pointer transition-all duration-200
                  ${isSelected ? 'glass-hover glow-primary' : 'hover:glass-hover'}
                `}
                onClick={() => setSelectedCategory(isSelected ? null : category.key)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <Icon size={24} className={category.color} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categorySkills.length} skills
                    </p>
                  </div>
                </div>

                <motion.div
                  initial={false}
                  animate={{ height: isSelected ? 'auto' : '80px' }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: skillIndex * 0.05 }}
                        className={`
                          px-3 py-1 text-sm rounded-full transition-all duration-200
                          ${isSelected 
                            ? `${category.bgColor} ${category.color} font-medium` 
                            : 'bg-muted text-muted-foreground'
                          }
                        `}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {!isSelected && categorySkills.length > 6 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Click to see all skills...
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="font-semibold text-foreground mb-4">Skills Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skillCategories.map((category) => {
              const categorySkills = skills[category.key as keyof typeof skills];
              return (
                <div key={category.key} className="text-center">
                  <div className={`text-2xl font-bold ${category.color}`}>
                    {categorySkills.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category.title.replace(' Technologies', '').replace(' & Database', '')}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};