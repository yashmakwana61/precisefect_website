import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { cmsApi } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";

export default function MediaLibrary() {
  const [query, setQuery] = useState("");
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets", query],
    queryFn: () => cmsApi.listAssets(query || undefined),
  });

  const upload = useMutation({
    mutationFn: (file: File) => cmsApi.uploadAsset(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assets"] });
      toast({ title: "Uploaded" });
    },
    onError: (e) => toast({ title: "Upload failed", description: String(e), variant: "destructive" }),
  });

  return (
    <div className="px-8 lg:px-16 py-12">
      <p className="text-xs font-bold text-on-primary-container tracking-[0.2em] uppercase mb-4">Media</p>
      <h1 className="text-3xl font-bold text-primary mb-8 tracking-tight">Media Library</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="search"
          placeholder="Search filenames…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-surface text-sm flex-1 max-w-md"
        />
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider cursor-pointer">
          <Upload className="w-4 h-4" />
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload.mutate(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : assets.length === 0 ? (
        <p className="text-muted-foreground">No assets yet. Upload an image to get started.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {assets.map((a) => (
            <div key={a.id} className="border border-border rounded-lg overflow-hidden bg-surface-container-lowest">
              {a.mimeType.startsWith("image/") ? (
                <img src={a.publicUrl} alt={a.filename} className="w-full h-32 object-cover" />
              ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground text-xs">
                  File
                </div>
              )}
              <p className="p-2 text-xs truncate font-mono">{a.filename}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
