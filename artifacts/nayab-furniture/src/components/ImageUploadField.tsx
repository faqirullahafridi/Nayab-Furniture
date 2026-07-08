import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminApi } from "@/hooks/use-admin-api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  compressImageFile,
  readBlobAsBase64,
  resolveImageUrl,
} from "@/lib/images";

type ImageUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
};

export function ImageUploadField({
  label = "Product Image",
  value,
  onChange,
  required,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const { withAuth } = useAdminApi();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (localPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const clearLocalPreview = () => {
    if (localPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreview);
    }
    setLocalPreview(null);
    setPreviewError(false);
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Please choose an image file." });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Image must be 8 MB or smaller." });
      return;
    }

    clearLocalPreview();
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setUploading(true);

    try {
      const { blob, mimeType } = await compressImageFile(file);
      const data = await readBlobAsBase64(blob);
      const init = await withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          filename: file.name,
          mimeType,
        }),
      });

      const res = await fetch("/api/uploads", init);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Upload failed");
      }

      const { url } = (await res.json()) as { url: string };
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        throw new Error(
          "Upload saved locally instead of cloud storage. Restart the API server and try again.",
        );
      }
      onChange(url);
      setPreviewError(false);
      toast({ title: "Image uploaded" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Try again.",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const previewSrc = localPreview || (value ? resolveImageUrl(value) : "");
  const showPreview = Boolean(previewSrc) && !previewError;

  return (
    <div className="space-y-2">
      <Label>{label}{required ? " *" : ""}</Label>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={value}
          onChange={(e) => {
            clearLocalPreview();
            onChange(e.target.value);
          }}
          placeholder="https://... or /uploads/..."
          className="flex-1"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>

      {showPreview && (
        <div className="relative inline-block mt-1">
          <img
            src={previewSrc}
            alt="Preview"
            className={cn(
              "h-24 w-24 object-cover rounded border border-border",
              uploading && "opacity-60",
            )}
            onLoad={() => {
              setPreviewError(false);
              if (value && localPreview && !uploading) clearLocalPreview();
            }}
            onError={() => setPreviewError(true)}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              clearLocalPreview();
              onChange("");
            }}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {previewError && value && (
        <p className="text-xs text-destructive">
          Preview failed to load. The URL may be invalid or the file is not reachable yet.
        </p>
      )}
    </div>
  );
}
