import React from 'react';
import { motion } from 'motion/react';
import { ProfileData } from '../types';
import { 
  Linkedin, 
  ArrowDown, 
  ArrowRight,
  FolderGit2,
  Mail
} from 'lucide-react';
import { EditableText } from './EditableText';

interface HeroProps {
  profile: ProfileData;
  onExploreCareerClick: () => void;
  onExploreProjectsClick: () => void;
  onUpdateProfile?: (updated: Partial<ProfileData>) => void;
  isEditMode?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ 
  profile, 
  onExploreCareerClick,
  onExploreProjectsClick,
  onUpdateProfile,
  isEditMode = false
}) => {
  const isVowel = /^[aeiou]/i.test(profile.roleNoun.replace('.', '').trim());
  const article = isVowel ? 'AN' : 'A';

  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between pt-24 md:pt-32 pb-10 px-6 sm:px-10 md:px-16 overflow-hidden bg-[#F4EFE6]"
    >
      {/* Subtle geometric framing accents */}
      <div className="absolute top-20 right-16 w-56 h-56 border border-[#1B4332]/12 pointer-events-none -z-10 hidden sm:block" />
      <div className="absolute top-28 right-24 w-56 h-56 border border-[#1B4332]/8 pointer-events-none -z-10 hidden sm:block" />
      <div className="absolute bottom-20 left-10 w-32 h-32 border border-[#1B4332]/12 pointer-events-none -z-10" />

      {/* Main Editorial Hero Content */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        
        {/* Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-3 flex-wrap"
        >
          <div className="h-[1px] w-8 bg-[#1B4332]" />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#1B4332] uppercase">
            Operations, Supply Chain & Analytics
          </span>
          <span className="hidden sm:inline-block text-[#1B4332]/40">•</span>
          <span className="text-[10px] sm:text-xs font-medium tracking-wider text-[#4F6355]">
            {profile.university} {profile.graduationYear}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="space-y-1 sm:space-y-2 max-w-5xl"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.14em] text-[#18221B] uppercase font-sans">
            I'M{' '}
            <EditableText
              value={profile.firstName}
              onSave={(val) => {
                const newFirst = val.trim();
                onUpdateProfile?.({ 
                  firstName: newFirst.toUpperCase(),
                  name: profile.name.includes(' ')
                    ? `${newFirst} ${profile.name.split(' ').slice(1).join(' ')}`
                    : newFirst
                });
              }}
              isEditMode={isEditMode}
              as="span"
              className="font-bold underline decoration-[#1B4332]/40"
            />{' '}
            AND I'M {article}
          </h1>

          <div className="flex items-baseline flex-wrap gap-x-4">
            <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[11.5rem] font-serif font-normal text-[#18221B] tracking-tight leading-[0.88] lowercase">
              <EditableText
                value={profile.roleNoun.replace('.', '')}
                onSave={(val) => onUpdateProfile?.({ roleNoun: `${val.toLowerCase().replace('.', '').trim()}.` })}
                isEditMode={isEditMode}
                as="span"
              />
              <span className="text-[#1B4332] italic font-serif">.</span>
            </span>
          </div>
        </motion.div>

        {/* Short Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-sm sm:text-base text-[#3E4A40] max-w-2xl font-normal leading-relaxed"
        >
          <EditableText
            value={profile.tagline}
            onSave={(val) => onUpdateProfile?.({ tagline: val })}
            isEditMode={isEditMode}
            multiline={true}
            as="span"
          />
        </motion.p>

        {/* Action Buttons to the two primary scrolls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6"
        >
          <button
            id="hero-career-btn"
            onClick={onExploreCareerClick}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#F4EFE6] bg-[#1B4332] hover:bg-[#2D6A4F] border border-[#1B4332] rounded-sm transition-all duration-200 shadow-sm"
          >
            <span>Career Path</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="hero-projects-btn"
            onClick={onExploreProjectsClick}
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase text-[#1B4332] bg-[#FAF6EF] hover:bg-[#EBE2D2] border border-[#1B4332]/30 rounded-sm transition-all duration-200 shadow-2xs"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="#personal"
            className="text-xs uppercase tracking-widest font-bold text-[#1B4332] hover:text-[#2D6A4F] transition-colors flex items-center gap-1.5"
          >
            <span>About Me Personally</span>
            <span>&rarr;</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom Row: Scroll Prompt on Left, Social/Contact link on Right (email hidden) */}
      <div className="max-w-7xl mx-auto w-full pt-6 flex items-end justify-between border-t border-[#1B4332]/15">
        
        {/* Scroll Down Prompt */}
        <a
          href="#about"
          className="flex items-center gap-2.5 text-xs tracking-widest text-[#1B4332] hover:text-[#2D6A4F] transition-colors uppercase font-bold group"
        >
          <div className="w-6 h-6 rounded-sm border border-[#1B4332]/30 bg-[#FAF6EF] flex items-center justify-center group-hover:border-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white transition-all">
            <ArrowDown className="w-3 h-3 animate-bounce" />
          </div>
          <span className="text-[11px] tracking-[0.2em]">Scroll to explore</span>
        </a>

        {/* Clean, discreet links (NO email address text exposed) */}
        <div className="flex items-center gap-5 text-[#1B4332]">
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[#2D6A4F] transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Linkedin className="w-4 h-4 stroke-[1.75]" />
            <span className="text-[11px] uppercase tracking-wider">LinkedIn</span>
          </a>

          <a
            href="#contact"
            className="hover:text-[#2D6A4F] transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Mail className="w-4 h-4 stroke-[1.75]" />
            <span className="text-[11px] uppercase tracking-wider">Contact Form</span>
          </a>
        </div>

      </div>
    </section>
  );
};
