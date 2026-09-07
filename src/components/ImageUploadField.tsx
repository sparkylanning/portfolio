import React, { useState, useRef, useId } from 'react';
import { Upload, Link as LinkIcon, X, Check, Loader2, Sparkles } from 'lucide-react';
import { optimizeImageFile, formatBytes, OptimizeResult } from '../utils/imageOptimizer';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectRatioHint?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Image',
  value,
  onChange,
  aspectRatioHint = 'Landscape or square'
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<{
    original: number;
    optimized: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFileProcess = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    setCompressionInfo(null);

    try {
      // Optimize and resize image client-side via canvas
      const result: OptimizeResult = await optimizeImageFile(file, 800, 800, 0.74);
      
      setCompressionInfo({
        original: result.originalSize,
        optimized: result.optimizedSize,
      });

      onChange(result.dataUrl);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err?.message || 'Failed to process image. Please try a different file.');
    } finally {
      setIsProcessing(false);
      // Reset input value so re-uploading the same file works reliably
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Header & Toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="block text-[10px] uppercase font-bold text-[#1B4332]">
          {label}
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
            Upload File
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
            Web URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          {/* Hidden File Input */}
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif, image/*"
            className="sr-only"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Drag and Drop Zone */}
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
            className={`border-2 border-dashed rounded-sm p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
              dragOver
                ? 'border-[#1B4332] bg-[#1B4332]/10 scale-[1.01]'
                : 'border-[#1B4332]/30 hover:border-[#1B4332] bg-[#FAF6EF]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2 py-1 text-[#1B4332]">
                <Loader2 className="w-4 h-4 animate-spin text-[#1B4332]" />
                <span className="text-xs font-semibold">Optimizing and preparing image...</span>
              </div>
            ) : (
              <>
                <div className="w-7 h-7 rounded-full bg-[#1B4332]/10 flex items-center justify-center mb-1 text-[#1B4332]">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <p className="text-[11px] font-medium text-[#18221B]">
                  Drag & drop your photo here, or <span className="text-[#1B4332] underline font-bold">browse computer</span>
                </p>
                <p className="text-[10px] text-[#4F6355] mt-0.5">
                  Accepts JPEG, PNG, WebP (Auto-compressed for instant loading • {aspectRatioHint})
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
              value={value.startsWith('data:') ? '' : value}
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => onChange(e.target.value)}
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

      {/* Compression confirmation badge */}
      {compressionInfo && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xs bg-[#1B4332]/10 text-[#1B4332] text-[10px] font-medium border border-[#1B4332]/20">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>
            Optimized: {formatBytes(compressionInfo.original)} → {formatBytes(compressionInfo.optimized)} (Saved cleanly)
          </span>
        </div>
      )}

      {/* Preview thumbnail */}
      {value && (
        <div className="flex items-center gap-2 pt-1">
          <div className="w-12 h-12 rounded-sm overflow-hidden border border-[#1B4332]/30 bg-[#F4EFE6] shrink-0 shadow-2xs">
            <img
              src={value}
              alt="Preview thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-[#1B4332] flex items-center gap-1 truncate">
              <Check className="w-3 h-3 text-[#1B4332]" />
              {value.startsWith('data:') ? 'Custom uploaded photo active' : 'Linked photo active'}
            </p>
            <p className="text-[9px] text-[#4F6355] truncate">
              {value.startsWith('data:') ? 'Stored locally in browser' : value.slice(0, 45)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange('');
              setCompressionInfo(null);
            }}
            className="p-1 rounded-sm text-[#4F6355] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            title="Remove photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
