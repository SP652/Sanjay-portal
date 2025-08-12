import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, FileText, FolderOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: string;
    icon?: React.ComponentType<any>;
  }>;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hi! I'm SanjayBot, your AI assistant. I can help you learn about Sanjay's experience, projects, and skills. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
      actions: [
        { label: 'View Resume', action: 'open-resume', icon: FileText },
        { label: 'See Projects', action: 'open-projects', icon: FolderOpen },
        { label: 'Show Skills', action: 'open-skills', icon: Zap },
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue }),
      });

      let botResponse: string;
      let actions: Message['actions'] = undefined;

      if (response.ok) {
        const data = await response.json();
        botResponse = data.answer;
        actions = data.actions;
      } else {
        // Fallback response based on content matching
        botResponse = generateFallbackResponse(inputValue);
        actions = generateFallbackActions(inputValue);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date(),
        actions,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Here's what I can tell you based on the information I have about Sanjay:",
        isBot: true,
        timestamp: new Date(),
        actions: [
          { label: 'View Resume', action: 'open-resume', icon: FileText },
          { label: 'See Projects', action: 'open-projects', icon: FolderOpen },
          { label: 'Show Skills', action: 'open-skills', icon: Zap },
        ]
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('project') || lowerInput.includes('work')) {
      return "Sanjay has worked on several impressive projects including an AI Chat Platform with real-time responses, an E-commerce Analytics Dashboard with advanced visualizations, and a Smart Weather App with AI-powered predictions. Each project showcases his expertise in modern web technologies and AI integration.";
    }
    
    if (lowerInput.includes('skill') || lowerInput.includes('technolog')) {
      return "Sanjay is proficient in JavaScript, TypeScript, React, Node.js, Python, and various AI technologies including OpenAI API and TensorFlow. He has experience with cloud platforms like AWS and modern tools like Docker and Kubernetes.";
    }
    
    if (lowerInput.includes('experienc') || lowerInput.includes('background')) {
      return "Sanjay is a Senior Full Stack Developer with 5+ years of experience. He currently works at TechCorp Inc., where he leads development of enterprise-scale applications and has implemented AI-powered features that increased user engagement by 40%.";
    }
    
    if (lowerInput.includes('contact') || lowerInput.includes('hire') || lowerInput.includes('email')) {
      return "You can reach Sanjay at sanjay@example.com. He's based in San Francisco, CA and is always interested in discussing new opportunities and innovative projects.";
    }
    
    return "I'd be happy to help you learn more about Sanjay! You can ask me about his projects, skills, experience, or background. What specific aspect interests you the most?";
  };

  const generateFallbackActions = (input: string): Message['actions'] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('project')) {
      return [{ label: 'View Projects', action: 'open-projects', icon: FolderOpen }];
    }
    
    if (lowerInput.includes('skill')) {
      return [{ label: 'Show Skills', action: 'open-skills', icon: Zap }];
    }
    
    if (lowerInput.includes('experienc') || lowerInput.includes('resume')) {
      return [{ label: 'View Resume', action: 'open-resume', icon: FileText }];
    }
    
    return [
      { label: 'View Resume', action: 'open-resume', icon: FileText },
      { label: 'See Projects', action: 'open-projects', icon: FolderOpen },
    ];
  };

  const handleAction = (action: string) => {
    // In a real implementation, this would communicate with the parent Desktop component
    console.log('Action triggered:', action);
    
    const actionMessage: Message = {
      id: Date.now().toString(),
      content: `Great! I would open the ${action.replace('open-', '')} section for you. In a full implementation, this would open the corresponding window.`,
      isBot: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, actionMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
            <Bot size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SanjayBot</h3>
            <p className="text-sm text-muted-foreground">AI Assistant</p>
          </div>
          <div className="flex-1" />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              onAction={handleAction}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-muted-foreground"
          >
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">SanjayBot is thinking...</span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Sanjay's experience, projects, or skills..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
  onAction: (action: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl
            ${message.isBot 
              ? 'glass border border-glass-border' 
              : 'bg-primary text-primary-foreground'
            }
          `}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {message.actions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => onAction(action.action)}
                  >
                    {Icon && <Icon size={12} className="mr-1" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
          {message.isBot ? (
            <>
              <Bot size={12} />
              <span>SanjayBot</span>
            </>
          ) : (
            <>
              <User size={12} />
              <span>You</span>
            </>
          )}
          <span>•</span>
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      {message.isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center order-1 mr-3 mt-1 flex-shrink-0">
          <Bot size={16} className="text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
};