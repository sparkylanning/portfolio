import React, { useRef, useState } from 'react';
import { ProjectItem } from '../types';
import { 
  X, 
  Calendar, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Layers,
  Camera,
  Loader2
} from 'lucide-react';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { EditableText } from './EditableText';

interface ProjectModalProps {
  project: ProjectItem | null;
  allProjects: ProjectItem[];
  onClose: () => void;
  onNavigate: (project: ProjectItem) => void;
  onUpdateImage?: (projectId: string, newUrl: string) => void;
  onUpdateProject?: (projectId: string, updated: Partial<ProjectItem>) => void;
  isEditMode?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  allProjects,
  onClose,
  onNavigate,
  onUpdateImage,
  onUpdateProject,
  isEditMode = false,
}) => {
  if (!project) return null;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpdateImage) {
      try {
        setIsUploading(true);
        const res = await optimizeImageFile(e.target.files[0]);
        onUpdateImage(project.id, res.dataUrl);
      } catch (err) {
        console.error('Quick project image upload error:', err);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FAF6EF] rounded-sm border border-[#1B4332]/30 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Input for quick photo upload */}
        {onUpdateImage && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleQuickImageUpload}
          />
        )}

        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#F4EFE6] border-b border-[#1B4332]/20">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#1B4332]">
            <Layers className="w-3.5 h-3.5" />
            <span>Applied Project</span>
            <span className="text-[#1B4332]/40">•</span>
            <span className="text-[#4F6355]">
              {String(currentIndex + 1).padStart(2, '0')} of {String(allProjects.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {prevProject && (
              <button
                onClick={() => onNavigate(prevProject)}
                className="p-1.5 rounded-sm border border-[#1B4332]/30 hover:bg-[#1B4332] hover:text-[#F4EFE6] text-[#1B4332] bg-[#FAF6EF] transition-colors cursor-pointer"
                title="Previous Project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {nextProject && (
              <button
                onClick={() => onNavigate(nextProject)}
                className="p-1.5 rounded-sm border border-[#1B4332]/30 hover:bg-[#1B4332] hover:text-[#F4EFE6] text-[#1B4332] bg-[#FAF6EF] transition-colors cursor-pointer"
                title="Next Project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm hover:bg-[#1B4332]/10 text-[#18221B] transition-colors ml-2 cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Photo Banner - True Color */}
        <div className="relative h-64 sm:h-72 w-full bg-[#1B4332] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover filter contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          
          {/* Quick upload photo button on hero */}
          {onUpdateImage && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer shadow-md"
              title="Upload your own photo for this project"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Photo</span>
                </>
              )}
            </button>
          )}

          <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-sm bg-[#FAF6EF]/90 text-[#1B4332] inline-block mb-2">
              <EditableText
                value={project.category}
                onSave={(val) => onUpdateProject?.(project.id, { category: val })}
                isEditMode={isEditMode}
                as="span"
              />
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              <EditableText
                value={project.title}
                onSave={(val) => onUpdateProject?.(project.id, { title: val })}
                isEditMode={isEditMode}
                as="span"
              />
            </h3>
            <p className="text-xs sm:text-sm text-[#D5DFD8] italic font-serif">
              "
              <EditableText
                value={project.tagline}
                onSave={(val) => onUpdateProject?.(project.id, { tagline: val })}
                isEditMode={isEditMode}
                as="span"
              />
              "
            </p>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F6355] pb-4 border-b border-[#1B4332]/15">
            <span className="flex items-center gap-1.5 font-bold text-[#1B4332]">
              <Building2 className="w-4 h-4" />
              <EditableText
                value={project.organization}
                onSave={(val) => onUpdateProject?.(project.id, { organization: val })}
                isEditMode={isEditMode}
                as="span"
              />
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <EditableText
                value={project.period}
                onSave={(val) => onUpdateProject?.(project.id, { period: val })}
                isEditMode={isEditMode}
                as="span"
              />
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1B4332]">
              Project Scope & Execution
            </h4>
            <div className="text-sm text-[#2E3B32] leading-relaxed">
              <EditableText
                value={project.description}
                onSave={(val) => onUpdateProject?.(project.id, { description: val })}
                isEditMode={isEditMode}
                multiline={true}
                as="p"
              />
            </div>
          </div>

          {project.keyOutcomes && project.keyOutcomes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#1B4332] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Key Deliverables & Methodologies
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#2E3B32]">
                {project.keyOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332] mt-2 shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-[#1B4332]/15">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#4F6355] mb-2">
              Tools & Methodologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.toolsUsed.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-sm text-xs font-semibold bg-[#EBE2D2] text-[#1B4332] border border-[#1B4332]/20"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F4EFE6] border-t border-[#1B4332]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm bg-[#1B4332] text-[#F4EFE6] hover:bg-[#2D6A4F] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
