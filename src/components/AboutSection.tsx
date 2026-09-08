import React, { useRef } from "react";
import { ProfileData, ApproachPillar } from "../types";
import {
  GraduationCap,
  MapPin,
  Layers,
  TrendingUp,
  CheckCircle2,
  Download,
  FileText,
  Camera,
} from "lucide-react";
import { EditableText } from "./EditableText";
import { optimizeImageFile } from "../utils/imageOptimizer";
import { recordUploadedImage } from "../utils/storage";

interface AboutSectionProps {
  profile: ProfileData;
  onUpdateProfile?: (updated: Partial<ProfileData>) => void;
  isEditMode?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  onUpdateProfile,
  isEditMode = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateProfile) return;
    try {
      const result = await optimizeImageFile(file, 800, 800, 0.74);
      // Immediately store in direct localStorage key for instantaneous resilience
      try {
        localStorage.setItem("jacob_avatar_img", result.dataUrl);
        localStorage.setItem("jacob_img_avatarImage", result.dataUrl);
      } catch (storageErr) {
        console.warn("Direct avatar localStorage write error:", storageErr);
      }
      recordUploadedImage("avatarImage", result.dataUrl, "profile");
      onUpdateProfile({ avatarImage: result.dataUrl });
    } catch (err) {
      console.error("Failed to upload headshot", err);
    }
    if (e.target) e.target.value = "";
  };

  const approachPillars: ApproachPillar[] = profile.approachPillars || [
    {
      id: "pillar-1",
      title: "Making Sense of Numbers",
      description:
        "Building simple, practical tools that take the stress and guesswork out of big decisions.",
    },
    {
      id: "pillar-2",
      title: "Clear Steps for Teams",
      description:
        "Writing down clear, friendly guides so everyone stays on the same page and work flows smoothly.",
    },
    {
      id: "pillar-3",
      title: "Caring About Details",
      description:
        "Catching the small discrepancies in logistics schedules, ledgers, and data pipelines to keep operations running right.",
    },
  ];

  const handleUpdatePillar = (
    id: string,
    field: "title" | "description",
    value: string,
  ) => {
    if (!onUpdateProfile) return;
    const updated = approachPillars.map((p) =>
      p.id === id ? { ...p, [field]: value } : p,
    );
    onUpdateProfile({ approachPillars: updated });
  };

  return (
    <section
      id="about"
      className="py-20 md:py-24 bg-[#FAF6EF] border-t border-[#1B4332]/20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 space-y-12">
        {/* Section Tag */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#1B4332] font-bold">
          <div className="h-[1px] w-8 bg-[#1B4332]" />
          <span>About Me</span>
          {isEditMode && (
            <span className="text-[10px] lowercase tracking-normal bg-amber-100 text-amber-900 px-2 py-0.5 rounded-xs border border-amber-300">
              click any text to edit
            </span>
          )}
        </div>

        {/* Main Side-by-Side: Picture of Jacob on Left, Bio right next to it on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Headshot Photo with a really small spot for Calvin University (4 cols) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            {/* Jacob Headshot Photo */}
            <div className="relative group w-full sm:w-56 lg:w-full">
              <div className="w-full aspect-[4/5] rounded-sm overflow-hidden border border-[#1B4332]/25 bg-[#F4EFE6] shadow-sm relative">
                <img
                  src={profile.avatarImage}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* Really small, neat spot for Calvin University Class of 2027 & Degree */}
            <div className="flex-1 lg:flex-none p-3 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/20 shadow-2xs space-y-1 text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-[#18221B] flex-wrap">
                <GraduationCap className="w-3.5 h-3.5 text-[#1B4332] shrink-0" />
                <EditableText
                  value={profile.university}
                  onSave={(val) => onUpdateProfile?.({ university: val })}
                  isEditMode={isEditMode}
                  as="span"
                  className="font-serif font-bold text-[#18221B]"
                />
                <span className="text-[#1B4332] font-sans text-[11px] font-semibold">
                  (
                  <EditableText
                    value={profile.graduationYear}
                    onSave={(val) => onUpdateProfile?.({ graduationYear: val })}
                    isEditMode={isEditMode}
                    as="span"
                  />
                  )
                </span>
              </div>
              <p className="text-[11px] text-[#4F6355] leading-snug pl-5 font-medium">
                <EditableText
                  value={profile.degree}
                  onSave={(val) => onUpdateProfile?.({ degree: val })}
                  isEditMode={isEditMode}
                  as="span"
                />
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#3E4A40] pt-1 pl-5">
                <MapPin className="w-3 h-3 text-[#1B4332] shrink-0" />
                <EditableText
                  value={profile.location}
                  onSave={(val) => onUpdateProfile?.({ location: val })}
                  isEditMode={isEditMode}
                  as="span"
                />
              </div>
            </div>

            {/* Resume / CV Download Card if available */}
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                download={profile.resumeName || "Jacob_Lanning_Resume.pdf"}
                className="flex items-center justify-center gap-2 p-2.5 rounded-sm bg-[#1B4332] text-[#F4EFE6] text-xs font-bold uppercase tracking-wider hover:bg-[#2D6A4F] transition-all shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Resume (PDF)</span>
                <Download className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </div>

          {/* Right Column: Directly next to the picture: Bio that starts "Hey, I'm Jacob...", Headline (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Headline */}
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-normal text-[#18221B] tracking-tight leading-[1.15]">
                <EditableText
                  value={
                    profile.aboutHeadline ||
                    "Taking raw data to actionable insight, and real change."
                  }
                  onSave={(val) => onUpdateProfile?.({ aboutHeadline: val })}
                  isEditMode={isEditMode}
                  as="span"
                />
              </h2>
            </div>

            {/* Bio narrative that starts "Hey, I'm Jacob" - directly next to the picture! */}
            <div className="text-sm sm:text-base text-[#2E3B32] leading-relaxed font-normal">
              <EditableText
                value={profile.shortBio}
                onSave={(val) => onUpdateProfile?.({ shortBio: val })}
                isEditMode={isEditMode}
                multiline={true}
                as="p"
                className="text-[#18221B] font-medium leading-relaxed block"
              />
            </div>

            {/* Quick links */}
            <div className="pt-2 flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#1B4332]">
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#2D6A4F] underline underline-offset-4"
              >
                LinkedIn Profile &rarr;
              </a>
              <a
                href="#career"
                className="hover:text-[#2D6A4F] underline underline-offset-4"
              >
                View Career Path &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* 3 Core Approach Cards - Placed cleanly below the Photo & Bio side-by-side row */}
        <div className="pt-6 border-t border-[#1B4332]/15">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {approachPillars.map((pillar, idx) => {
              const Icon =
                idx === 0 ? TrendingUp : idx === 1 ? Layers : CheckCircle2;
              return (
                <div
                  key={pillar.id}
                  className="p-4 rounded-sm bg-[#F4EFE6] border border-[#1B4332]/20 space-y-1.5 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1B4332] text-[#F4EFE6] flex items-center justify-center mb-2">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-serif font-bold text-[#18221B]">
                    <EditableText
                      value={pillar.title}
                      onSave={(val) =>
                        handleUpdatePillar(pillar.id, "title", val)
                      }
                      isEditMode={isEditMode}
                      as="span"
                    />
                  </h4>
                  <p className="text-[11px] text-[#4F6355] leading-relaxed">
                    <EditableText
                      value={pillar.description}
                      onSave={(val) =>
                        handleUpdatePillar(pillar.id, "description", val)
                      }
                      isEditMode={isEditMode}
                      multiline={true}
                      as="span"
                    />
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
