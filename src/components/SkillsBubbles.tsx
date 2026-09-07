import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { initialSkillBubbles } from '../data/portfolioData';
import { SkillBubbleItem } from '../types';
import { 
  TrendingUp, 
  Layers, 
  FileSpreadsheet, 
  BarChart3, 
  ShieldCheck, 
  Workflow, 
  Boxes, 
  Cpu, 
  Database, 
  Scale, 
  CircleDollarSign,
  Info,
  X,
  Users,
  MessageSquare,
  Lightbulb,
  Repeat,
  Handshake,
  Compass,
  Truck
} from 'lucide-react';

const categoryIcons: Record<string, React.ElementType> = {
  operations: Workflow,
  analytics: BarChart3,
  finance: CircleDollarSign,
  'soft-skills': Users,
  tools: Cpu
};

const skillIcons: Record<string, React.ElementType> = {
  'skill-cross-functional': Users,
  'skill-stakeholder-comm': MessageSquare,
  'skill-problem-solving': Lightbulb,
  'skill-continuous-improvement': Repeat,
  'skill-vendor-relations': Handshake,
  'skill-adaptability': Compass,
  'skill-excel': FileSpreadsheet,
  'skill-supply-chain': Workflow,
  'skill-tableau': BarChart3,
  'skill-accounting': CircleDollarSign,
  'skill-sops': Layers,
  'skill-inventory-management': Boxes,
  'skill-logistics-coordination': Truck,
  'skill-pricing-insights': TrendingUp,
  'skill-category-insights': TrendingUp,
  'skill-quickbooks': Scale,
  'skill-cash-flow': CircleDollarSign,
  'skill-data-cleaning': Database,
  'skill-custodial': ShieldCheck,
};

export const SkillsBubbles: React.FC = () => {
  const [selectedBubble, setSelectedBubble] = useState<SkillBubbleItem | null>(null);

  const bubbles = initialSkillBubbles;

  return (
    <section 
      id="skills" 
      className="py-20 md:py-28 bg-[#FAF6EF] border-y border-[#1B4332]/20 relative overflow-hidden selection:bg-[#1B4332] selection:text-[#F4EFE6]"
    >
      {/* Background ambient bubble circles */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#EBE2D2]/40 -z-10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#1B4332]/5 -z-10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[#1B4332]/15">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#1B4332] font-bold">
              <div className="h-[1px] w-8 bg-[#1B4332]" />
              <span>Core Toolset & Competencies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#18221B] tracking-tight">
              Skill Cloud<span className="text-[#1B4332] italic">.</span>
            </h2>
            <p className="text-sm text-[#3E4A40] max-w-xl font-normal leading-relaxed">
              Bubbles pop into view as you navigate the page. Click any bubble to inspect my practical operational application.
            </p>
          </div>

          <div className="text-xs text-[#4F6355] font-medium hidden sm:block">
            <span>Interactive Competency Matrix</span>
          </div>
        </div>

        {/* Dynamic Bubble Cluster Field */}
        <div className="py-12 relative min-h-[360px] flex items-center justify-center">
          <motion.div 
            layout
            className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 max-w-5xl mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {bubbles.map((bubble, index) => {
                const IconComponent = skillIcons[bubble.id] || categoryIcons[bubble.category] || Workflow;
                const isSelected = selectedBubble?.id === bubble.id;

                // Alternate organic vertical float values
                const floatY = (index % 3 === 0) ? -7 : (index % 3 === 1) ? -10 : -5;
                const floatDuration = 3.2 + (index % 4) * 0.5;

                // Varied visual weight based on size property
                let sizeClasses = '';
                let badgeClasses = '';
                let textClasses = '';

                if (bubble.size === 'lg') {
                  sizeClasses = isSelected
                    ? 'bg-[#1B4332] text-[#F4EFE6] ring-4 ring-[#1B4332]/30 shadow-md py-3.5 px-6 sm:px-7 rounded-full'
                    : 'bg-[#FAF6EF] text-[#18221B] border-2 border-[#1B4332]/30 hover:border-[#1B4332] shadow-xs py-3 px-5 sm:px-6 rounded-full';
                  badgeClasses = isSelected ? 'bg-white/20 text-[#FAF6EF]' : 'bg-[#1B4332] text-[#F4EFE6]';
                  textClasses = 'text-sm sm:text-base font-bold tracking-tight';
                } else if (bubble.size === 'md') {
                  sizeClasses = isSelected
                    ? 'bg-[#1B4332] text-[#F4EFE6] ring-4 ring-[#1B4332]/30 shadow-md py-2.5 px-5 rounded-full'
                    : 'bg-[#F4EFE6] text-[#18221B] border border-[#1B4332]/25 hover:border-[#1B4332] shadow-2xs py-2 px-4 rounded-full';
                  badgeClasses = isSelected ? 'bg-white/20 text-[#FAF6EF]' : 'bg-[#1B4332]/15 text-[#1B4332]';
                  textClasses = 'text-xs sm:text-sm font-semibold';
                } else {
                  // sm
                  sizeClasses = isSelected
                    ? 'bg-[#1B4332] text-[#F4EFE6] ring-4 ring-[#1B4332]/30 shadow-sm py-2 px-4 rounded-full'
                    : 'bg-[#EBE2D2]/80 text-[#2E3B32] border border-[#1B4332]/20 hover:border-[#1B4332] py-1.5 px-3.5 rounded-full';
                  badgeClasses = isSelected ? 'bg-white/20 text-[#FAF6EF]' : 'bg-[#1B4332]/10 text-[#1B4332]';
                  textClasses = 'text-xs font-medium';
                }

                return (
                  <motion.div
                    key={bubble.id}
                    layout
                    initial={{ scale: 0, opacity: 0, y: 35 }}
                    whileInView={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 280,
                      damping: 22,
                      delay: (index % 6) * 0.04
                    }}
                    animate={{
                      y: [0, floatY, 0],
                      transition: {
                        duration: floatDuration,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: (index % 5) * 0.2
                      }
                    }}
                    whileHover={{ 
                      scale: 1.08,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedBubble(isSelected ? null : bubble)}
                    className={`cursor-pointer transition-colors duration-200 select-none inline-flex items-center gap-2.5 relative group ${sizeClasses}`}
                  >
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${badgeClasses}`}>
                      <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>

                    <span className={textClasses}>
                      {bubble.name}
                    </span>

                    {bubble.size === 'lg' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]/40 group-hover:bg-[#1B4332] transition-colors" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Selected Bubble Deep Dive Card (Pops in on tap) */}
        <AnimatePresence>
          {selectedBubble ? (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mt-6 max-w-2xl mx-auto p-6 bg-[#F4EFE6] border-2 border-[#1B4332] rounded-sm shadow-md relative"
            >
              <button
                onClick={() => setSelectedBubble(null)}
                className="absolute top-4 right-4 p-1 rounded-sm text-[#4F6355] hover:text-[#18221B] hover:bg-[#EBE2D2] transition-colors cursor-pointer"
                aria-label="Close skill detail"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#1B4332] mb-1.5">
                <Info className="w-4 h-4" />
                <span>{selectedBubble.categoryLabel}</span>
              </div>

              <h4 className="text-xl font-serif font-bold text-[#18221B] mb-2">
                {selectedBubble.name}
              </h4>

              <p className="text-sm text-[#2E3B32] leading-relaxed">
                {selectedBubble.context}
              </p>
            </motion.div>
          ) : (
            <div className="text-center pt-2">
              <span className="text-xs text-[#4F6355] uppercase tracking-widest font-medium">
                Tip: Click any bubble to view my project context & methodology
              </span>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
