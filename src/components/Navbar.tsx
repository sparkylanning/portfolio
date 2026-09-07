import React, { useState, useEffect } from 'react';
import { Mail, Sliders, FileText, Download, Edit3, Check, Camera } from 'lucide-react';
import { ProfileData } from '../types';
import { EditableText } from './EditableText';

interface NavbarProps {
  profile: ProfileData;
  onOpenCustomize: () => void;
  onOpenPhotoVault?: () => void;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onUpdateProfile?: (partial: Partial<ProfileData>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenCustomize,
  onOpenPhotoVault,
  isEditMode = false,
  onToggleEditMode,
  onUpdateProfile,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F4EFE6]/95 backdrop-blur-md border-b border-[#1B4332]/15 py-3.5 shadow-xs'
          : 'bg-[#F4EFE6]/80 backdrop-blur-xs py-4.5 border-b border-[#1B4332]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-12 flex items-center justify-between">
        
        {/* Left: Brand Monogram / Identity */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <EditableText
            value={profile.name}
            onSave={(val) => {
              const newName = val.trim();
              const first = newName.split(' ')[0] || profile.firstName;
              onUpdateProfile?.({ name: newName, firstName: first.toUpperCase() });
            }}
            isEditMode={isEditMode}
            as="span"
            className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1B4332] italic"
          />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#4F6355]">
            Operations & Analytics
          </span>
        </div>

        {/* Right: Clean minimal action buttons (No cluttering tabs) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Direct Inline Text Editing Toggle */}
          {onToggleEditMode && (
            <button
              id="nav-toggle-edit-mode-btn"
              type="button"
              onClick={onToggleEditMode}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm transition-all shadow-2xs cursor-pointer ${
                isEditMode
                  ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-400'
                  : 'bg-[#FAF6EF] hover:bg-[#EBE2D2] text-[#1B4332] border border-[#1B4332]/30'
              }`}
              title={isEditMode ? 'Click to finish inline editing' : 'Click to enable direct text editing across the portfolio'}
            >
              {isEditMode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-[#1B4332]" />
                  <span className="hidden sm:inline">Edit Text</span>
                  <span className="sm:hidden">Edit</span>
                </>
              )}
            </button>
          )}

          {/* Download Resume button if uploaded */}
          {profile.resumeUrl && (
            <a
              id="nav-resume-btn"
              href={profile.resumeUrl}
              download={profile.resumeName || 'Jacob_Lanning_Resume.pdf'}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm bg-[#1B4332]/10 hover:bg-[#1B4332]/20 text-[#1B4332] border border-[#1B4332]/20 transition-colors"
              title="Download My Resume"
            >
              <Download className="w-3.5 h-3.5 text-[#1B4332]" />
              <span className="hidden sm:inline">Resume</span>
            </a>
          )}

          {/* Photo Vault & Backup button for Jacob to verify, download, and manage all pictures */}
          <button
            id="nav-photo-vault-btn"
            onClick={onOpenPhotoVault || onOpenCustomize}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm border border-[#1B4332]/30 bg-[#FAF6EF] hover:bg-[#EBE2D2] text-[#1B4332] transition-colors shadow-2xs cursor-pointer"
            title="View saved pictures, download photo backup, or export image files"
          >
            <Camera className="w-3.5 h-3.5 text-[#1B4332]" />
            <span className="hidden lg:inline">Photo Vault</span>
            <span className="lg:hidden hidden sm:inline">Photos</span>
          </button>

          {/* Quick Photo & Data Manager for Jacob to upload real photos and text */}
          <button
            id="nav-manage-photos-btn"
            onClick={onOpenCustomize}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-sm border border-[#1B4332]/30 bg-[#FAF6EF] hover:bg-[#EBE2D2] text-[#1B4332] transition-colors shadow-2xs cursor-pointer"
            title="Upload your real photos and custom descriptions"
          >
            <Sliders className="w-3.5 h-3.5 text-[#1B4332]" />
            <span className="hidden md:inline">Manage All Data</span>
            <span className="md:hidden">Data</span>
          </button>

          {/* Direct smooth scroll to Contact form */}
          <a
            id="nav-contact-btn"
            href="#contact"
            onClick={handleContactClick}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm bg-[#1B4332] text-[#F4EFE6] hover:bg-[#2D6A4F] transition-colors shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#D5DFD8]" />
            <span>Get in Touch</span>
          </a>
        </div>

      </div>
    </header>
  );
};
