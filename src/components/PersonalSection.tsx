import React, { useRef } from 'react';
import { PersonalItem } from '../types';
import { EditableText } from './EditableText';
import { Camera } from 'lucide-react';
import { optimizeImageFile } from '../utils/imageOptimizer';

interface PersonalSectionProps {
  items: PersonalItem[];
  onUpdateItem?: (id: string, updated: Partial<PersonalItem>) => void;
  isEditMode?: boolean;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({ 
  items,
  onUpdateItem,
  isEditMode = false
}) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handlePhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateItem) return;
    try {
      const result = await optimizeImageFile(file, 1200, 900, 0.82);
      onUpdateItem(id, { image: result.dataUrl });
    } catch (err) {
      console.error('Failed to upload personal photo', err);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <section id="personal" className="py-20 md:py-28 px-6 sm:px-10 md:px-16 bg-[#EBE2D2] border-t border-[#1B4332]/20">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-[#1B4332]/20">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#1B4332] font-bold mb-2">
            <div className="h-[1px] w-8 bg-[#1B4332]" />
            <span>About Me Personally</span>
            {isEditMode && (
              <span className="text-[10px] lowercase tracking-normal bg-amber-100 text-amber-900 px-2 py-0.5 rounded-xs border border-amber-300">
                click any text to edit
              </span>
            )}
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#18221B] tracking-tight">
            Beyond the Desk & Classroom<span className="text-[#1B4332] italic">.</span>
          </h2>
          <p className="text-sm text-[#3E4A40] mt-2 max-w-2xl font-normal leading-relaxed">
            Collegiate disc golf, coffee brewing rituals, cooking steaks for friends, and campus faith fellowship that keep me grounded and energized.
          </p>
        </div>

        {/* 2x2 or 4-Column Personal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-[#FAF6EF] rounded-sm border border-[#1B4332]/20 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#1B4332]/50 shadow-sm"
            >
              {/* Photo Slot */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#1B4332]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm bg-[#FAF6EF]/95 text-[#1B4332] border border-[#1B4332]/20 shadow-2xs">
                    <EditableText
                      value={item.category}
                      onSave={(val) => onUpdateItem?.(item.id, { category: val })}
                      isEditMode={isEditMode}
                      as="span"
                    />
                  </span>
                </div>

                {/* Instant Change Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRefs.current[item.id]?.click()}
                  className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-sm bg-[#FAF6EF]/90 hover:bg-[#FAF6EF] text-[#1B4332] text-[10px] font-bold uppercase tracking-wider border border-[#1B4332]/30 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer opacity-90 hover:opacity-100"
                  title={`Change photo for ${item.title}`}
                >
                  <Camera className="w-3 h-3" />
                  <span>Change Photo</span>
                </button>
                <input
                  ref={(el) => (fileInputRefs.current[item.id] = el)}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(item.id, e)}
                  className="hidden"
                />
              </div>

              {/* Text Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-[#18221B] group-hover:text-[#1B4332] transition-colors leading-snug">
                    <EditableText
                      value={item.title}
                      onSave={(val) => onUpdateItem?.(item.id, { title: val })}
                      isEditMode={isEditMode}
                      as="span"
                    />
                  </h3>
                  <p className="text-xs text-[#1B4332] font-semibold tracking-wide uppercase">
                    <EditableText
                      value={item.subtitle}
                      onSave={(val) => onUpdateItem?.(item.id, { subtitle: val })}
                      isEditMode={isEditMode}
                      as="span"
                    />
                  </p>
                  <div className="text-xs sm:text-sm text-[#3E4A40] leading-relaxed">
                    <EditableText
                      value={item.description}
                      onSave={(val) => onUpdateItem?.(item.id, { description: val })}
                      isEditMode={isEditMode}
                      multiline={true}
                      as="p"
                    />
                  </div>
                </div>

                {/* Tags - NO hashtags */}
                <div className="pt-3 border-t border-[#1B4332]/15 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-[#EBE2D2] text-[#1B4332] border border-[#1B4332]/15"
                    >
                      {tag.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
