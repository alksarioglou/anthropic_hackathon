"use client";

import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import type { UploadedFile } from "@/lib/onboarding-payload";

interface FilesStepProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_CONTENT_LENGTH = 50_000; // truncate very large files

const TEXT_TYPES = [
  "text/",
  "application/json",
  "application/xml",
  "application/javascript",
  "application/typescript",
  "application/x-yaml",
  "application/yaml",
  "application/csv",
  "application/sql",
];

function isTextFile(file: File): boolean {
  if (TEXT_TYPES.some((t) => file.type.startsWith(t))) return true;
  // Fallback: check extension for common text formats
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return [
    "txt", "md", "csv", "json", "xml", "yaml", "yml", "toml",
    "js", "ts", "tsx", "jsx", "py", "java", "go", "rs", "rb",
    "html", "css", "scss", "sql", "sh", "bash", "zsh",
    "env", "ini", "cfg", "conf", "log", "rtf",
  ].includes(ext);
}

async function readFileContent(file: File): Promise<string | undefined> {
  if (!isTextFile(file)) return undefined;
  try {
    let text = await file.text();
    if (text.length > MAX_CONTENT_LENGTH) {
      text = text.slice(0, MAX_CONTENT_LENGTH) + "\n\n[... truncated ...]";
    }
    return text;
  } catch {
    return undefined;
  }
}

export function FilesStep({ files, onChange }: FilesStepProps) {
  const { t } = useTranslation();

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList) return;
      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.size <= MAX_FILE_SIZE) {
          const content = await readFileContent(file);
          newFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            content,
          });
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
            className="border-2 border-dashed border-input-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
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
                className="flex items-center justify-between rounded-lg border border-border-light bg-background px-4 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{file.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {formatSize(file.size)}
                    {file.content ? (
                      <span className="ml-2 text-success">Content parsed</span>
                    ) : (
                      <span className="ml-2 text-foreground-muted">Binary file (metadata only)</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-xs text-error hover:underline ml-3 shrink-0"
                >
                  {t("onboarding.files.remove")}
                </button>
              </div>
            ))}
          </div>

      </div>
    </div>
  );
}
