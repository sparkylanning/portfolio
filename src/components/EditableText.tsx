import React, { useRef, useState, useEffect } from 'react';
import { Edit2, Check, X } from 'lucide-react';

export interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditMode: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
  placeholder?: string;
  inputClassName?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onSave,
  isEditMode,
  className = '',
  as: Component = 'span',
  multiline = false,
  placeholder = 'Click to edit...',
  inputClassName = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync draft when value changes externally (and not currently in active edit state)
  useEffect(() => {
    if (!isEditing) {
      setDraft(value || '');
    }
  }, [value, isEditing]);

  // Focus and configure cursor when entering active edit state
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${Math.max(inputRef.current.scrollHeight, 60)}px`;
      }
    }
  }, [isEditing]);

  // Dynamically expand textarea as user types
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.max(e.target.scrollHeight, 60)}px`;
  };

  // Commit changes
  const handleCommit = () => {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== (value || '').trim()) {
      onSave(trimmed);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setDraft(value || '');
    setIsEditing(false);
  };

  // Auto-commit if edit mode is toggled off while currently editing
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;
  const valueRef = useRef(value);
  valueRef.current = value;
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!isEditMode && isEditingRef.current) {
      const trimmed = draftRef.current.trim();
      if (trimmed !== (valueRef.current || '').trim()) {
        onSaveRef.current(trimmed);
      }
      setIsEditing(false);
    }
  }, [isEditMode]);

  // When edit mode is OFF, render plain component without edit wrappers
  if (!isEditMode) {
    return <Component className={className}>{value || placeholder}</Component>;
  }

  // When edit mode is ON and user has activated this specific field:
  if (isEditing) {
    if (multiline) {
      return (
        <div 
          className="relative w-full my-2 z-30 text-left" 
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={handleTextareaInput}
            onBlur={handleCommit}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
              }
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleCommit();
              }
            }}
            placeholder={placeholder}
            rows={3}
            className={`${className} ${inputClassName} w-full resize-none bg-amber-50/95 border-2 border-amber-600 text-[#18221B] rounded-sm p-3 focus:outline-hidden ring-3 ring-amber-400/40 shadow-md leading-relaxed block font-sans`}
          />
          <div className="flex flex-wrap items-center justify-between gap-2 mt-1.5 px-1 text-xs text-amber-950 font-sans">
            <span className="text-[11px] text-amber-900/80 font-medium">
              Tip: Press <kbd className="px-1 py-0.5 bg-amber-200/80 rounded-xs font-mono text-[10px]">Ctrl+Enter</kbd> or click outside to save • <kbd className="px-1 py-0.5 bg-amber-200/80 rounded-xs font-mono text-[10px]">Esc</kbd> to cancel
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCancel();
                }}
                className="px-2.5 py-1 text-xs text-amber-950 hover:bg-amber-200/70 rounded-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleCommit();
                }}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-[#1B4332] hover:bg-[#2D6A4F] text-[#F4EFE6] rounded-sm font-bold transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Single line editing
    return (
      <span 
        className="relative inline-flex items-center gap-1.5 align-baseline my-0.5 z-30" 
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCommit();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              handleCancel();
            }
          }}
          placeholder={placeholder}
          className={`${className} ${inputClassName} bg-amber-50/95 border-b-2 border-amber-600 text-[#18221B] px-2 py-0.5 rounded-sm focus:outline-hidden ring-2 ring-amber-400/50 shadow-sm inline-block min-w-[140px] max-w-full`}
        />
        <span className="inline-flex items-center gap-1 shrink-0 font-sans">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCommit();
            }}
            className="p-1.5 rounded-sm bg-[#1B4332] hover:bg-[#2D6A4F] text-[#F4EFE6] transition-colors cursor-pointer shadow-xs"
            title="Save changes (Enter)"
            aria-label="Save"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            className="p-1.5 rounded-sm bg-amber-200 hover:bg-amber-300 text-amber-950 transition-colors cursor-pointer shadow-xs"
            title="Cancel (Esc)"
            aria-label="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      </span>
    );
  }

  // When edit mode is ON and user has NOT clicked into this field yet:
  return (
    <Component
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`${className} relative group/edit cursor-pointer rounded-sm transition-all duration-150 ring-2 ring-dashed ring-amber-500/80 hover:ring-amber-600 hover:bg-amber-100/50 px-1.5 -mx-1.5 py-0.5 -my-0.5 inline-block select-text`}
      title="Click to edit text directly"
    >
      <span>{value || <span className="italic text-amber-900/60 font-normal">{placeholder}</span>}</span>
      <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-sans font-bold tracking-normal uppercase text-amber-900 bg-amber-200/90 border border-amber-400/60 px-1.5 py-0.5 rounded-xs pointer-events-none align-middle shadow-2xs">
        <Edit2 className="w-2.5 h-2.5" />
        <span>Edit</span>
      </span>
    </Component>
  );
};
