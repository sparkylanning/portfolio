/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  initialProfileData, 
  initialCareerItems, 
  initialProjects, 
  initialPersonalItems 
} from './data/portfolioData';
import { CareerItem, ProjectItem, PersonalItem, ProfileData } from './types';
import { 
  setPersistentItem, 
  getPersistentItem, 
  getInitialSyncItemWithFallback, 
  clearAllPersistentItems,
  recordUploadedImage,
  scanAndRecoverAllImages,
  loadPersistentStateWithFallback,
  applyImageVaultToState,
  getSyncImageVault,
  persistImageVault,
  isUserUploadedImage
} from './utils/storage';
import { PortfolioBackupData } from './utils/backup';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { CareerHorizontalSection } from './components/CareerHorizontalSection';
import { ProjectsHorizontalSection } from './components/ProjectsHorizontalSection';
import { SkillsBubbles } from './components/SkillsBubbles';
import { PersonalSection } from './components/PersonalSection';
import { ContactSection } from './components/ContactSection';
import { CareerModal } from './components/CareerModal';
import { ProjectModal } from './components/ProjectModal';
import { CustomizeDrawer } from './components/CustomizeDrawer';
import { Camera, X } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'jacob_portfolio_profile';
const FALLBACK_PROFILE_KEYS = [
  'jacob_portfolio_profile_v8',
  'jacob_portfolio_profile_v7',
  'jacob_portfolio_profile_v6',
  'jacob_portfolio_profile_v5',
  'jacob_portfolio_profile_v4',
  'jacob_portfolio_profile_v3',
  'jacob_portfolio_profile_v2',
  'jacob_portfolio_profile_v1'
];

const CAREER_STORAGE_KEY = 'jacob_portfolio_career';
const FALLBACK_CAREER_KEYS = [
  'jacob_portfolio_career_v8',
  'jacob_portfolio_career_v7',
  'jacob_portfolio_career_v6',
  'jacob_portfolio_career_v5',
  'jacob_portfolio_career_v4',
  'jacob_portfolio_career_v3',
  'jacob_portfolio_career_v2',
  'jacob_portfolio_career_v1'
];

const PROJECTS_STORAGE_KEY = 'jacob_portfolio_projects';
const FALLBACK_PROJECTS_KEYS = [
  'jacob_portfolio_projects_v8',
  'jacob_portfolio_projects_v7',
  'jacob_portfolio_projects_v6',
  'jacob_portfolio_projects_v5',
  'jacob_portfolio_projects_v4',
  'jacob_portfolio_projects_v3',
  'jacob_portfolio_projects_v2',
  'jacob_portfolio_projects_v1'
];

const PERSONAL_STORAGE_KEY = 'jacob_portfolio_personal';
const FALLBACK_PERSONAL_KEYS = [
  'jacob_portfolio_personal_v8',
  'jacob_portfolio_personal_v7',
  'jacob_portfolio_personal_v6',
  'jacob_portfolio_personal_v5',
  'jacob_portfolio_personal_v4',
  'jacob_portfolio_personal_v3',
  'jacob_portfolio_personal_v2',
  'jacob_portfolio_personal_v1'
];

export default function App() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const loaded = getInitialSyncItemWithFallback(PROFILE_STORAGE_KEY, FALLBACK_PROFILE_KEYS, initialProfileData);
    const syncVault = getSyncImageVault();
    const directAvatar = typeof window !== 'undefined' ? localStorage.getItem('jacob_avatar_img') : null;
    const avatar = directAvatar || syncVault['avatarImage'] || syncVault['avatar'] || syncVault['profile:avatarImage'];
    if (avatar && isUserUploadedImage(avatar)) {
      return { ...loaded, avatarImage: avatar };
    }
    return loaded;
  });

  const [careerItems, setCareerItems] = useState<CareerItem[]>(() => {
    const loaded = getInitialSyncItemWithFallback(CAREER_STORAGE_KEY, FALLBACK_CAREER_KEYS, initialCareerItems);
    const cleaned = loaded.filter(
      (item) => item.id !== 'crystal-flash-tank-maintenance' && !item.tagline?.toLowerCase().includes('propane')
    );
    const syncVault = getSyncImageVault();
    return cleaned.map((item, idx) => {
      const directImg = typeof window !== 'undefined' ? localStorage.getItem(`jacob_img_${item.id}`) : null;
      const candidate = directImg || syncVault[`career:${item.id}`] || syncVault[item.id] || syncVault[`career:index:${idx}`];
      if (candidate && isUserUploadedImage(candidate)) {
        return { ...item, image: candidate };
      }
      return item;
    });
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const loaded = getInitialSyncItemWithFallback(PROJECTS_STORAGE_KEY, FALLBACK_PROJECTS_KEYS, initialProjects);
    const updated = loaded.map((item) => {
      if (item.id === 'proj-exosuit-ergonomics') {
        const replacement = initialProjects.find((p) => p.id === 'proj-sop-process-optimization') || item;
        return replacement;
      }
      if (item.id === 'proj-freight-po-audit') {
        const fresh = initialProjects.find((p) => p.id === 'proj-freight-po-audit');
        return fresh ? { ...fresh, image: item.image || fresh.image } : item;
      }
      return item;
    });
    const syncVault = getSyncImageVault();
    return updated.map((item, idx) => {
      const directImg = typeof window !== 'undefined' ? localStorage.getItem(`jacob_img_${item.id}`) : null;
      const candidate = directImg || syncVault[`project:${item.id}`] || syncVault[item.id] || syncVault[`project:index:${idx}`];
      if (candidate && isUserUploadedImage(candidate)) {
        return { ...item, image: candidate };
      }
      return item;
    });
  });

  const [personalItems, setPersonalItems] = useState<PersonalItem[]>(() => {
    const loaded = getInitialSyncItemWithFallback(PERSONAL_STORAGE_KEY, FALLBACK_PERSONAL_KEYS, initialPersonalItems);
    const cleaned = loaded.filter(
      (item) => item.id !== 'personal-outdoors' && item.id !== 'personal-volunteer-worship'
    );
    const syncVault = getSyncImageVault();
    return cleaned.map((item, idx) => {
      const directImg = typeof window !== 'undefined' ? localStorage.getItem(`jacob_img_${item.id}`) : null;
      const candidate = directImg || syncVault[`personal:${item.id}`] || syncVault[item.id] || syncVault[`personal:index:${idx}`];
      if (candidate && isUserUploadedImage(candidate)) {
        return { ...item, image: candidate };
      }
      return item;
    });
  });

  const [restoredPhotoCount, setRestoredPhotoCount] = useState<number>(0);
  const [showRestoredNotice, setShowRestoredNotice] = useState<boolean>(false);

  // Asynchronously hydrate from IndexedDB to load high-resolution uploaded images & legacy records
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      try {
        // Step 1: Scan ALL IndexedDB records & legacy version keys across the browser to retrieve all user images
        const deepVault = await scanAndRecoverAllImages();

        // Ensure any photo from legacy exosuit project is forwarded to the SOP optimization project
        if (deepVault['proj-exosuit-ergonomics']) {
          deepVault['proj-sop-process-optimization'] = deepVault['proj-sop-process-optimization'] || deepVault['proj-exosuit-ergonomics'];
          deepVault['project:proj-sop-process-optimization'] = deepVault['project:proj-sop-process-optimization'] || deepVault['proj-exosuit-ergonomics'];
        }

        // Step 2: Load state using fallback migration chain
        const [savedProfile, savedCareer, savedProjects, savedPersonal] = await Promise.all([
          loadPersistentStateWithFallback(PROFILE_STORAGE_KEY, FALLBACK_PROFILE_KEYS, initialProfileData),
          loadPersistentStateWithFallback(CAREER_STORAGE_KEY, FALLBACK_CAREER_KEYS, initialCareerItems),
          loadPersistentStateWithFallback(PROJECTS_STORAGE_KEY, FALLBACK_PROJECTS_KEYS, initialProjects),
          loadPersistentStateWithFallback(PERSONAL_STORAGE_KEY, FALLBACK_PERSONAL_KEYS, initialPersonalItems),
        ]);

        // Remove deprecated propane tank item if present in old stored state
        const cleanedCareer = savedCareer.filter(
          (item) => item.id !== 'crystal-flash-tank-maintenance' && !item.tagline?.toLowerCase().includes('propane')
        );

        // Migrate deprecated exosuit project to SOP optimization while preserving any uploaded image
        const cleanedProjects = savedProjects.map((item) => {
          if (item.id === 'proj-exosuit-ergonomics') {
            const replacement = initialProjects.find((p) => p.id === 'proj-sop-process-optimization') || item;
            return {
              ...replacement,
              image: (item.image && isUserUploadedImage(item.image)) ? item.image : replacement.image
            };
          }
          if (item.id === 'proj-freight-po-audit') {
            const fresh = initialProjects.find((p) => p.id === 'proj-freight-po-audit');
            return fresh ? { ...fresh, image: item.image || fresh.image } : item;
          }
          return item;
        });

        const cleanedPersonal = savedPersonal.filter(
          (item) => item.id !== 'personal-outdoors' && item.id !== 'personal-volunteer-worship'
        );

        // Step 3: Apply the Image Vault over all items, ensuring NO user-uploaded photo is ever lost
        const applied = applyImageVaultToState(
          savedProfile,
          cleanedCareer,
          cleanedProjects,
          cleanedPersonal,
          deepVault
        );

        if (!isMounted) return;

        setProfile(applied.profile);
        setCareerItems(applied.careerItems);
        setProjects(applied.projects);
        setPersonalItems(applied.personalItems);

        // Cache into stable keys for future immediate loads
        setPersistentItem(PROFILE_STORAGE_KEY, applied.profile);
        setPersistentItem(CAREER_STORAGE_KEY, applied.careerItems);
        setPersistentItem(PROJECTS_STORAGE_KEY, applied.projects);
        setPersistentItem(PERSONAL_STORAGE_KEY, applied.personalItems);

        if (applied.appliedCount > 0) {
          setRestoredPhotoCount(applied.appliedCount);
          setShowRestoredNotice(true);
          const timer = setTimeout(() => {
            if (isMounted) setShowRestoredNotice(false);
          }, 7000);
          return () => clearTimeout(timer);
        }
      } catch (err) {
        console.warn('Hydration error:', err);
      }
    }

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal and drawer interaction states
  const [selectedCareerItem, setSelectedCareerItem] = useState<CareerItem | null>(null);
  const [selectedProjectItem, setSelectedProjectItem] = useState<ProjectItem | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'career' | 'projects' | 'personal' | 'profile' | 'photos'>('career');
  const [isEditMode, setIsEditMode] = useState(false);

  // Smooth scroll jumps
  const handleExploreCareer = () => {
    const el = document.getElementById('career');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Profile update handler
  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    setPersistentItem(PROFILE_STORAGE_KEY, updatedProfile);
    if (updatedProfile.avatarImage && isUserUploadedImage(updatedProfile.avatarImage)) {
      recordUploadedImage('avatarImage', updatedProfile.avatarImage, 'profile');
    }
  };

  const handleUpdateProfilePartial = (partial: Partial<ProfileData>) => {
    let nextProfile: ProfileData | null = null;
    setProfile((prev) => {
      const updated = { ...prev, ...partial };
      if (partial.firstName && prev.name) {
        const parts = prev.name.split(' ');
        if (parts.length > 1) {
          updated.name = `${partial.firstName} ${parts.slice(1).join(' ')}`;
        }
      }
      nextProfile = updated;
      return updated;
    });

    if (partial.avatarImage && isUserUploadedImage(partial.avatarImage)) {
      try {
        localStorage.setItem('jacob_avatar_img', partial.avatarImage);
        localStorage.setItem('jacob_img_avatarImage', partial.avatarImage);
      } catch (err) {
        console.warn('localStorage avatar write error:', err);
      }
      recordUploadedImage('avatarImage', partial.avatarImage, 'profile');
    }

    if (nextProfile) {
      setPersistentItem(PROFILE_STORAGE_KEY, nextProfile);
    }
  };

  // Save handlers for Career, Projects, and Personal
  const handleSaveCareerItems = (updated: CareerItem[]) => {
    setCareerItems(updated);
    setPersistentItem(CAREER_STORAGE_KEY, updated);
    updated.forEach((item) => {
      if (item.image && isUserUploadedImage(item.image)) {
        recordUploadedImage(item.id, item.image, 'career');
      }
    });
  };

  const handleSaveProjectItems = (updated: ProjectItem[]) => {
    setProjects(updated);
    setPersistentItem(PROJECTS_STORAGE_KEY, updated);
    updated.forEach((proj) => {
      if (proj.image && isUserUploadedImage(proj.image)) {
        recordUploadedImage(proj.id, proj.image, 'project');
      }
    });
  };

  const handleSavePersonalItems = (updated: PersonalItem[]) => {
    setPersonalItems(updated);
    setPersistentItem(PERSONAL_STORAGE_KEY, updated);
    updated.forEach((item) => {
      if (item.image && isUserUploadedImage(item.image)) {
        recordUploadedImage(item.id, item.image, 'personal');
      }
    });
  };

  const handleUpdatePersonalItemPartial = (id: string, updatedFields: Partial<PersonalItem>) => {
    setPersonalItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      setPersistentItem(PERSONAL_STORAGE_KEY, updated);
      if (updatedFields.image && isUserUploadedImage(updatedFields.image)) {
        recordUploadedImage(id, updatedFields.image, 'personal');
      }
      return updated;
    });
  };

  const handleUpdateCareerItemPartial = (id: string, updatedFields: Partial<CareerItem>) => {
    setCareerItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      setPersistentItem(CAREER_STORAGE_KEY, updated);
      if (updatedFields.image && isUserUploadedImage(updatedFields.image)) {
        recordUploadedImage(id, updatedFields.image, 'career');
      }
      return updated;
    });
    setSelectedCareerItem((prev) => (prev && prev.id === id ? { ...prev, ...updatedFields } : prev));
  };

  const handleUpdateProjectItemPartial = (id: string, updatedFields: Partial<ProjectItem>) => {
    setProjects((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item));
      setPersistentItem(PROJECTS_STORAGE_KEY, updated);
      if (updatedFields.image && isUserUploadedImage(updatedFields.image)) {
        recordUploadedImage(id, updatedFields.image, 'project');
      }
      return updated;
    });
    setSelectedProjectItem((prev) => (prev && prev.id === id ? { ...prev, ...updatedFields } : prev));
  };

  // Direct quick-photo updates for modals
  const handleUpdateCareerImage = (itemId: string, newUrl: string) => {
    setCareerItems((prev) => {
      const updated = prev.map((item) => (item.id === itemId ? { ...item, image: newUrl } : item));
      setPersistentItem(CAREER_STORAGE_KEY, updated);
      return updated;
    });
    setSelectedCareerItem((prev) => (prev && prev.id === itemId ? { ...prev, image: newUrl } : prev));
    if (isUserUploadedImage(newUrl)) {
      recordUploadedImage(itemId, newUrl, 'career');
    }
  };

  const handleUpdateProjectImage = (projectId: string, newUrl: string) => {
    setProjects((prev) => {
      const updated = prev.map((item) => (item.id === projectId ? { ...item, image: newUrl } : item));
      setPersistentItem(PROJECTS_STORAGE_KEY, updated);
      return updated;
    });
    setSelectedProjectItem((prev) => (prev && prev.id === projectId ? { ...prev, image: newUrl } : prev));
    if (isUserUploadedImage(newUrl)) {
      recordUploadedImage(projectId, newUrl, 'project');
    }
  };

  // Reset to initial design defaults
  const handleResetDefaults = () => {
    setProfile(initialProfileData);
    setCareerItems(initialCareerItems);
    setProjects(initialProjects);
    setPersonalItems(initialPersonalItems);
    clearAllPersistentItems();
  };

  // Restore portfolio backup
  const handleRestoreBackup = async (backup: PortfolioBackupData) => {
    if (backup.profile) {
      setProfile(backup.profile);
      await setPersistentItem(PROFILE_STORAGE_KEY, backup.profile);
    }
    if (backup.careerItems) {
      setCareerItems(backup.careerItems);
      await setPersistentItem(CAREER_STORAGE_KEY, backup.careerItems);
    }
    if (backup.projects) {
      setProjects(backup.projects);
      await setPersistentItem(PROJECTS_STORAGE_KEY, backup.projects);
    }
    if (backup.personalItems) {
      setPersonalItems(backup.personalItems);
      await setPersistentItem(PERSONAL_STORAGE_KEY, backup.personalItems);
    }
    if (backup.imageVault) {
      await persistImageVault(backup.imageVault);
    }
    const count = Object.keys(backup.imageVault || {}).length || 1;
    setRestoredPhotoCount(count);
    setShowRestoredNotice(true);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#18221B] relative selection:bg-[#1B4332] selection:text-[#F4EFE6]">
      
      {/* Top Header - Clean, No Tabs */}
      <Navbar
        profile={profile}
        onOpenCustomize={() => {
          setDrawerTab('career');
          setIsCustomizeOpen(true);
        }}
        onOpenPhotoVault={() => {
          setDrawerTab('photos');
          setIsCustomizeOpen(true);
        }}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onUpdateProfile={handleUpdateProfilePartial}
      />

      {/* Reassuring Vault Restoration Notification */}
      {showRestoredNotice && (
        <div className="fixed top-20 right-6 z-50 bg-[#1B4332] text-[#FAF6EF] px-4 py-3 rounded-md shadow-2xl border border-white/20 flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-md max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-800/80 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Camera className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">
              {restoredPhotoCount} custom {restoredPhotoCount === 1 ? 'photo' : 'photos'} restored & preserved
            </p>
            <p className="text-[11px] text-emerald-200/90 leading-tight">
              Stored in your permanent Image Vault across all updates.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowRestoredNotice(false)}
            className="p-1 text-white/60 hover:text-white rounded-full hover:bg-white/10 cursor-pointer transition-colors"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Single-Page Scroll Flow */}
      <main className="relative">
        {/* 1. Hero Section */}
        <Hero
          profile={profile}
          onExploreCareerClick={handleExploreCareer}
          onExploreProjectsClick={handleExploreProjects}
          onUpdateProfile={handleUpdateProfilePartial}
          isEditMode={isEditMode}
        />

        {/* 2. About Me: Short summary, academic card (no GPA, no resume), and kinetic skills ticker */}
        <AboutSection
          profile={profile}
          onUpdateProfile={handleUpdateProfilePartial}
          isEditMode={isEditMode}
        />

        {/* 3. Career Path So Far (Horizontal Scroll) */}
        <CareerHorizontalSection
          items={careerItems}
          onSelectItem={(item) => setSelectedCareerItem(item)}
        />

        {/* 4. Featured Projects (Natural Vertical Scroll) */}
        <ProjectsHorizontalSection
          projects={projects}
          onSelectProject={(proj) => setSelectedProjectItem(proj)}
        />

        {/* Dynamic Skills Cloud - Bubbles popping in as user scrolls down */}
        <SkillsBubbles />

        {/* 5. About Me Personally (Disc Golf, Steaks, Coffee, Faith) */}
        <PersonalSection
          items={personalItems}
          onUpdateItem={handleUpdatePersonalItemPartial}
          isEditMode={isEditMode}
        />

        {/* 6. Contact Form (Email hidden) */}
        <ContactSection
          profile={profile}
        />
      </main>

      {/* Floating Active Edit Mode Notification Indicator */}
      {isEditMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1B4332] text-[#F4EFE6] px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Text Edit Mode Active - Click any text to edit directly. Changes save automatically!</span>
          <span className="sm:hidden">Edit Mode Active • Click text to edit</span>
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className="ml-2 px-3 py-1 bg-white text-[#1B4332] hover:bg-gray-100 rounded-full text-[11px] font-bold uppercase tracking-wider cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      )}

      {/* Modals for Milestone & Project inspection */}
      <CareerModal
        item={selectedCareerItem}
        allItems={careerItems}
        onClose={() => setSelectedCareerItem(null)}
        onNavigate={(item) => setSelectedCareerItem(item)}
        onUpdateImage={handleUpdateCareerImage}
        onUpdateItem={handleUpdateCareerItemPartial}
        isEditMode={isEditMode}
      />

      <ProjectModal
        project={selectedProjectItem}
        allProjects={projects}
        onClose={() => setSelectedProjectItem(null)}
        onNavigate={(proj) => setSelectedProjectItem(proj)}
        onUpdateImage={handleUpdateProjectImage}
        onUpdateProject={handleUpdateProjectItemPartial}
        isEditMode={isEditMode}
      />

      {/* Photo & Content Manager Drawer (for user to easily drop in real photos & descriptions) */}
      <CustomizeDrawer
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        profile={profile}
        careerItems={careerItems}
        projectItems={projects}
        personalItems={personalItems}
        initialTab={drawerTab}
        onSaveProfile={handleSaveProfile}
        onSaveCareerItems={handleSaveCareerItems}
        onSaveProjectItems={handleSaveProjectItems}
        onSavePersonalItems={handleSavePersonalItems}
        onRestoreBackup={handleRestoreBackup}
        onResetDefaults={handleResetDefaults}
      />

    </div>
  );
}
