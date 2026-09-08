import React, { useState } from "react";
import { ProfileData } from "../types";
import {
  Send,
  Check,
  Linkedin,
  ArrowUp,
  ShieldCheck,
  Mail,
  Copy,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface ContactSectionProps {
  profile: ProfileData;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const targetEmail = profile.email || "Sparkylanning@gmail.com";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "Internship / Full-Time Opportunity",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState<
    "endpoint" | "mailto"
  >("mailto");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatMessageBody = () => {
    return `Hello Jacob,\n\n${formState.message}\n\n---\nSender: ${formState.name}\nEmail: ${formState.email}\nOrganization: ${formState.organization || "Not specified"}\nTopic: ${formState.subject}`;
  };

  const getMailtoUrl = () => {
    const subject = `[Portfolio Inquiry] ${formState.subject} - from ${formState.name}`;
    const body = formatMessageBody();
    return `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getGmailWebUrl = () => {
    const subject = `[Portfolio Inquiry] ${formState.subject} - from ${formState.name}`;
    const body = formatMessageBody();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    // If a custom endpoint (e.g. Formspree) is configured
    if (profile.formEndpoint && profile.formEndpoint.trim().length > 0) {
      try {
        const response = await fetch(profile.formEndpoint.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formState.name,
            email: formState.email,
            organization: formState.organization,
            subject: formState.subject,
            message: formState.message,
            _replyto: formState.email,
          }),
        });

        if (response.ok) {
          setSubmissionMethod("endpoint");
          setIsSubmitting(false);
          setSubmitted(true);
          return;
        } else {
          console.warn(
            "Endpoint submission returned non-200, falling back to direct email compose",
          );
        }
      } catch (err) {
        console.warn(
          "Endpoint submission failed, falling back to mail client:",
          err,
        );
      }
    }

    // Default & reliable path: dispatch via mail client
    setSubmissionMethod("mailto");
    const mailto = getMailtoUrl();
    try {
      window.location.href = mailto;
    } catch {
      // Fallback
    }
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(targetEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formatMessageBody());
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleReset = () => {
    setFormState({
      name: "",
      email: "",
      organization: "",
      subject: "Internship / Full-Time Opportunity",
      message: "",
    });
    setSubmitted(false);
    setErrorMessage(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      className="bg-[#FAF6EF] border-t border-[#1B4332]/20 pt-20 pb-12 px-6 sm:px-10 md:px-16"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#1B4332]/20">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#1B4332] font-bold mb-2">
              <div className="h-[1px] w-8 bg-[#1B4332]" />
              <span>Contact & Inquiries</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#18221B] tracking-tight">
              Get in touch directly
              <span className="text-[#1B4332] italic">.</span>
            </h2>
            <p className="text-sm text-[#3E4A40] mt-2 max-w-xl font-normal leading-relaxed">
              Send a note regarding operations management, supply chain
              optimization, or business analytics roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-end">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm bg-[#1B4332] text-[#F4EFE6] hover:bg-[#2D6A4F] transition-colors shadow-2xs"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="bg-[#F4EFE6] p-7 sm:p-10 rounded-sm border border-[#1B4332]/20 shadow-xs">
          {submitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#1B4332] text-[#F4EFE6] mx-auto flex items-center justify-center shadow-sm">
                <Check className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#18221B]">
                  {submissionMethod === "endpoint"
                    ? "Message Delivered Successfully"
                    : "Message Ready to Send"}
                </h3>
                <p className="text-sm text-[#3E4A40] max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you,{" "}
                  <span className="font-semibold text-[#18221B]">
                    {formState.name}
                  </span>
                  ! Your message is addressed directly to Jacob Lanning.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-wider text-[#4F6355] hover:text-[#18221B] transition-colors cursor-pointer"
                >
                  &larr; Back to form
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-bold uppercase tracking-wider text-[#18221B]"
                  >
                    Your Name <span className="text-[#1B4332]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 text-sm rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 text-[#18221B] placeholder-[#4F6355]/50 focus:outline-hidden focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors"
                  />
                </div>

                {/* Sender's Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[#18221B]"
                  >
                    Your Email <span className="text-[#1B4332]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="e.g. sarah@company.com"
                    className="w-full px-3.5 py-2.5 text-sm rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 text-[#18221B] placeholder-[#4F6355]/50 focus:outline-hidden focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Organization */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-org"
                    className="block text-xs font-bold uppercase tracking-wider text-[#18221B]"
                  >
                    Company / Organization
                  </label>
                  <input
                    id="contact-org"
                    type="text"
                    value={formState.organization}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        organization: e.target.value,
                      })
                    }
                    placeholder="e.g. Supply Chain Group"
                    className="w-full px-3.5 py-2.5 text-sm rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 text-[#18221B] placeholder-[#4F6355]/50 focus:outline-hidden focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors"
                  />
                </div>

                {/* Topic / Subject */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-bold uppercase tracking-wider text-[#18221B]"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-subject"
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 text-[#18221B] focus:outline-hidden focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors"
                  >
                    <option value="Internship / Full-Time Opportunity">
                      Internship / Full-Time Opportunity
                    </option>
                    <option value="Supply Chain Collaboration">
                      Supply Chain Project / Collaboration
                    </option>
                    <option value="Quantitative Analytics Inquiry">
                      Quantitative Analytics Inquiry
                    </option>
                    <option value="General Professional Connection">
                      General Professional Connection
                    </option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-bold uppercase tracking-wider text-[#18221B]"
                >
                  Your Message <span className="text-[#1B4332]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  placeholder="Describe the opportunity, project context, or question..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 text-[#18221B] placeholder-[#4F6355]/50 focus:outline-hidden focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-colors"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs text-[#4F6355]">
                  <ShieldCheck className="w-4 h-4 text-[#1B4332]" />
                  <span>Delivers directly to Jacob Lanning's inbox</span>
                </div>

                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 text-xs font-bold uppercase tracking-widest rounded-sm bg-[#1B4332] text-[#F4EFE6] hover:bg-[#2D6A4F] transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Routing Note...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Sub-Bar */}
        <div className="pt-8 border-t border-[#1B4332]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4F6355]">
          <div className="font-serif italic text-[#18221B]">
            Jacob Lanning &bull; Calvin University Class of 2027
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#1B4332] transition-colors uppercase font-bold text-[11px] tracking-wider cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
