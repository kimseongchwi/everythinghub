import React from 'react';

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
}

const TechIcon: React.FC<TechIconProps> = ({ name, size = 20, className = '' }) => {
  // Simple Icons slugs mapping for common aliases
  const getSlug = (techName: string) => {
    const n = techName.toLowerCase().trim();

    if (n === 'react' || n === 'react.js') return 'react';
    if (n === 'next.js' || n === 'nextjs') return 'nextdotjs';
    if (n === 'nuxt' || n === 'nuxt.js') return 'nuxt';
    if (n === 'node.js' || n === 'nodejs' || n === 'node') return 'nodedotjs';
    if (n === 'typescript' || n === 'ts') return 'typescript';
    if (n === 'javascript' || n === 'js') return 'javascript';
    if (n === 'python') return 'python';
    if (n === 'java') return 'openjdk';
    if (n === 'spring') return 'spring';
    if (n === 'springboot') return 'springboot';
    if (n === 'mysql') return 'mysql';
    if (n === 'postgresql' || n === 'postgres') return 'postgresql';
    if (n === 'mongodb') return 'mongodb';
    if (n === 'prisma') return 'prisma';
    if (n === 'tailwindcss' || n === 'tailwind') return 'tailwindcss';
    if (n === 'aws' || n === 'amazon web services') return 'amazonaws';
    if (n === 'docker') return 'docker';
    if (n === 'kubernetes' || n === 'k8s') return 'kubernetes';
    if (n === 'git') return 'git';
    if (n === 'github') return 'github';
    if (n === 'github actions') return 'githubactions';
    if (n === 'html' || n === 'html5') return 'html5';
    if (n === 'css' || n === 'css3') return 'css3';
    if (n === 'sass') return 'sass';
    if (n === 'vue' || n === 'vue.js' || n === 'vuejs') return 'vuedotjs';
    if (n === 'firebase') return 'firebase';
    if (n === 'express') return 'express';
    if (n === 'nestjs') return 'nestjs';
    if (n === 'gcp' || n === 'google cloud' || n === 'google cloud platform') return 'googlecloud';
    if (n === 'vercel') return 'vercel';
    if (n === 'notion') return 'notion';
    if (n === 'slack') return 'slack';
    if (n === 'figma') return 'figma';
    if (n === 'redis') return 'redis';
    if (n === 'supabase') return 'supabase';
    if (n === 'recoil') return 'recoil';
    if (n === 'redux') return 'redux';
    if (n === 'zustand') return 'zustand';
    if (n === 'styled components' || n === 'styled-components') return 'styledcomponents';
    if (n === 'oracle') return 'oracle';
    if (n === 'linux') return 'linux';
    if (n === 'sequelize') return 'sequelize';
    if (n === 'drizzle') return 'drizzle';
    if (n === 'discord') return 'discord';
    
    // Default: try to use the name directly as slug
    return n.replace(/\s+/g, '').replace(/\./g, 'dot');
  };

  const names = name.includes('&') ? name.split('&').map(n => n.trim()) : [name.trim()];

  return (
    <div 
      className={className} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        flexShrink: 0 
      }}
    >
      {names.map((n, idx) => {
        const slug = getSlug(n);
        const iconUrl = `https://cdn.simpleicons.org/${slug}`;
        return (
          <img
            key={idx}
            src={iconUrl}
            alt={n}
            width={size}
            height={size}
            style={{ width: size, height: size, objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      })}
    </div>
  );
};

export default TechIcon;
