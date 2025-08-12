import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
}

interface ProjectsData {
  projects: Project[];
}

export const ProjectsView: React.FC = () => {
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectsData = async () => {
      try {
        const response = await fetch('/data/content.json');
        const data = await response.json();
        setProjectsData(data);
      } catch (error) {
        console.error('Failed to load projects data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectsData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!projectsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load projects data</p>
      </div>
    );
  }

  const { projects } = projectsData;
  const featuredProjects = projects.filter(p => p.featured);

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Showcasing my latest work and experiments</p>
        </motion.div>

        {/* Featured Projects */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Star className="text-yellow-400" size={20} />
            <h2 className="text-lg font-semibold text-foreground">Featured Projects</h2>
          </div>
          <div className="grid gap-4">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.section>

        {/* All Projects */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">All Projects</h2>
          <div className="grid gap-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
                delay={index * 0.05}
                compact
              />
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  delay?: number;
  compact?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, delay = 0, compact = false }) => {
  const statusColors = {
    completed: 'bg-green-500/20 text-green-400',
    'in-progress': 'bg-yellow-500/20 text-yellow-400',
    planned: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-lg p-4 hover:glass-hover cursor-pointer transition-all duration-200 group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${statusColors[project.status]}`}>
              {project.status}
            </span>
            {project.featured && (
              <Star className="text-yellow-400 fill-current" size={16} />
            )}
          </div>
          <p className={`text-muted-foreground ${compact ? 'text-sm' : ''}`}>
            {compact ? project.description : project.longDescription}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {project.technologies.slice(0, compact ? 3 : 6).map((tech, index) => (
          <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
            {tech}
          </span>
        ))}
        {compact && project.technologies.length > 3 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
            +{project.technologies.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {project.github && (
          <Button size="sm" variant="outline" className="text-xs" asChild>
            <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Github size={14} className="mr-1" />
              Code
            </a>
          </Button>
        )}
        {project.demo && (
          <Button size="sm" variant="outline" className="text-xs" asChild>
            <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={14} className="mr-1" />
              Demo
            </a>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Projects
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{project.longDescription}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex space-x-4">
            {project.github && (
              <Button asChild>
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <Github size={16} className="mr-2" />
                  View Code
                </a>
              </Button>
            )}
            {project.demo && (
              <Button variant="outline" asChild>
                <a href={project.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};