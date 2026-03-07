"use client";

import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import type { UploadedFile } from "@/lib/onboarding-payload";

interface FilesStepProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  onContinue: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FilesStep({ files, onChange, onContinue }: FilesStepProps) {
  const { t } = useTranslation();

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size <= MAX_FILE_SIZE) {
          newFiles.push({ name: file.name, size: file.size, type: file.type });
        }
      }
      onChange([...files, ...newFiles]);
    },
    [files, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function removeFile(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="max-w-3xl w-full py-12">
      <h2 className="text-3xl font-bold text-foreground mb-3">
        {t("onboarding.files.title")}
      </h2>
      <p className="text-foreground-secondary text-base leading-relaxed mb-6">
        {t("onboarding.files.description")}
      </p>

      <div>
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-white"
          >
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <p className="text-foreground-secondary text-sm">
                {t("onboarding.files.dropzone")}
              </p>
              <p className="text-foreground-muted text-xs mt-1">
                {t("onboarding.files.maxSize")}
              </p>
            </label>
          </div>

          {/* File list */}
          <div className="mt-4 space-y-2">
            {files.length === 0 && (
              <p className="text-foreground-muted text-sm text-center py-2">
                {t("onboarding.files.noFiles")}
              </p>
            )}
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-2"
              >
                <div>
                  <p className="text-sm text-foreground">{file.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-xs text-error hover:underline"
                >
                  {t("onboarding.files.remove")}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={onContinue}
              className="rounded-full bg-primary px-16 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              {t("onboarding.questions.continue")}
            </button>
          </div>
      </div>
    </div>
  );
}
