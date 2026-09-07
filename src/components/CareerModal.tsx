import React, { useRef, useState } from 'react';
import { CareerItem } from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  Camera,
  Loader2
} from 'lucide-react';
import { optimizeImageFile } from '../utils/imageOptimizer';
import { EditableText } from './EditableText';

interface CareerModalProps {
  item: CareerItem | null;
  allItems: CareerItem[];
  onClose: () => void;
  onNavigate: (item: CareerItem) => void;
  onUpdateImage?: (itemId: string, newUrl: string) => void;
  onUpdateItem?: (itemId: string, updated: Partial<CareerItem>) => void;
  isEditMode?: boolean;
}

export const CareerModal: React.FC<CareerModalProps> = ({
  item,
  allItems,
  onClose,
  onNavigate,
  onUpdateImage,
  onUpdateItem,
  isEditMode = false,
}) => {
  if (!item) return null;

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = allItems.findIndex((i) => i.id === item.id);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  const handleQuickImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpdateImage) {
      try {
        setIsUploading(true);
        const res = await optimizeImageFile(e.target.files[0]);
        onUpdateImage(item.id, res.dataUrl);
      } catch (err) {
        console.error('Quick image upload error:', err);
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
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Milestone</span>
            <span className="text-[#1B4332]/40">•</span>
            <span className="text-[#4F6355]">
              {String(currentIndex + 1).padStart(2, '0')} of {String(allItems.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {prevItem && (
              <button
                onClick={() => onNavigate(prevItem)}
                className="p-1.5 rounded-sm border border-[#1B4332]/30 hover:bg-[#1B4332] hover:text-[#F4EFE6] text-[#1B4332] bg-[#FAF6EF] transition-colors cursor-pointer"
                title="Previous Milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {nextItem && (
              <button
                onClick={() => onNavigate(nextItem)}
                className="p-1.5 rounded-sm border border-[#1B4332]/30 hover:bg-[#1B4332] hover:text-[#F4EFE6] text-[#1B4332] bg-[#FAF6EF] transition-colors cursor-pointer"
                title="Next Milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-sm border border-[#1B4332]/30 hover:bg-[#1B4332] hover:text-[#F4EFE6] text-[#18221B] bg-[#FAF6EF] transition-colors ml-1 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#1B4332]">
          <img
            src={item.image}
            alt={item.role}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          {/* Quick upload photo button on hero */}
          {onUpdateImage && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer shadow-md"
              title="Upload your own photo for this role"
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
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#D5DFD8] font-medium mb-1">
              <span className="bg-[#1B4332]/90 backdrop-blur-sm px-2.5 py-0.5 rounded-sm text-white border border-white/20 uppercase tracking-wider text-[11px] font-bold">
                <EditableText
                  value={item.period}
                  onSave={(val) => onUpdateItem?.(item.id, { period: val })}
                  isEditMode={isEditMode}
                  as="span"
                />
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <EditableText
                  value={item.location}
                  onSave={(val) => onUpdateItem?.(item.id, { location: val })}
                  isEditMode={isEditMode}
                  as="span"
                />
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              <EditableText
                value={item.role}
                onSave={(val) => onUpdateItem?.(item.id, { role: val })}
                isEditMode={isEditMode}
                as="span"
              />
            </h3>
            <div className="text-sm font-medium text-white/90">
              <EditableText
                value={item.company}
                onSave={(val) => onUpdateItem?.(item.id, { company: val })}
                isEditMode={isEditMode}
                as="span"
              />
            </div>
          </div>
        </div>

        {/* Modal Content Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tagline quote */}
          <div className="p-4 rounded-sm bg-[#EBE2D2]/60 border-l-4 border-[#1B4332] text-sm italic font-serif text-[#1B4332]">
            "
            <EditableText
              value={item.tagline}
              onSave={(val) => onUpdateItem?.(item.id, { tagline: val })}
              isEditMode={isEditMode}
              as="span"
            />
            "
          </div>

          {/* Full description */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#1B4332] font-bold">
              Role & Operational Scope
            </h4>
            <div className="text-sm sm:text-base text-[#3E4A40] leading-relaxed">
              <EditableText
                value={item.description}
                onSave={(val) => onUpdateItem?.(item.id, { description: val })}
                isEditMode={isEditMode}
                multiline={true}
                as="p"
              />
            </div>
          </div>

          {/* Achievements */}
          {item.achievements && item.achievements.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#1B4332] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#1B4332]" />
                <span>Key Deliverables & Responsibilities</span>
              </h4>
              <ul className="space-y-2">
                {item.achievements.map((ach, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#18221B]">
                    <CheckCircle2 className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills / Tech */}
          <div className="space-y-2.5 pt-4 border-t border-[#1B4332]/15">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#1B4332] font-bold">
              Competencies & Software Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 rounded-sm text-xs font-semibold bg-[#EBE2D2]/80 text-[#1B4332] border border-[#1B4332]/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#F4EFE6] border-t border-[#1B4332]/20 flex items-center justify-between">
          <span className="text-xs text-[#4F6355] font-mono">
            {item.company} • {item.location}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm bg-[#1B4332] text-[#F4EFE6] hover:bg-[#2D6A4F] transition-colors shadow-2xs"
          >
            Close Deep Dive
          </button>
        </div>
      </div>
    </div>
  );
};
