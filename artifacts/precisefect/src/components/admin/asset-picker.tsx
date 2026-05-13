import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Image as ImageIcon } from "lucide-react";
import { cmsApi, type Asset } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";

interface AssetPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function AssetPicker({ open, onClose, onSelect }: AssetPickerProps) {
  const [query, setQuery] = useState("");
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets", query],
    queryFn: () => cmsApi.listAssets(query || undefined),
    enabled: open,
  });

  const upload = useMutation({
    mutationFn: (file: File) => cmsApi.uploadAsset(file),
    onSuccess: (asset) => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Uploaded", description: asset.filename });
      onSelect(asset.publicUrl);
      onClose();
    },
    onError: (e) => toast({ title: "Upload failed", description: String(e), variant: "destructive" }),
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest ghost-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-primary">Media Library</h3>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground hover:text-primary">Close</button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-sm"
            />
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload.mutate(f);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="text-muted-foreground text-sm">No assets yet. Upload an image.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {assets.map((asset: Asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => { onSelect(asset.publicUrl); onClose(); }}
                  className="group border border-border rounded-lg overflow-hidden hover:border-primary transition-colors text-left"
                >
                  {asset.mimeType.startsWith("image/") ? (
                    <img src={asset.publicUrl} alt={asset.filename} className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-surface-container-high">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-2 text-xs truncate text-muted-foreground group-hover:text-primary">{asset.filename}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
