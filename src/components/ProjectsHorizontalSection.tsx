import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValue } from 'motion/react';
import { ProjectItem } from '../types';
import { 
  FolderGit2, 
  Building2, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ProjectsHorizontalSectionProps {
  projects: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
}

export const ProjectsHorizontalSection: React.FC<ProjectsHorizontalSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [scrollRange, setScrollRange] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Motion value for horizontal position
  const x = useMotionValue(0);

  // State refs to track scroll direction and whether user scrolled past the section
  const hasPassedSectionRef = useRef<boolean>(false);
  const lastScrollYRef = useRef<number>(0);

  // Monitor scroll within the container
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Calculate dynamic pixel transform based on actual track width and parent container
  useEffect(() => {
    const updateScrollRange = () => {
      if (trackRef.current && trackRef.current.parentElement) {
        const totalWidth = trackRef.current.scrollWidth;
        const containerWidth = trackRef.current.parentElement.clientWidth;
        // Perfect fit: exact distance needed for last card to comfortably sit in view without overflow or clipping
        const maxScroll = Math.max(0, totalWidth - containerWidth + 24);
        setScrollRange(maxScroll);
      }
    };

    updateScrollRange();
    window.addEventListener('resize', updateScrollRange);
    return () => window.removeEventListener('resize', updateScrollRange);
  }, [projects]);

  // Track scroll changes:
  // When scrolling DOWN: standard smooth 1:1 progression across all cards.
  // When scrolling UP after having passed the section: accelerate horizontal scroll 2.5x so cards zip past quickly.
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const currentY = window.scrollY;
      const isScrollingUp = currentY < lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      // Mark if user scrolled past the section
      if (latest >= 0.94) {
        hasPassedSectionRef.current = true;
      } else if (latest <= 0.05) {
        hasPassedSectionRef.current = false;
      }

      if (hasPassedSectionRef.current && isScrollingUp) {
        // Scrolling UP after having passed: accelerate sideways motion so it finishes in the first ~35% of upward scroll
        const acceleratedProgress = Math.max(0, Math.min(1, (latest - 0.65) / 0.35));
        x.set(-acceleratedProgress * scrollRange);
      } else {
        // Normal smooth progression
        x.set(-latest * scrollRange);
      }

      const normalized = Math.max(0, Math.min(1, latest));
      const step = Math.min(
        projects.length - 1,
        Math.floor(normalized * projects.length)
      );
      setActiveStep(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress, scrollRange, projects.length, x]);

  // Jump to specific item by scrolling window
  const scrollToProject = (index: number) => {
    if (!targetRef.current) return;
    const containerTop = targetRef.current.offsetTop;
    const containerHeight = targetRef.current.offsetHeight - window.innerHeight;
    const targetProgress = index / Math.max(1, projects.length - 1);
    const targetScroll = containerTop + targetProgress * containerHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const handlePrev = () => {
    const prev = Math.max(0, activeStep - 1);
    scrollToProject(prev);
  };

  const handleNext = () => {
    const next = Math.min(projects.length - 1, activeStep + 1);
    scrollToProject(next);
  };

  return (
    <section 
      id="projects" 
      ref={targetRef} 
      className="relative bg-[#FAF6EF] border-t border-[#1B4332]/20"
      style={{ height: `${(projects.length + 1) * 26 + 30}vh` }}
    >
      {/* Full-viewport sticky deck: covers 100% of the screen seamlessly with no gaps */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden flex flex-col justify-between pt-16 sm:pt-20 pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 lg:px-16 bg-[#FAF6EF] border-b border-[#1B4332]/20">
        
        {/* Top Header Bar with Geometric Balance design header */}
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2.5 border-b border-[#1B4332]/15 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] font-bold text-[#1B4332] mb-0.5">
              <div className="h-[1px] w-5 bg-[#1B4332]" />
              <span>Applied Systems & Analytics Work</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-normal text-[#18221B] tracking-tight">
              Featured Projects<span className="text-[#1B4332] italic">.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#1B4332] font-semibold">
              <div className="h-[1px] w-10 bg-[#1B4332]" />
              <span className="text-xs italic font-serif">Scroll down to advance horizontally &rarr;</span>
            </div>

            {/* Manual Controls - The same crisp buttons */}
            <div className="flex items-center gap-1.5">
              <button
                id="projects-prev-btn"
                onClick={handlePrev}
                disabled={activeStep === 0}
                aria-label="Previous Project"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm border border-[#1B4332]/30 bg-[#FAF6EF] hover:bg-[#1B4332] hover:text-[#F4EFE6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-[#1B4332] shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="projects-next-btn"
                onClick={handleNext}
                disabled={activeStep === projects.length - 1}
                aria-label="Next Project"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-sm border border-[#1B4332]/30 bg-[#FAF6EF] hover:bg-[#1B4332] hover:text-[#F4EFE6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-[#1B4332] shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Motion Track across full width */}
        <div className="relative flex-1 flex items-center overflow-visible py-2">
          <motion.div 
            ref={trackRef} 
            style={{ x }} 
            className="flex gap-5 sm:gap-6 md:gap-7 pl-4 sm:pl-8 md:pl-16 pr-24 sm:pr-36 md:pr-48 will-change-transform"
          >
            {/* Intro Lead Card - Fits completely, no internal scrollbar */}
            <div className="w-[280px] sm:w-[320px] md:w-[360px] h-[330px] sm:h-[350px] md:h-[370px] shrink-0 flex flex-col justify-between p-5 sm:p-6 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/20 shadow-sm overflow-hidden">
              <div className="space-y-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1B4332] rounded-full flex items-center justify-center text-[#F4EFE6] font-serif font-bold text-sm shadow-2xs">
                  <FolderGit2 className="w-4 h-4 text-[#F4EFE6]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#1B4332] font-bold block">
                  Things I've Built & Solved
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-[#18221B] leading-snug">
                  Hands-on projects & practical tools.
                </h3>
                <p className="text-xs sm:text-[13px] text-[#3E4A40] leading-relaxed line-clamp-3 sm:line-clamp-4">
                  Here are projects where I tackled real operational challenges: from developing spreadsheet decision models and optimizing freight logistics, to tracking property cash flows, engineering standard operating procedures, and building visual dashboards.
                </p>
              </div>

              <div className="pt-3 border-t border-[#1B4332]/15 space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-[#1B4332] font-bold">WHAT I ENJOY BUILDING</div>
                <div className="flex flex-wrap gap-1 text-xs">
                  <span className="px-2 py-0.5 rounded-sm bg-[#FAF6EF] text-[#1B4332] text-[10px] font-semibold border border-[#1B4332]/15">
                    Process Optimization
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#FAF6EF] text-[#1B4332] text-[10px] font-semibold border border-[#1B4332]/15">
                    Decision Models
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#FAF6EF] text-[#1B4332] text-[10px] font-semibold border border-[#1B4332]/15">
                    Property Accounting
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-[#FAF6EF] text-[#1B4332] text-[10px] font-semibold border border-[#1B4332]/15">
                    Invoice Audits
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#1B4332] font-bold uppercase tracking-wider pt-0.5">
                  <span>Scroll right to view projects</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Project Cards - Matching The Path So Far exactly */}
            {projects.map((project, index) => (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="w-[280px] sm:w-[480px] md:w-[560px] lg:w-[620px] h-[330px] sm:h-[350px] md:h-[370px] shrink-0 bg-[#F4EFE6] rounded-sm border border-[#1B4332]/20 shadow-sm overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:border-[#1B4332]/50 group"
              >
                {/* Left/Top Image Section */}
                <div className="md:w-5/12 h-28 sm:h-32 md:h-full relative bg-[#1B4332] overflow-hidden shrink-0">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover filter contrast-[1.02] transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category & Period pill */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-sm bg-[#FAF6EF]/95 text-[#1B4332] border border-[#1B4332]/20 shadow-2xs">
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white z-10">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#D5DFD8] font-bold block">
                      Project {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="text-xs sm:text-sm font-semibold text-white/95 font-serif line-clamp-1">
                      {project.title}
                    </div>
                  </div>
                </div>

                {/* Right/Bottom Content Body - Cleanly arranged without vertical scrollbar */}
                <div className="md:w-7/12 p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5 sm:space-y-2">
                    {/* Organization & Period */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#4F6355]">
                      <span className="font-bold text-[#1B4332] uppercase tracking-wider flex items-center gap-1.5 text-[10px] sm:text-[11px] truncate">
                        <Building2 className="w-3 h-3 text-[#1B4332] shrink-0" />
                        {project.organization}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium shrink-0">
                        <Calendar className="w-3 h-3 text-[#4F6355]" />
                        {project.period}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h4 className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#18221B] group-hover:text-[#1B4332] transition-colors leading-tight">
                      {project.title}
                    </h4>

                    <p className="text-xs font-medium text-[#1B4332] italic font-serif line-clamp-1">
                      "{project.tagline}"
                    </p>

                    <p className="text-xs text-[#3E4A40] leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {project.description}
                    </p>

                    {project.keyOutcomes && project.keyOutcomes.length > 0 && (
                      <div className="pt-1.5 border-t border-[#1B4332]/15">
                        <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#1B4332] font-bold mb-0.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#1B4332]" />
                          Key Deliverable
                        </div>
                        <p className="text-xs text-[#18221B] line-clamp-1 sm:line-clamp-2">
                          • {project.keyOutcomes[0]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tools Used Chips & View Action */}
                  <div className="pt-2 border-t border-[#1B4332]/15 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex flex-wrap gap-1 max-w-[200px] sm:max-w-[240px]">
                      {project.toolsUsed.slice(0, 3).map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.5 rounded-sm text-[10px] font-semibold bg-[#EBE2D2] text-[#1B4332] border border-[#1B4332]/15"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {onSelectProject && (
                      <button
                        id={`view-project-${project.id}`}
                        onClick={() => onSelectProject(project)}
                        className="inline-flex items-center justify-center gap-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1B4332] hover:text-[#F4EFE6] bg-[#FAF6EF] hover:bg-[#1B4332] border border-[#1B4332]/30 px-2.5 sm:px-3 py-1.5 rounded-sm transition-all shadow-2xs shrink-0 cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Trailing End Spacer ensuring exact fit without overscroll */}
            <div className="w-6 sm:w-8 shrink-0 pointer-events-none" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Bottom Status Bar with The Little Squares */}
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pt-2.5 border-t border-[#1B4332]/15 text-xs text-[#4F6355] shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-xs bg-[#1B4332]" />
            <span>Project {activeStep + 1} of {projects.length}</span>
          </div>
          
          {/* The Little Squares */}
          <div className="flex items-center gap-2">
            {projects.map((project, idx) => (
              <button
                key={idx}
                onClick={() => scrollToProject(idx)}
                aria-label={`Jump to ${project.title} (${idx + 1})`}
                title={project.title}
                className={`h-2 transition-all duration-300 rounded-none cursor-pointer ${
                  activeStep === idx 
                    ? 'w-6 bg-[#1B4332]' 
                    : 'w-2.5 bg-[#1B4332]/30 hover:bg-[#1B4332]'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
