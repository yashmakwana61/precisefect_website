import { useQuery } from "@tanstack/react-query";
import { cmsApi, type FooterContent, type NavbarContent } from "@/lib/cms-api";
import { usePreviewMode } from "@/hooks/use-preview";

export function useSiteBlocks() {
  const preview = usePreviewMode();
  return useQuery({
    queryKey: ["site-blocks", preview],
    queryFn: () => cmsApi.getSiteBlocks(["navbar", "footer"], preview ? "preview" : undefined),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useNavbarContent(fallback: NavbarContent): NavbarContent {
  const { data: blocks = [] } = useSiteBlocks();
  return (blocks.find((b) => b.blockType === "navbar")?.content as unknown as NavbarContent) ?? fallback;
}

export function useFooterContent(fallback: FooterContent): FooterContent {
  const { data: blocks = [] } = useSiteBlocks();
  return (blocks.find((b) => b.blockType === "footer")?.content as unknown as FooterContent) ?? fallback;
}
