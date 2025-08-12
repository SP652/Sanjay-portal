import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, Mail, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeData {
  user: {
    name: string;
    title: string;
    bio: string;
    location: string;
    email: string;
  };
  resume: {
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
      technologies: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      gpa?: string;
    }>;
  };
}

export const ResumeView: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const response = await fetch('/data/content.json');
        const data = await response.json();
        setResumeData(data);
      } catch (error) {
        console.error('Failed to load resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load resume data</p>
      </div>
    );
  }

  const { user, resume } = resumeData;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center border-b border-border pb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">{user.name}</h1>
          <p className="text-lg text-primary mb-3">{user.title}</p>
          <div className="flex justify-center items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
          <Button className="mt-4" variant="outline">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </motion.div>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Professional Summary</h2>
          <p className="text-muted-foreground leading-relaxed">{resume.summary}</p>
        </motion.section>

        {/* Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp, index) => (
              <div key={index} className="glass rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-primary">{exp.company}</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={14} className="mr-1" />
                    {exp.period}
                  </div>
                </div>
                <p className="text-muted-foreground mb-3 leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Education</h2>
          <div className="space-y-3">
            {resume.education.map((edu, index) => (
              <div key={index} className="glass rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-primary">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};