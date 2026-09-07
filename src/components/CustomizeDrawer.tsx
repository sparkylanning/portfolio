import React, { useState, useEffect, useRef } from 'react';
import { ProfileData, CareerItem, ProjectItem, PersonalItem } from '../types';
import { ImageUploadField } from './ImageUploadField';
import { ResumeUploadField } from './ResumeUploadField';
import { 
  X, 
  Save, 
  RotateCcw, 
  Sliders, 
  User, 
  Briefcase, 
  FolderGit2, 
  Heart,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Camera,
  Download,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  HardDrive,
  FileJson
} from 'lucide-react';
import { 
  exportPortfolioBackup, 
  downloadImage, 
  downloadAllPortfolioImages, 
  parseBackupFile, 
  PortfolioBackupData 
} from '../utils/backup';
import { isUserUploadedImage, getSyncImageVault } from '../utils/storage';

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  careerItems: CareerItem[];
  projectItems: ProjectItem[];
  personalItems: PersonalItem[];
  initialTab?: 'career' | 'projects' | 'personal' | 'profile' | 'photos';
  onSaveProfile: (profile: ProfileData) => void;
  onSaveCareerItems: (items: CareerItem[]) => void;
  onSaveProjectItems: (items: ProjectItem[]) => void;
  onSavePersonalItems: (items: PersonalItem[]) => void;
  onRestoreBackup?: (backup: PortfolioBackupData) => void;
  onResetDefaults: () => void;
}

export const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  careerItems,
  projectItems,
  personalItems,
  initialTab = 'career',
  onSaveProfile,
  onSaveCareerItems,
  onSaveProjectItems,
  onSavePersonalItems,
  onRestoreBackup,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'career' | 'projects' | 'personal' | 'profile' | 'photos'>(initialTab);
  
  // Local state copy for instant editing
  const [profileForm, setProfileForm] = useState<ProfileData>(profile);
  const [careerList, setCareerList] = useState<CareerItem[]>(careerItems);
  const [projectList, setProjectList] = useState<ProjectItem[]>(projectItems);
  const [personalList, setPersonalList] = useState<PersonalItem[]>(personalItems);

  // Backup & export statuses
  const [copiedCode, setCopiedCode] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileImportInputRef = useRef<HTMLInputElement>(null);

  // Expanded items state in editor
  const [expandedCareerId, setExpandedCareerId] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    setCareerList(careerItems);
  }, [careerItems]);

  useEffect(() => {
    setProjectList(projectItems);
  }, [projectItems]);

  useEffect(() => {
    setPersonalList(personalItems);
  }, [personalItems]);

  if (!isOpen) return null;

  // Profile handlers
  const handleProfileFieldChange = (key: keyof ProfileData, value: string) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  // Career handlers
  const handleCareerChange = (id: string, field: keyof CareerItem, value: any) => {
    setCareerList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddCareer = () => {
    const newId = `career-${Date.now()}`;
    const newItem: CareerItem = {
      id: newId,
      role: 'New Role / Internship',
      company: 'Organization Name',
      period: '2026 - Present',
      location: 'Grand Rapids, MI',
      tagline: 'Summary of operational responsibility.',
      description: 'Detailed description of your day-to-day responsibilities, initiatives, and methodologies.',
      achievements: [
        'Key quantifiable operational outcome or achievement.',
        'Documented new SOPs or built analytical templates.'
      ],
      skills: ['Operations', 'Data Analytics', 'Excel'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
      featuredQuote: 'Dedicated to operational excellence and tangible value.'
    };
    setCareerList((prev) => [newItem, ...prev]);
    setExpandedCareerId(newId);
  };

  const handleDeleteCareer = (id: string) => {
    setCareerList((prev) => prev.filter((item) => item.id !== id));
  };

  // Project handlers
  const handleProjectChange = (id: string, field: keyof ProjectItem, value: any) => {
    setProjectList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddProject = () => {
    const newId = `project-${Date.now()}`;
    const newItem: ProjectItem = {
      id: newId,
      title: 'New Project Title',
      category: 'Business Analytics',
      organization: 'HexArmor / Calvin University',
      period: '2026',
      tagline: 'Brief punchy project summary.',
      description: 'In-depth breakdown of the business challenge, the analytical modeling undertaken, and the tangible operational outcome.',
      keyOutcomes: [
        'Built dynamic analytical model / dashboard',
        'Standardized operational scoring metrics',
        'Delivered measurable cost savings or time reduction'
      ],
      toolsUsed: ['Excel', 'Tableau', 'Operations Strategy'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85'
    };
    setProjectList((prev) => [newItem, ...prev]);
    setExpandedProjectId(newId);
  };

  const handleDeleteProject = (id: string) => {
    setProjectList((prev) => prev.filter((item) => item.id !== id));
  };

  // Personal handlers
  const handlePersonalChange = (id: string, field: keyof PersonalItem, value: any) => {
    setPersonalList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Save all changes
  const handleSaveAll = () => {
    // Synchronously write direct keys to localStorage for maximum persistence safety
    if (profileForm.avatarImage && isUserUploadedImage(profileForm.avatarImage)) {
      try {
        localStorage.setItem('jacob_avatar_img', profileForm.avatarImage);
        localStorage.setItem('jacob_img_avatarImage', profileForm.avatarImage);
      } catch (e) {
        console.warn('Avatar direct key save error:', e);
      }
    }
    careerList.forEach((item) => {
      if (item.image && isUserUploadedImage(item.image)) {
        try {
          localStorage.setItem(`jacob_img_${item.id}`, item.image);
        } catch (e) {
          console.warn('Career image direct key error:', e);
        }
      }
    });
    projectList.forEach((item) => {
      if (item.image && isUserUploadedImage(item.image)) {
        try {
          localStorage.setItem(`jacob_img_${item.id}`, item.image);
        } catch (e) {
          console.warn('Project image direct key error:', e);
        }
      }
    });
    personalList.forEach((item) => {
      if (item.image && isUserUploadedImage(item.image)) {
        try {
          localStorage.setItem(`jacob_img_${item.id}`, item.image);
        } catch (e) {
          console.warn('Personal image direct key error:', e);
        }
      }
    });

    onSaveProfile(profileForm);
    onSaveCareerItems(careerList);
    onSaveProjectItems(projectList);
    onSavePersonalItems(personalList);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl h-full bg-[#FAF6EF] border-l border-[#1B4332]/25 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#F4EFE6] border-b border-[#1B4332]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-[#1B4332] shrink-0" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#1B4332]">
                Portfolio Editor & Content Manager
              </h3>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-800 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                <span>Permanent Image Vault active: uploaded photos are preserved across site iterations</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-sm hover:bg-[#1B4332]/10 text-[#18221B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#1B4332]/15 bg-[#F4EFE6] text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#4F6355] overflow-x-auto">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 min-w-[115px] py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'border-[#1B4332] text-[#1B4332] bg-[#FAF6EF]'
                : 'border-transparent hover:text-[#18221B]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#1B4332]" />
            <span>Photo Vault</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`flex-1 min-w-[95px] py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'career'
                ? 'border-[#1B4332] text-[#1B4332] bg-[#FAF6EF]'
                : 'border-transparent hover:text-[#18221B]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career ({careerList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex-1 min-w-[95px] py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'border-[#1B4332] text-[#1B4332] bg-[#FAF6EF]'
                : 'border-transparent hover:text-[#18221B]'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects ({projectList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex-1 min-w-[85px] py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'personal'
                ? 'border-[#1B4332] text-[#1B4332] bg-[#FAF6EF]'
                : 'border-transparent hover:text-[#18221B]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Personal</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 min-w-[80px] py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#1B4332] text-[#1B4332] bg-[#FAF6EF]'
                : 'border-transparent hover:text-[#18221B]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Bio</span>
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs text-[#18221B]">
          
          {/* TAB 1: CAREER PATH */}
          {activeTab === 'career' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[#3E4A40] text-xs leading-relaxed">
                  Manage Career milestones, roles, images, and descriptions.
                </p>
                <button
                  onClick={handleAddCareer}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#1B4332] text-[#F4EFE6] text-[11px] font-bold uppercase tracking-wider hover:bg-[#2D6A4F] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {careerList.map((item) => {
                const isExpanded = expandedCareerId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="p-3.5 bg-[#F4EFE6] rounded-sm border border-[#1B4332]/20 space-y-3 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => setExpandedCareerId(isExpanded ? null : item.id)}
                      >
                        <img 
                          src={item.image} 
                          alt={item.role} 
                          className="w-10 h-10 object-cover rounded-sm border border-[#1B4332]/25 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#18221B] text-xs truncate">
                            {item.role}
                          </div>
                          <div className="text-[11px] text-[#4F6355] truncate">
                            {item.company} • {item.period}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setExpandedCareerId(isExpanded ? null : item.id)}
                          className="p-1 rounded-sm text-[#4F6355] hover:text-[#18221B] hover:bg-[#FAF6EF] transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCareer(item.id)}
                          className="p-1 rounded-sm text-[#4F6355] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image Upload for this role */}
                    <ImageUploadField
                      label={`Photo for ${item.company}`}
                      value={item.image}
                      onChange={(newUrl) => handleCareerChange(item.id, 'image', newUrl)}
                      aspectRatioHint="16:9 or 4:3 work best"
                    />

                    {/* Full details when expanded */}
                    {isExpanded && (
                      <div className="space-y-2.5 pt-2 border-t border-[#1B4332]/15">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Role Title</label>
                            <input
                              type="text"
                              value={item.role}
                              onChange={(e) => handleCareerChange(item.id, 'role', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Company</label>
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => handleCareerChange(item.id, 'company', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Time Period</label>
                            <input
                              type="text"
                              value={item.period}
                              onChange={(e) => handleCareerChange(item.id, 'period', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Location</label>
                            <input
                              type="text"
                              value={item.location}
                              onChange={(e) => handleCareerChange(item.id, 'location', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Tagline / Headline</label>
                          <input
                            type="text"
                            value={item.tagline}
                            onChange={(e) => handleCareerChange(item.id, 'tagline', e.target.value)}
                            className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Overview Description</label>
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={(e) => handleCareerChange(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">
                            Key Skills (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={item.skills.join(', ')}
                            onChange={(e) =>
                              handleCareerChange(
                                item.id,
                                'skills',
                                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[#3E4A40] text-xs leading-relaxed">
                  Add or edit projects. 120 Main is organized under Career.
                </p>
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-[#1B4332] text-[#F4EFE6] text-[11px] font-bold uppercase tracking-wider hover:bg-[#2D6A4F] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {projectList.map((item) => {
                const isExpanded = expandedProjectId === item.id;
                return (
                  <div 
                    key={item.id} 
                    className="p-3.5 bg-[#F4EFE6] rounded-sm border border-[#1B4332]/20 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => setExpandedProjectId(isExpanded ? null : item.id)}
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-10 h-10 object-cover rounded-sm border border-[#1B4332]/25 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-[#18221B] text-xs truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#4F6355] truncate">
                            {item.organization} • {item.period}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setExpandedProjectId(isExpanded ? null : item.id)}
                          className="p-1 rounded-sm text-[#4F6355] hover:text-[#18221B] hover:bg-[#FAF6EF] transition-colors cursor-pointer"
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(item.id)}
                          className="p-1 rounded-sm text-[#4F6355] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image Upload for this project */}
                    <ImageUploadField
                      label={`Image for ${item.title}`}
                      value={item.image}
                      onChange={(newUrl) => handleProjectChange(item.id, 'image', newUrl)}
                      aspectRatioHint="16:9 widescreen recommended"
                    />

                    {/* Full details when expanded */}
                    {isExpanded && (
                      <div className="space-y-2.5 pt-2 border-t border-[#1B4332]/15">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Project Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleProjectChange(item.id, 'title', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Category</label>
                            <input
                              type="text"
                              value={item.category}
                              onChange={(e) => handleProjectChange(item.id, 'category', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Organization</label>
                            <input
                              type="text"
                              value={item.organization}
                              onChange={(e) => handleProjectChange(item.id, 'organization', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Year / Period</label>
                            <input
                              type="text"
                              value={item.period}
                              onChange={(e) => handleProjectChange(item.id, 'period', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Tagline / Short Hook</label>
                          <input
                            type="text"
                            value={item.tagline}
                            onChange={(e) => handleProjectChange(item.id, 'tagline', e.target.value)}
                            className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Description</label>
                          <textarea
                            rows={3}
                            value={item.description}
                            onChange={(e) => handleProjectChange(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">
                            Tools Used (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={item.toolsUsed.join(', ')}
                            onChange={(e) =>
                              handleProjectChange(
                                item.id,
                                'toolsUsed',
                                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: PERSONAL */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <p className="text-[#3E4A40] text-xs leading-relaxed">
                Update stories and photos for your Personal passions (Disc Golf, Bible Study, Outdoors, Youth Ministry).
              </p>

              {personalList.map((item) => (
                <div key={item.id} className="p-3.5 bg-[#F4EFE6] rounded-sm border border-[#1B4332]/20 space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-12 h-12 object-cover rounded-sm border border-[#1B4332]/25 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div>
                      <div className="font-bold text-[#18221B] text-xs">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[#4F6355]">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <ImageUploadField
                    label={`Photo for ${item.title}`}
                    value={item.image}
                    onChange={(newUrl) => handlePersonalChange(item.id, 'image', newUrl)}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handlePersonalChange(item.id, 'title', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handlePersonalChange(item.id, 'category', e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Subtitle</label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => handlePersonalChange(item.id, 'subtitle', e.target.value)}
                      className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Tags (comma separated, no hashtags)</label>
                    <input
                      type="text"
                      value={item.tags.map(t => t.replace(/^#/, '')).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(',')
                          .map(t => t.trim().replace(/^#/, ''))
                          .filter(Boolean);
                        handlePersonalChange(item.id, 'tags', tags);
                      }}
                      className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1B4332] mb-0.5">Story Narrative</label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => handlePersonalChange(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:border-[#1B4332]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BIO & RESUME */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <p className="text-[#3E4A40] text-xs leading-relaxed">
                Update your headshot, headline, bio narrative, and attach your resume PDF.
              </p>

              {/* Headshot Upload */}
              <div className="p-3.5 bg-[#F4EFE6] rounded-sm border border-[#1B4332]/20">
                <ImageUploadField
                  label="Profile Headshot Photo"
                  value={profileForm.avatarImage}
                  onChange={(newUrl) => handleProfileFieldChange('avatarImage', newUrl)}
                  aspectRatioHint="Portrait 3:4 recommended"
                />
              </div>

              {/* Resume PDF Upload */}
              <div className="p-3.5 bg-[#F4EFE6] rounded-sm border border-[#1B4332]/20">
                <ResumeUploadField
                  resumeUrl={profileForm.resumeUrl}
                  resumeName={profileForm.resumeName}
                  onChange={(url, name) => {
                    handleProfileFieldChange('resumeUrl', url);
                    if (name) handleProfileFieldChange('resumeName', name);
                  }}
                />
              </div>

              {/* Identity & Hero Texts */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                    Display First Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => handleProfileFieldChange('firstName', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                    Role Noun (e.g. analyst.)
                  </label>
                  <input
                    type="text"
                    value={profileForm.roleNoun}
                    onChange={(e) => handleProfileFieldChange('roleNoun', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  Hero Statement / Tagline
                </label>
                <textarea
                  rows={2}
                  value={profileForm.tagline}
                  onChange={(e) => handleProfileFieldChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332] resize-none"
                />
              </div>

              {/* About Section Headline */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  About Section Headline
                </label>
                <input
                  type="text"
                  value={profileForm.aboutHeadline || 'Taking raw data to actionable insight, and real change.'}
                  onChange={(e) => handleProfileFieldChange('aboutHeadline', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  Bio Narrative (Starts with "Hey, I'm Jacob...")
                </label>
                <textarea
                  rows={4}
                  value={profileForm.shortBio}
                  onChange={(e) => handleProfileFieldChange('shortBio', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332] resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  Location
                </label>
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => handleProfileFieldChange('location', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                />
              </div>

              {/* Academic Details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                    University
                  </label>
                  <input
                    type="text"
                    value={profileForm.university}
                    onChange={(e) => handleProfileFieldChange('university', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={profileForm.graduationYear}
                    onChange={(e) => handleProfileFieldChange('graduationYear', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  Degree Title
                </label>
                <input
                  type="text"
                  value={profileForm.degree}
                  onChange={(e) => handleProfileFieldChange('degree', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  value={profileForm.linkedinUrl}
                  onChange={(e) => handleProfileFieldChange('linkedinUrl', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                />
              </div>

              {/* Direct Email Address */}
              <div className="pt-2 border-t border-[#1B4332]/15">
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  Contact & Inquiries Email
                </label>
                <input
                  type="email"
                  value={profileForm.email || 'Sparkylanning@gmail.com'}
                  onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                  placeholder="Sparkylanning@gmail.com"
                  className="w-full px-2.5 py-1.5 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                />
                <p className="text-[10px] text-[#4F6355] mt-1">
                  Recipient for contact form messages, Gmail compose links, and direct inquiries.
                </p>
              </div>

              {/* Optional Formspree Endpoint */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  Formspree / Webhook Endpoint (Optional)
                </label>
                <input
                  type="text"
                  value={profileForm.formEndpoint || ''}
                  onChange={(e) => handleProfileFieldChange('formEndpoint', e.target.value)}
                  placeholder="e.g. https://formspree.io/f/xyzabcde"
                  className="w-full px-2.5 py-1.5 text-xs rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                />
                <p className="text-[10px] text-[#4F6355] mt-1 leading-normal">
                  Want background email delivery without launching the visitor&apos;s mail app? Sign up free at <a href="https://formspree.io" target="_blank" rel="noreferrer" className="underline font-bold text-[#1B4332]">formspree.io</a>, create a form, and paste the URL here.
                </p>
              </div>

              {/* Approach Pillars */}
              <div className="pt-2 border-t border-[#1B4332]/15 space-y-3">
                <label className="block font-bold uppercase tracking-[0.2em] text-[10px] text-[#1B4332]">
                  3 Core Approach Pillars
                </label>
                {(profileForm.approachPillars || [
                  { id: 'pillar-1', title: 'Making Sense of Numbers', description: 'Building simple, practical tools that take the stress and guesswork out of big decisions.' },
                  { id: 'pillar-2', title: 'Clear Steps for Teams', description: 'Writing down clear, friendly guides so everyone stays on the same page and work flows smoothly.' },
                  { id: 'pillar-3', title: 'Caring About Details', description: 'Catching the small discrepancies in logistics schedules, ledgers, and data pipelines to keep operations running right.' }
                ]).map((pillar, pIdx) => (
                  <div key={pillar.id || pIdx} className="p-2.5 rounded-sm bg-[#FAF6EF] border border-[#1B4332]/20 space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-[#1B4332]">Pillar {pIdx + 1} Title</label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => {
                          const currentPillars = profileForm.approachPillars || [
                            { id: 'pillar-1', title: 'Making Sense of Numbers', description: 'Building simple, practical tools that take the stress and guesswork out of big decisions.' },
                            { id: 'pillar-2', title: 'Clear Steps for Teams', description: 'Writing down clear, friendly guides so everyone stays on the same page and work flows smoothly.' },
                            { id: 'pillar-3', title: 'Caring About Details', description: 'Catching the small discrepancies in logistics schedules, ledgers, and data pipelines to keep operations running right.' }
                          ];
                          const updated = currentPillars.map((p, i) => i === pIdx ? { ...p, title: e.target.value } : p);
                          handleProfileFieldChange('approachPillars', updated);
                        }}
                        className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-[#1B4332]">Description</label>
                      <textarea
                        rows={2}
                        value={pillar.description}
                        onChange={(e) => {
                          const currentPillars = profileForm.approachPillars || [
                            { id: 'pillar-1', title: 'Making Sense of Numbers', description: 'Building simple, practical tools that take the stress and guesswork out of big decisions.' },
                            { id: 'pillar-2', title: 'Clear Steps for Teams', description: 'Writing down clear, friendly guides so everyone stays on the same page and work flows smoothly.' },
                            { id: 'pillar-3', title: 'Caring About Details', description: 'Catching the small discrepancies in logistics schedules, ledgers, and data pipelines to keep operations running right.' }
                          ];
                          const updated = currentPillars.map((p, i) => i === pIdx ? { ...p, description: e.target.value } : p);
                          handleProfileFieldChange('approachPillars', updated);
                        }}
                        className="w-full px-2 py-1 text-[11px] rounded-sm bg-[#F4EFE6] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PHOTO VAULT & BACKUP */}
          {activeTab === 'photos' && (() => {
            const allPortfolioPhotos = [
              {
                id: 'avatarImage',
                label: 'Headshot / Profile Avatar',
                category: 'profile' as const,
                url: profileForm.avatarImage,
                onUpdate: (url: string) => handleProfileFieldChange('avatarImage', url)
              },
              ...careerList.map((item) => ({
                id: item.id,
                label: `${item.role} • ${item.company}`,
                category: 'career' as const,
                url: item.image,
                onUpdate: (url: string) => handleCareerChange(item.id, 'image', url)
              })),
              ...projectList.map((proj) => ({
                id: proj.id,
                label: proj.title,
                category: 'project' as const,
                url: proj.image,
                onUpdate: (url: string) => handleProjectChange(proj.id, 'image', url)
              })),
              ...personalList.map((pers) => ({
                id: pers.id,
                label: pers.title,
                category: 'personal' as const,
                url: pers.image,
                onUpdate: (url: string) => handlePersonalChange(pers.id, 'image', url)
              }))
            ];

            const customCount = allPortfolioPhotos.filter((p) => isUserUploadedImage(p.url)).length;

            const handleExportJson = () => {
              exportPortfolioBackup(profileForm, careerList, projectList, personalList);
            };

            const handleDownloadAllImages = () => {
              downloadAllPortfolioImages(allPortfolioPhotos.map((p) => ({ name: p.label, url: p.url })));
            };

            const handleCopyImageData = () => {
              const vault = getSyncImageVault();
              const summary = {
                avatar: profileForm.avatarImage,
                careerImages: careerList.map((c) => ({ id: c.id, company: c.company, image: c.image })),
                projectImages: projectList.map((p) => ({ id: p.id, title: p.title, image: p.image })),
                personalImages: personalList.map((p) => ({ id: p.id, title: p.title, image: p.image })),
                vault
              };
              navigator.clipboard.writeText(JSON.stringify(summary, null, 2));
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2500);
            };

            const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const data = await parseBackupFile(file);
                if (data.profile) setProfileForm(data.profile);
                if (data.careerItems) setCareerList(data.careerItems);
                if (data.projects) setProjectList(data.projects);
                if (data.personalItems) setPersonalList(data.personalItems);
                if (onRestoreBackup) onRestoreBackup(data);
                setImportNotice(`Successfully restored portfolio backup with ${Object.keys(data.imageVault || {}).length} vault images!`);
                setTimeout(() => setImportNotice(null), 5000);
              } catch (err: any) {
                setImportNotice(err?.message || 'Failed to restore backup file');
                setTimeout(() => setImportNotice(null), 5000);
              } finally {
                if (fileImportInputRef.current) fileImportInputRef.current.value = '';
              }
            };

            return (
              <div className="space-y-5">
                {/* Vault Status Card */}
                <div className="p-4 rounded-md bg-[#FAF6EF] border border-[#1B4332]/25 shadow-xs space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-2">
                        <span>Permanent Photo Vault Active</span>
                        <span className="px-1.5 py-0.5 rounded-xs bg-emerald-800 text-white text-[9px] font-semibold">
                          Saved
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#3E4A40] leading-relaxed">
                        Every picture you upload is stored in your browser's persistent database (IndexedDB & localStorage). Your photos stay preserved through page refreshes, restarts, and code updates.
                      </p>
                    </div>
                  </div>

                  {/* Badges / Stats */}
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-[#1B4332]/10 text-[10px]">
                    <span className="px-2.5 py-1 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/20 text-[#1B4332] font-semibold">
                      {allPortfolioPhotos.length} Total Pictures Tracked
                    </span>
                    <span className="px-2.5 py-1 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold">
                      {customCount} Custom Uploaded {customCount === 1 ? 'Photo' : 'Photos'}
                    </span>
                  </div>
                </div>

                {/* Import Notice */}
                {importNotice && (
                  <div className="p-3 rounded-sm bg-emerald-50 border border-emerald-400 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{importNotice}</span>
                  </div>
                )}

                {/* One-Click Backup & Download Actions */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332]">
                    Download & Save to Your Computer
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="flex items-center justify-center gap-2 p-3 rounded-sm bg-[#1B4332] hover:bg-[#2D6A4F] text-[#FAF6EF] font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs cursor-pointer text-center"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>Download Backup (.json)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadAllImages}
                      className="flex items-center justify-center gap-2 p-3 rounded-sm bg-[#FAF6EF] hover:bg-[#EBE2D2] text-[#1B4332] border border-[#1B4332]/35 font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs cursor-pointer text-center"
                    >
                      <HardDrive className="w-4 h-4 shrink-0 text-[#1B4332]" />
                      <span>Download All Image Files</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileImportInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-sm bg-[#FAF6EF] hover:bg-[#EBE2D2] text-[#18221B] border border-[#1B4332]/25 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Restore from Backup (.json)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyImageData}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-sm bg-[#FAF6EF] hover:bg-[#EBE2D2] text-[#18221B] border border-[#1B4332]/25 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span className="text-emerald-800 font-bold">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#1B4332]" />
                          <span>Copy Photo Data</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hidden File Input for Backup Restore */}
                  <input
                    ref={fileImportInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="sr-only"
                    onChange={handleImportFile}
                  />
                </div>

                {/* Picture Inventory */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B4332]">
                      All Portfolio Pictures ({allPortfolioPhotos.length})
                    </span>
                    <span className="text-[10px] text-[#4F6355]">
                      Click "Save Changes" below to apply
                    </span>
                  </div>

                  <div className="space-y-3">
                    {allPortfolioPhotos.map((photo) => {
                      const isCustom = isUserUploadedImage(photo.url);
                      return (
                        <div
                          key={photo.id}
                          className="p-3 rounded-sm bg-[#FAF6EF] border border-[#1B4332]/20 space-y-2.5 hover:border-[#1B4332]/40 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {/* Photo Thumbnail */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xs overflow-hidden bg-black/5 shrink-0 border border-[#1B4332]/20">
                              <img
                                src={photo.url}
                                alt={photo.label}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info & Badges */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <h5 className="text-xs font-bold text-[#18221B] truncate">
                                  {photo.label}
                                </h5>
                                {isCustom ? (
                                  <span className="px-1.5 py-0.5 rounded-xs bg-emerald-800 text-[#FAF6EF] text-[9px] font-bold tracking-wide uppercase shrink-0">
                                    Saved in Vault
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded-xs bg-[#EBE2D2] text-[#4F6355] text-[9px] font-semibold tracking-wide uppercase shrink-0">
                                    Template Image
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[#4F6355] capitalize">
                                Category: {photo.category}
                              </p>

                              {/* Single Download button */}
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => downloadImage(photo.url, photo.label)}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1B4332] hover:text-[#2D6A4F] hover:underline cursor-pointer"
                                >
                                  <Download className="w-3 h-3" />
                                  <span>Download Image File</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Quick Photo Upload / Replace */}
                          <div className="pt-1 border-t border-[#1B4332]/10">
                            <ImageUploadField
                              label={`Replace ${photo.label}`}
                              value={photo.url}
                              onChange={photo.onUpdate}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })()}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-[#F4EFE6] border-t border-[#1B4332]/20 flex items-center justify-between gap-3">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#4F6355] hover:text-[#1B4332] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm border border-[#1B4332]/30 hover:bg-[#FAF6EF] text-[#18221B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-customizer-btn"
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-sm bg-[#1B4332] text-[#F4EFE6] hover:bg-[#2D6A4F] shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
