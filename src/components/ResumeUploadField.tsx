import React, { useState, useRef, useId } from 'react';
import { FileText, Upload, Link as LinkIcon, X, Check, Download, Loader2 } from 'lucide-react';

interface ResumeUploadFieldProps {
  resumeUrl?: string;
  resumeName?: string;
  onChange: (url: string, fileName?: string) => void;
}

export const ResumeUploadField: React.FC<ResumeUploadFieldProps> = ({
  resumeUrl,
  resumeName,
  onChange
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const processFile = (file: File) => {
    setError(null);
    const isPdfMime = file.type.includes('pdf');
    const isPdfExt = /\.pdf$/i.test(file.name);

    if (!isPdfMime && !isPdfExt) {
      setError('Please upload a PDF document (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file is larger than 10MB. Please use a smaller PDF or link.');
      return;
    }

    setIsReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setIsReading(false);
      if (typeof reader.result === 'string') {
        onChange(reader.result, file.name);
      }
    };
    reader.onerror = () => {
      setIsReading(false);
      setError('Failed to read resume file from device.');
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-[10px] uppercase font-bold text-[#1B4332]">
          Resume / CV Document (PDF)
        </label>
        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              mode === 'upload'
                ? 'bg-[#1B4332] text-[#F4EFE6] font-semibold'
                : 'text-[#4F6355] hover:text-[#18221B]'
            }`}
          >
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
              mode === 'url'
                ? 'bg-[#1B4332] text-[#F4EFE6] font-semibold'
                : 'text-[#4F6355] hover:text-[#18221B]'
            }`}
          >
            Drive / Web Link
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOver(false);
            }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-sm p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#1B4332] bg-[#1B4332]/10 scale-[1.01]'
                : 'border-[#1B4332]/30 hover:border-[#1B4332] bg-[#FAF6EF]'
            }`}
          >
            {isReading ? (
              <div className="flex items-center gap-2 py-1 text-[#1B4332]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold">Reading resume file...</span>
              </div>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-[#1B4332]/10 flex items-center justify-center mb-1 text-[#1B4332]">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] font-medium text-[#18221B]">
                  Drop your Resume PDF here, or <span className="text-[#1B4332] underline font-bold">browse device</span>
                </p>
                <p className="text-[10px] text-[#4F6355] mt-0.5">
                  Accepts standard PDF (e.g. Jacob_Lanning_Resume.pdf)
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <LinkIcon className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4F6355]" />
            <input
              type="text"
              value={resumeUrl?.startsWith('data:') ? '' : resumeUrl || ''}
              placeholder="https://drive.google.com/file/d/..."
              onChange={(e) => onChange(e.target.value, 'Jacob_Resume.pdf')}
              className="w-full pl-7 pr-2 py-1.5 text-[11px] rounded-sm bg-[#FAF6EF] border border-[#1B4332]/25 focus:outline-hidden focus:border-[#1B4332]"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-2 rounded-xs bg-red-50 border border-red-200 text-[10px] text-red-700 font-medium">
          {error}
        </div>
      )}

      {/* Active resume banner */}
      {resumeUrl && (
        <div className="flex items-center justify-between p-2 rounded-sm bg-[#EBE2D2]/60 border border-[#1B4332]/20">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xs bg-[#1B4332] text-[#F4EFE6] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#18221B] truncate">
                {resumeName || 'Jacob_Lanning_Resume.pdf'}
              </p>
              <p className="text-[9px] text-[#1B4332] font-semibold flex items-center gap-1">
                <Check className="w-2.5 h-2.5 text-[#1B4332]" />
                Resume linked for navbar download button
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={resumeUrl}
              download={resumeName || 'Jacob_Lanning_Resume.pdf'}
              className="p-1.5 rounded-xs text-[#1B4332] hover:bg-[#1B4332]/10 transition-colors"
              title="Download test"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => onChange('', '')}
              className="p-1.5 rounded-xs text-[#4F6355] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
              title="Remove resume"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
