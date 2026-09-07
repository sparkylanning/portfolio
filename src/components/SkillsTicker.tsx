import React from 'react';
import { consolidatedSkills } from '../data/portfolioData';
import { 
  TrendingUp, 
  Layers, 
  FileSpreadsheet, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Workflow, 
  Compass,
  Cpu,
  Boxes
} from 'lucide-react';

const icons = [
  TrendingUp, 
  Layers, 
  FileSpreadsheet, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Workflow, 
  Compass,
  Cpu,
  Boxes
];

export const SkillsTicker: React.FC = () => {
  // Duplicate array to ensure endless seamless loop
  const rowOne = [...consolidatedSkills, ...consolidatedSkills];
  const rowTwo = [
    'Industrial Exosuit Testing',
    'Propane Tank Refurbishment',
    'Facilities & Custodial Care',
    'Practical Excel Modeling',
    'Commercial Ledger Auditing',
    'Freight PO Verification',
    'Tableau Visual Dashboards',
    'SOP Documentation & Training',
    'Logistics Flow & Triage',
    'Industrial Exosuit Testing',
    'Propane Tank Refurbishment',
    'Facilities & Custodial Care',
    'Practical Excel Modeling',
    'Commercial Ledger Auditing',
    'Freight PO Verification',
    'Tableau Visual Dashboards',
    'SOP Documentation & Training',
    'Logistics Flow & Triage'
  ];

  return (
    <section 
      id="skills" 
      className="w-full py-12 bg-[#EBE2D2] border-y border-[#1B4332]/20 overflow-hidden relative selection:bg-[#1B4332] selection:text-[#F4EFE6] skills-ticker-container group/ticker cursor-default"
    >
      {/* Subtle fade edges on sides */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#EBE2D2] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#EBE2D2] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#1B4332] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#1B4332]">
            Core Competencies & Toolset
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-[#4F6355] font-semibold px-2.5 py-1 rounded-sm bg-[#FAF6EF]/60 border border-[#1B4332]/15">
            Hover to pause
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#4F6355] font-semibold hidden md:inline-block">
            Quantitative • Operational • Systematic
          </span>
        </div>
      </div>

      {/* Row 1: Leftward infinite marquee */}
      <div className="flex overflow-hidden">
        <div className="flex items-center gap-3.5 whitespace-nowrap animate-marquee group-hover/ticker:[animation-play-state:paused] py-1.5 will-change-transform">
          {rowOne.map((skill, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={`r1-${index}`}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm bg-[#FAF6EF] border border-[#1B4332]/20 shadow-2xs hover:border-[#1B4332] hover:bg-white transition-all cursor-default select-none"
              >
                <div className="w-5 h-5 rounded-sm bg-[#1B4332] text-[#F4EFE6] flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#18221B]">
                  {skill}
                </span>
                <span className="text-[#1B4332]/40 text-xs pl-1">✦</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Rightward / reversed infinite marquee */}
      <div className="flex overflow-hidden mt-3">
        <div className="flex items-center gap-3.5 whitespace-nowrap animate-marquee-reverse group-hover/ticker:[animation-play-state:paused] py-1.5 will-change-transform">
          {rowTwo.map((skill, index) => (
            <div
              key={`r2-${index}`}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-sm bg-[#1B4332] text-[#F4EFE6] border border-[#1B4332] shadow-2xs hover:bg-[#2D6A4F] transition-all cursor-default select-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#EBE2D2]" />
              <span className="text-xs font-medium tracking-wider uppercase">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
