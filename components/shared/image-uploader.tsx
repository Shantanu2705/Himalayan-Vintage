'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (base64Url: string) => void;
  onRemove?: () => void;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
  maxDimension?: number;
  quality?: number;
}

export function ImageUploader({
  label,
  value,
  onChange,
  onRemove,
  placeholder = 'Click or drag photo to upload',
  aspectRatio = 'square',
  maxDimension = 800,
  quality = 0.8,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processAndCompressImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          onChange(compressedBase64);
          setLoading(false);
        } else {
          onChange(e.target?.result as string);
          setLoading(false);
        }
      };
      img.onerror = () => {
        setError('Failed to process image.');
        setLoading(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndCompressImage(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndCompressImage(file);
    }
  };

  const aspectClasses = {
    square: 'aspect-square max-w-[200px]',
    video: 'aspect-video max-w-[320px]',
    banner: 'aspect-[3/1] w-full max-h-[160px]',
  }[aspectRatio];

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>

      {error && <p className="text-xs font-medium text-destructive">{error}</p>}

      {value ? (
        <div className={`relative overflow-hidden rounded-xl border-2 border-primary/20 bg-muted/30 group ${aspectClasses}`}>
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-8 text-xs font-semibold"
              onClick={() => fileInputRef.current?.click()}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Replace
            </Button>
            {onRemove && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-8 text-xs font-semibold"
                onClick={() => {
                  onRemove();
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>
          <div className="absolute top-2 right-2 rounded-full bg-emerald-500 text-white p-1 shadow-md">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-6 transition-all duration-200 ${
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/50'
          } ${aspectClasses}`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-primary">
              <RefreshCw className="h-7 w-7 animate-spin" />
              <span className="text-xs font-medium">Processing photo...</span>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-3 text-primary mb-2 shadow-xs">
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">{placeholder}</p>
              <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
