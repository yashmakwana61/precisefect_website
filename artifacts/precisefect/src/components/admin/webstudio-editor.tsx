import { useState, useEffect } from "react";
import { 
  Layers, Plus, Trash2, ArrowUp, ArrowDown, Settings, 
  Paintbrush, Type, Eye, EyeOff, Layout, Sparkles, Image as ImageIcon, 
  HelpCircle, ChevronRight, Check
} from "lucide-react";
import { AssetPicker } from "./asset-picker";

// Define the blocks structure
interface VisualBlock {
  id: string;
  type: "hero" | "logos" | "features" | "case-study" | "pricing" | "team" | "cta" | "content";
  settings: {
    // Content settings
    headline?: string;
    subheadline?: string;
    text?: string;
    ctaText?: string;
    ctaUrl?: string;
    badge?: string;
    // List / Grid items
    items?: Array<{ title: string; description: string; extra?: string }>;
    logos?: string[];
    // Styling settings
    bgStyle?: "slate" | "white" | "light" | "emerald";
    paddingStyle?: "large" | "medium" | "small";
    textAlign?: "left" | "center" | "right";
    headlineColor?: string;
    textColor?: string;
    borderRadius?: "none" | "medium" | "large" | "full";
  };
}

interface WebstudioEditorProps {
  initialHtml: string;
  initialProjectData: any;
  onChange: (html: string, projectData: any) => void;
}

// Pre-defined B2B block choices
const BLOCK_TEMPLATES = [
  {
    type: "hero" as const,
    label: "Enterprise B2B Hero",
    description: "Premium dark hero section with background gradients & CTA",
    defaultSettings: {
      badge: "Precision + Perfection",
      headline: "ERP Implementation & Automation Partner",
      subheadline: "We orchestrate B2B digital transformations to scale your enterprise manufacturing, logistics, or services operations.",
      ctaText: "Partner With Us",
      ctaUrl: "/contact",
      bgStyle: "slate" as const,
      paddingStyle: "large" as const,
      textAlign: "left" as const,
    }
  },
  {
    type: "logos" as const,
    label: "Partner Trust Logos",
    description: "Sleek, low-contrast client badge showcase",
    defaultSettings: {
      badge: "Trusted by leading scale-ups and enterprise leaders",
      logos: ["LOGIC-PRO", "PHARMASYS", "LOGIX", "RET-CORP", "PRECISEIND"],
      bgStyle: "white" as const,
      paddingStyle: "small" as const,
      textAlign: "center" as const,
    }
  },
  {
    type: "features" as const,
    label: "3-Column Offerings Grid",
    description: "Beautiful vertical layout with custom metric items",
    defaultSettings: {
      headline: "Core Automation Offerings",
      subheadline: "Expertly engineered systems to remove manual friction from workflows.",
      items: [
        { title: "Enterprise ERP", description: "Tailored, seamless ERP rollouts (Odoo, SAP, Custom) crafted for manufacturing and supply chains." },
        { title: "Workflow Automation", description: "Eliminate repetitive tasks by building intelligent RPA bridges and pipeline connectors." },
        { title: "Data Analytics", description: "Centralized live dashboards mapping key performance indicators across all business vertices." }
      ],
      bgStyle: "light" as const,
      paddingStyle: "medium" as const,
      textAlign: "center" as const,
    }
  },
  {
    type: "case-study" as const,
    label: "Case Study Spotlight",
    description: "Split content highlight featuring high-impact B2B results",
    defaultSettings: {
      badge: "Featured Case Study",
      headline: "Automation Boosts Pharma Pipeline Output by 140%",
      subheadline: "We modernized a multi-line formulation packaging facility with smart PLC database connectors, standardizing tracking and cutting human processing errors to zero.",
      ctaText: "Vivek Patel",
      ctaUrl: "Director of Operations, PharmaSys Ltd",
      text: "Precisefect completely redefined our manufacturing automation strategy. The Odoo integration gives us real-time lineage tracking across the plant floor.",
      items: [
        { title: "+140%", description: "Throughput Increase" },
        { title: "0%", description: "Compliance Discrepancies" }
      ],
      bgStyle: "slate" as const,
      paddingStyle: "medium" as const,
      textAlign: "left" as const,
    }
  },
  {
    type: "pricing" as const,
    label: "3-Tier Engagement Pricing",
    description: "Sleek, customizable pricing comparison table",
    defaultSettings: {
      headline: "Flexible Engagement Models",
      subheadline: "Choose the consulting structure that fits your roadmap goals.",
      items: [
        { title: "Process Mapping", description: "$2,500/project", extra: "Bespoke technical blueprints detailing complete ERP/workflow recommendations." },
        { title: "Retainer Consulting", description: "$5,000/month", extra: "Dedicated expert B2B architects to actively deploy, scale, and integrate systems." },
        { title: "Custom Turnkey", description: "Bespoke Quote", extra: "End-to-end proprietary automation systems built specifically for enterprise scale." }
      ],
      bgStyle: "light" as const,
      paddingStyle: "medium" as const,
      textAlign: "center" as const,
    }
  },
  {
    type: "team" as const,
    label: "Team Showcase Grid",
    description: "Present senior operations team members",
    defaultSettings: {
      headline: "Enterprise Operations Experts",
      subheadline: "Architects and engineers who understand standard enterprise structures.",
      items: [
        { title: "Yash Makwana", description: "Lead Architect & Founder", extra: "Specialist in customized Odoo modules and enterprise process mapping workflows." },
        { title: "Darshak Kothari", description: "Principal Systems Engineer", extra: "Over 10 years automating complex logistics supply chains and warehouse databases." },
        { title: "Siddharth Mehta", description: "Strategic B2B Consultant", extra: "Helps pharma and retail operations standardize workflows for scale readiness." }
      ],
      bgStyle: "white" as const,
      paddingStyle: "medium" as const,
      textAlign: "center" as const,
    }
  },
  {
    type: "cta" as const,
    label: "Urgent Call to Action",
    category: "CTA",
    defaultSettings: {
      headline: "Ready to automate your operations?",
      subheadline: "Get a free process-mapping consultation with our enterprise architect experts.",
      ctaText: "Schedule Consultation",
      ctaUrl: "/contact",
      bgStyle: "emerald" as const,
      paddingStyle: "medium" as const,
      textAlign: "center" as const,
    }
  },
  {
    type: "content" as const,
    label: "Rich Typography Text",
    description: "Simple, highly readable centered text prose block",
    defaultSettings: {
      headline: "Engineered for perfection, executed with precision.",
      text: "Our senior team blends strategic B2B consulting with high-impact software design to empower operations that scale securely. We don't believe in templates; every process map is drawn bespoke.",
      bgStyle: "white" as const,
      paddingStyle: "medium" as const,
      textAlign: "left" as const,
    }
  }
];

export function WebstudioEditor({ initialHtml, initialProjectData, onChange }: WebstudioEditorProps) {
  const [blocks, setBlocks] = useState<VisualBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [inspectorTab, setInspectorTab] = useState<"content" | "style">("content");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeAssetField, setActiveAssetField] = useState<{ blockId: string; key: string } | null>(null);

  // Initialize blocks from state or parse existing
  useEffect(() => {
    if (initialProjectData && Array.isArray(initialProjectData)) {
      setBlocks(initialProjectData);
      if (initialProjectData.length > 0) {
        setSelectedBlockId(initialProjectData[0].id);
      }
    } else {
      // Load standard defaults if empty
      const defaultLayout: VisualBlock[] = [
        {
          id: "hero-1",
          type: "hero",
          settings: { ...BLOCK_TEMPLATES[0].defaultSettings }
        },
        {
          id: "logos-1",
          type: "logos",
          settings: { ...BLOCK_TEMPLATES[1].defaultSettings }
        },
        {
          id: "cta-1",
          type: "cta",
          settings: { ...BLOCK_TEMPLATES[6].defaultSettings }
        }
      ];
      setBlocks(defaultLayout);
      setSelectedBlockId("hero-1");
      triggerChange(defaultLayout);
    }
  }, []);

  // Update layout changes back to CMS Form state
  function triggerChange(updatedBlocks: VisualBlock[]) {
    const html = compileWebstudioToHtml(updatedBlocks);
    onChange(html, updatedBlocks);
  }

  // Handle adding a new block
  function handleAddBlock(template: typeof BLOCK_TEMPLATES[0]) {
    const newBlock: VisualBlock = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      settings: { ...template.defaultSettings }
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
    triggerChange(newBlocks);
  }

  // Handle block removal
  function handleDeleteBlock(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(newBlocks.length > 0 ? newBlocks[0].id : null);
    }
    triggerChange(newBlocks);
  }

  // Reorder blocks (Up)
  function handleMoveUp(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    setBlocks(newBlocks);
    triggerChange(newBlocks);
  }

  // Reorder blocks (Down)
  function handleMoveDown(index: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    setBlocks(newBlocks);
    triggerChange(newBlocks);
  }

  // Edit settings
  function updateSetting(key: string, value: any) {
    if (!selectedBlockId) return;
    const newBlocks = blocks.map(b => {
      if (b.id === selectedBlockId) {
        return {
          ...b,
          settings: {
            ...b.settings,
            [key]: value
          }
        };
      }
      return b;
    });
    setBlocks(newBlocks);
    triggerChange(newBlocks);
  }

  // Edit deep array settings (e.g. pricing items or features grid)
  function updateListItemSetting(index: number, key: "title" | "description" | "extra", value: string) {
    if (!selectedBlockId) return;
    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block || !block.settings.items) return;

    const newItems = [...block.settings.items];
    newItems[index] = {
      ...newItems[index],
      [key]: value
    };

    updateSetting("items", newItems);
  }

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-slate-100 min-h-[750px] select-none">
      {/* Editor Header Bar */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase text-emerald-400">Webstudio Visual Designer</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">High-fidelity B2B modular engine &bull; Active & Live</p>
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 min-h-[650px] overflow-hidden">
        {/* Left Side: Blocks Library & Navigator */}
        <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/30">
          {/* Navigator Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Page Structure</span>
          </div>

          {/* Active Outline Navigator */}
          <div className="p-3 space-y-1.5 flex-1 overflow-y-auto max-h-[300px]">
            {blocks.length === 0 ? (
              <p className="text-[10px] text-slate-500 text-center py-4">Add your first section to start building</p>
            ) : (
              blocks.map((block, idx) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`group p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    selectedBlockId === block.id
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold truncate">
                    <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                    <span className="capitalize">{block.type.replace("-", " ")}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => handleMoveUp(idx, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === blocks.length - 1}
                      onClick={(e) => handleMoveDown(idx, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteBlock(block.id, e)}
                      className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Blocks Add Library */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/20 flex-1 overflow-y-auto max-h-[350px]">
            <div className="flex items-center gap-2 mb-3">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Add B2B Sections</span>
            </div>
            <div className="space-y-2">
              {BLOCK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.type}
                  type="button"
                  onClick={() => handleAddBlock(tmpl)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-emerald-500/30 text-slate-400 group-hover:text-emerald-400">
                    <Layout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-300 group-hover:text-emerald-300 capitalize">{tmpl.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 leading-normal">{tmpl.description || "Visual customizable template block."}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Live Layout Canvas Preview */}
        <div className="flex-1 bg-slate-950/60 p-8 overflow-y-auto flex flex-col justify-start relative select-text">
          <div className="max-w-4xl w-full mx-auto space-y-6">
            {blocks.length === 0 ? (
              <div className="text-center py-20 bg-slate-900/30 ghost-border rounded-2xl flex flex-col items-center">
                <Sparkles className="w-12 h-12 text-slate-600 mb-4 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-300">Your Canvas is Empty</h4>
                <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">Choose templates from the left sidebar to orchestrate your visual layout.</p>
              </div>
            ) : (
              blocks.map((block) => {
                const isSelected = selectedBlockId === block.id;
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`relative rounded-xl overflow-hidden transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.01]"
                        : "border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Visual Hover Label */}
                    <div className={`absolute top-3 left-4 z-10 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                      isSelected ? "bg-emerald-500 text-white" : "bg-slate-800/80 text-slate-400"
                    }`}>
                      {block.type.replace("-", " ")}
                    </div>

                    {/* Canvas Block Renderers */}
                    {block.type === "hero" && (
                      <div className="py-16 bg-slate-900 text-white px-8 relative overflow-hidden">
                        <div className="max-w-xl relative z-10 space-y-4">
                          {block.settings.badge && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">{block.settings.badge}</span>}
                          {block.settings.headline && <h2 className="text-3xl font-extrabold tracking-tight leading-tight">{block.settings.headline}</h2>}
                          {block.settings.subheadline && <p className="text-sm text-slate-400 leading-relaxed">{block.settings.subheadline}</p>}
                          {block.settings.ctaText && (
                            <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg px-5 py-2.5 text-xs shadow-md">
                              {block.settings.ctaText}
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/10 opacity-90 z-0"></div>
                      </div>
                    )}

                    {block.type === "logos" && (
                      <div className="py-8 bg-white border-y border-slate-100 text-center px-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-4">{block.settings.badge}</p>
                        <div className="flex flex-wrap items-center justify-center gap-6 opacity-60">
                          {block.settings.logos?.map((logo, i) => (
                            <span key={i} className="text-sm font-extrabold tracking-wider text-slate-800 italic">{logo}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === "features" && (
                      <div className="py-12 bg-slate-50 text-slate-900 px-6">
                        <div className="text-center max-w-xl mx-auto mb-8">
                          {block.settings.headline && <h3 className="text-xl font-bold tracking-tight text-slate-900">{block.settings.headline}</h3>}
                          {block.settings.subheadline && <p className="text-xs text-slate-500 mt-2">{block.settings.subheadline}</p>}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          {block.settings.items?.map((item, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm text-left">
                              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xs mb-4">0{idx + 1}</div>
                              <h4 className="text-sm font-bold text-slate-900 mb-2">{item.title}</h4>
                              <p className="text-slate-500 text-xs leading-normal">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === "case-study" && (
                      <div className="py-12 bg-slate-900 text-white px-8 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          {block.settings.badge && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block mb-2">{block.settings.badge}</span>}
                          {block.settings.headline && <h3 className="text-2xl font-bold tracking-tight leading-tight">{block.settings.headline}</h3>}
                          {block.settings.subheadline && <p className="text-xs text-slate-400 mt-4 leading-relaxed">{block.settings.subheadline}</p>}
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6 mt-6">
                            {block.settings.items?.map((item, idx) => (
                              <div key={idx}>
                                <div className="text-2xl font-extrabold text-emerald-400">{item.title}</div>
                                <div className="text-slate-400 text-[10px] mt-0.5">{item.description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-slate-850 p-6 rounded-lg border border-slate-800 shadow-md">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block mb-2">The Outcome</span>
                          {block.settings.text && <blockquote className="text-xs italic text-slate-200 mb-4">"{block.settings.text}"</blockquote>}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-xs text-white">VP</div>
                            <div>
                              {block.settings.ctaText && <div className="font-bold text-xs">{block.settings.ctaText}</div>}
                              {block.settings.ctaUrl && <div className="text-[10px] text-slate-400">{block.settings.ctaUrl}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "pricing" && (
                      <div className="py-12 bg-slate-50 text-slate-900 px-6">
                        <div className="text-center max-w-xl mx-auto mb-8">
                          {block.settings.headline && <h3 className="text-xl font-bold tracking-tight text-slate-900">{block.settings.headline}</h3>}
                          {block.settings.subheadline && <p className="text-xs text-slate-500 mt-2">{block.settings.subheadline}</p>}
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 items-stretch">
                          {block.settings.items?.map((item, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between text-left">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 mb-1">{item.title}</h4>
                                <div className="text-lg font-extrabold text-slate-900 mb-2">{item.description}</div>
                                <p className="text-slate-500 text-[10px] leading-normal">{item.extra}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === "team" && (
                      <div className="py-12 bg-slate-50 text-slate-900 px-6">
                        <div className="text-center max-w-xl mx-auto mb-8">
                          {block.settings.headline && <h3 className="text-xl font-bold tracking-tight text-slate-900">{block.settings.headline}</h3>}
                          {block.settings.subheadline && <p className="text-xs text-slate-500 mt-2">{block.settings.subheadline}</p>}
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                          {block.settings.items?.map((item, idx) => (
                            <div key={idx} className="text-center bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 text-sm font-bold">YM</div>
                              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                              <p className="text-[10px] text-emerald-600 font-bold tracking-wide uppercase mt-0.5">{item.description}</p>
                              <p className="text-slate-500 text-[10px] mt-2 leading-relaxed">{item.extra}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.type === "cta" && (
                      <div className="py-10 bg-emerald-600 text-white text-center px-6">
                        <div className="max-w-2xl mx-auto space-y-3">
                          {block.settings.headline && <h3 className="text-2xl font-bold tracking-tight">{block.settings.headline}</h3>}
                          {block.settings.subheadline && <p className="text-emerald-100 text-xs">{block.settings.subheadline}</p>}
                          {block.settings.ctaText && (
                            <span className="inline-block bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-lg text-xs shadow-md mt-4">
                              {block.settings.ctaText}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {block.type === "content" && (
                      <div className="py-12 bg-white text-slate-900 px-8">
                        <div className="max-w-2xl mx-auto space-y-4">
                          {block.settings.headline && <h3 className="text-2xl font-bold tracking-tight text-slate-900">{block.settings.headline}</h3>}
                          {block.settings.text && <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{block.settings.text}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Block Inspector */}
        <div className="w-80 border-l border-slate-800 flex flex-col bg-slate-950/30">
          {/* Inspector Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              type="button"
              onClick={() => setInspectorTab("content")}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                inspectorTab === "content" ? "bg-slate-900 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Content
            </button>
            <button
              type="button"
              onClick={() => setInspectorTab("style")}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                inspectorTab === "style" ? "bg-slate-900 text-emerald-400 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              Layout Style
            </button>
          </div>

          {/* Inspector Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[600px]">
            {!selectedBlock ? (
              <div className="text-center py-20 text-slate-500 text-xs">
                <Settings className="w-8 h-8 text-slate-600 mx-auto mb-3 animate-spin" />
                Select a block on the canvas to configure it
              </div>
            ) : inspectorTab === "content" ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{selectedBlock.type}</span>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {selectedBlock.id.slice(0, 8)}</span>
                </div>

                {/* Common Badge Input */}
                {selectedBlock.settings.badge !== undefined && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category Badge</label>
                    <input
                      type="text"
                      value={selectedBlock.settings.badge}
                      onChange={(e) => updateSetting("badge", e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500"
                    />
                  </div>
                )}

                {/* Common Headline Input */}
                {selectedBlock.settings.headline !== undefined && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Headline text</label>
                    <textarea
                      value={selectedBlock.settings.headline}
                      onChange={(e) => updateSetting("headline", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500 resize-none leading-normal"
                    />
                  </div>
                )}

                {/* Common Subheadline Input */}
                {selectedBlock.settings.subheadline !== undefined && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subheadline description</label>
                    <textarea
                      value={selectedBlock.settings.subheadline}
                      onChange={(e) => updateSetting("subheadline", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500 resize-none leading-normal"
                    />
                  </div>
                )}

                {/* Common Body Text Input */}
                {selectedBlock.settings.text !== undefined && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Body Prose Text</label>
                    <textarea
                      value={selectedBlock.settings.text}
                      onChange={(e) => updateSetting("text", e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500 resize-none leading-normal"
                    />
                  </div>
                )}

                {/* Common Call to Action Settings */}
                {selectedBlock.settings.ctaText !== undefined && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Call to Action Link</span>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">CTA Text</label>
                      <input
                        type="text"
                        value={selectedBlock.settings.ctaText}
                        onChange={(e) => updateSetting("ctaText", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1.5">CTA Redirect URL / Path</label>
                      <input
                        type="text"
                        value={selectedBlock.settings.ctaUrl}
                        onChange={(e) => updateSetting("ctaUrl", e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* List Items Editor (Pricing cards, feature grids, outline items) */}
                {selectedBlock.settings.items !== undefined && (
                  <div className="space-y-4 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Grid Elements Editor</span>
                    {selectedBlock.settings.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-emerald-400">Item #{idx + 1}</span>
                        <div>
                          <input
                            type="text"
                            value={item.title}
                            placeholder="Title"
                            onChange={(e) => updateListItemSetting(idx, "title", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-100"
                          />
                        </div>
                        <div>
                          <textarea
                            value={item.description}
                            placeholder="Description"
                            rows={2}
                            onChange={(e) => updateListItemSetting(idx, "description", e.target.value)}
                            className="w-full px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-100 resize-none leading-normal"
                          />
                        </div>
                        {item.extra !== undefined && (
                          <div>
                            <input
                              type="text"
                              value={item.extra}
                              placeholder="Extra / Label details"
                              onChange={(e) => updateListItemSetting(idx, "extra", e.target.value)}
                              className="w-full px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-100"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visual Styling Options</span>
                
                {/* Background Styling Preset */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Background Preset</label>
                  <select
                    value={selectedBlock.settings.bgStyle || "white"}
                    onChange={(e) => updateSetting("bgStyle", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500"
                  >
                    <option value="slate">Dark Slate (Premium)</option>
                    <option value="white">Pure White (Clean)</option>
                    <option value="light">Off-White / Soft Light</option>
                    <option value="emerald">Vibrant Emerald Green</option>
                  </select>
                </div>

                {/* Padding Spacing Preset */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Vertical Spacing (Padding)</label>
                  <select
                    value={selectedBlock.settings.paddingStyle || "medium"}
                    onChange={(e) => updateSetting("paddingStyle", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500"
                  >
                    <option value="large">Spacious (py-24 / py-32)</option>
                    <option value="medium">Standard (py-20 / py-16)</option>
                    <option value="small">Compact (py-12 / py-8)</option>
                  </select>
                </div>

                {/* Text Alignment Preset */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Alignment</label>
                  <select
                    value={selectedBlock.settings.textAlign || "left"}
                    onChange={(e) => updateSetting("textAlign", e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:border-emerald-500"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Asset Picker Modal */}
      <AssetPicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false);
          setActiveAssetField(null);
        }}
        onSelect={(url) => {
          if (activeAssetField) {
            updateSetting(activeAssetField.key, url);
          }
          setPickerOpen(false);
          setActiveAssetField(null);
        }}
      />
    </div>
  );
}

/**
 * Visual Webstudio Block compiler.
 * Iterates through the list of visual block nodes, builds optimized premium Tailwind CSS and HTML structure,
 * and compiles it directly to a zero-dependency static HTML sheet.
 */
function compileWebstudioToHtml(blocks: VisualBlock[]): string {
  let htmlString = "";

  blocks.forEach((block) => {
    // Spacing utilities
    const paddingClass = 
      block.settings.paddingStyle === "large" ? "py-24 md:py-32" :
      block.settings.paddingStyle === "small" ? "py-12" : "py-20";

    // Text alignment utilities
    const alignClass = 
      block.settings.textAlign === "center" ? "text-center items-center justify-center mx-auto" :
      block.settings.textAlign === "right" ? "text-right items-end ml-auto" : "text-left items-start";

    const alignTextOnly = 
      block.settings.textAlign === "center" ? "text-center" :
      block.settings.textAlign === "right" ? "text-right" : "text-left";

    // Background preset utilities
    const bgClass =
      block.settings.bgStyle === "slate" ? "bg-slate-900 text-white relative overflow-hidden" :
      block.settings.bgStyle === "light" ? "bg-slate-50 text-slate-900" :
      block.settings.bgStyle === "emerald" ? "bg-emerald-600 text-white" : "bg-white text-slate-900";

    // 1. Enterprise Hero Renderer
    if (block.type === "hero") {
      htmlString += `
      <section class="${paddingClass} ${bgClass}">
        <div class="max-w-6xl mx-auto px-8 flex flex-col ${alignClass} relative z-10">
          ${block.settings.badge ? `<span class="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-4">${block.settings.badge}</span>` : ""}
          ${block.settings.headline ? `<h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">${block.settings.headline}</h1>` : ""}
          ${block.settings.subheadline ? `<p class="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">${block.settings.subheadline}</p>` : ""}
          ${block.settings.ctaText && block.settings.ctaUrl ? `
          <a href="${block.settings.ctaUrl}" class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-lg px-8 py-4 shadow-lg transition-all transform hover:scale-[1.02]">
            ${block.settings.ctaText}
          </a>` : ""}
        </div>
        <div class="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950/20 opacity-90 z-0"></div>
      </section>
      `;
    }

    // 2. Partner Logo Cloud Renderer
    else if (block.type === "logos") {
      htmlString += `
      <section class="${paddingClass} ${bgClass} border-y border-slate-100 text-center">
        <div class="max-w-6xl mx-auto px-8">
          ${block.settings.badge ? `<p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">${block.settings.badge}</p>` : ""}
          <div class="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60">
            ${block.settings.logos?.map(logo => `<span class="text-2xl font-extrabold tracking-wider text-slate-800 italic">${logo}</span>`).join("")}
          </div>
        </div>
      </section>
      `;
    }

    // 3. Core Offerings Grid Renderer
    else if (block.type === "features") {
      htmlString += `
      <section class="${paddingClass} ${bgClass}">
        <div class="max-w-6xl mx-auto px-8">
          <div class="text-center max-w-2xl mx-auto mb-16">
            ${block.settings.headline ? `<h2 class="text-4xl font-bold tracking-tight mb-4">${block.settings.headline}</h2>` : ""}
            ${block.settings.subheadline ? `<p class="text-slate-600">${block.settings.subheadline}</p>` : ""}
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            ${block.settings.items?.map((item, idx) => `
            <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl mb-6">0${idx + 1}</div>
              <h3 class="text-xl font-bold mb-3">${item.title}</h3>
              <p class="text-slate-600 text-sm leading-relaxed">${item.description}</p>
            </div>`).join("")}
          </div>
        </div>
      </section>
      `;
    }

    // 4. Case Study Spotlight Renderer
    else if (block.type === "case-study") {
      htmlString += `
      <section class="${paddingClass} ${bgClass}">
        <div class="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            ${block.settings.badge ? `<span class="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-3 block">${block.settings.badge}</span>` : ""}
            ${block.settings.headline ? `<h2 class="text-4xl font-bold tracking-tight mb-6">${block.settings.headline}</h2>` : ""}
            ${block.settings.subheadline ? `<p class="text-slate-300 leading-relaxed mb-8">${block.settings.subheadline}</p>` : ""}
            <div class="grid grid-cols-2 gap-6 border-t border-slate-800 pt-8">
              ${block.settings.items?.map(item => `
              <div>
                <div class="text-3xl font-extrabold text-emerald-400">${item.title}</div>
                <div class="text-slate-400 text-xs mt-1">${item.description}</div>
              </div>`).join("")}
            </div>
          </div>
          <div class="bg-slate-800/40 p-8 rounded-xl border border-slate-800 shadow-xl">
            <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-2">The Outcome</span>
            ${block.settings.text ? `<blockquote class="text-lg italic text-slate-100 mb-6">"${block.settings.text}"</blockquote>` : ""}
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-sm text-white">VP</div>
              <div>
                ${block.settings.ctaText ? `<div class="font-bold text-sm">${block.settings.ctaText}</div>` : ""}
                ${block.settings.ctaUrl ? `<div class="text-xs text-slate-400">${block.settings.ctaUrl}</div>` : ""}
              </div>
            </div>
          </div>
        </div>
      </section>
      `;
    }

    // 5. 3-Tier Pricing Model Renderer
    else if (block.type === "pricing") {
      htmlString += `
      <section class="${paddingClass} ${bgClass}">
        <div class="max-w-6xl mx-auto px-8">
          <div class="text-center max-w-2xl mx-auto mb-16">
            ${block.settings.headline ? `<h2 class="text-4xl font-bold tracking-tight mb-4">${block.settings.headline}</h2>` : ""}
            ${block.settings.subheadline ? `<p class="text-slate-600">${block.settings.subheadline}</p>` : ""}
          </div>
          <div class="grid md:grid-cols-3 gap-8 items-stretch">
            ${block.settings.items?.map((item, idx) => {
              const isPopular = idx === 1;
              return `
              <div class="bg-white p-8 rounded-xl shadow-sm border ${isPopular ? "border-2 border-emerald-500 relative" : "border-slate-100"} flex flex-col justify-between">
                ${isPopular ? `<div class="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">Most Popular</div>` : ""}
                <div>
                  <h3 class="text-lg font-bold mb-2 ${isPopular ? "text-emerald-600" : ""}">${item.title}</h3>
                  <div class="text-3xl font-extrabold text-slate-900 mb-4">${item.description}</div>
                  <p class="text-slate-500 text-xs leading-normal mb-8">${item.extra}</p>
                </div>
                <a href="/contact" class="block text-center ${isPopular ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-800"} font-bold py-3 rounded-lg text-sm shadow-sm">
                  Get Started
                </a>
              </div>`;
            }).join("")}
          </div>
        </div>
      </section>
      `;
    }

    // 6. Team Grid Showcase Renderer
    else if (block.type === "team") {
      htmlString += `
      <section class="${paddingClass} ${bgClass}">
        <div class="max-w-6xl mx-auto px-8">
          <div class="text-center max-w-2xl mx-auto mb-16">
            ${block.settings.headline ? `<h2 class="text-3xl font-bold tracking-tight mb-4">${block.settings.headline}</h2>` : ""}
            ${block.settings.subheadline ? `<p class="text-slate-600">${block.settings.subheadline}</p>` : ""}
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            ${block.settings.items?.map(item => `
            <div class="text-center">
              <div class="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-6 flex items-center justify-center text-slate-400 text-xl font-bold">
                ${item.title.split(" ").map(w => w[0]).join("")}
              </div>
              <h4 class="text-lg font-bold">${item.title}</h4>
              <p class="text-xs text-emerald-600 font-bold tracking-wide uppercase mt-1">${item.description}</p>
              <p class="text-xs text-slate-500 max-w-xs mx-auto mt-3 leading-relaxed">${item.extra}</p>
            </div>`).join("")}
          </div>
        </div>
      </section>
      `;
    }

    // 7. Call to Action Bar Renderer
    else if (block.type === "cta") {
      htmlString += `
      <section class="${paddingClass} ${bgClass} text-center">
        <div class="max-w-4xl mx-auto px-8">
          ${block.settings.headline ? `<h2 class="text-3xl font-bold mb-4">${block.settings.headline}</h2>` : ""}
          ${block.settings.subheadline ? `<p class="text-emerald-100 mb-8 max-w-xl mx-auto">${block.settings.subheadline}</p>` : ""}
          ${block.settings.ctaText && block.settings.ctaUrl ? `
          <a href="${block.settings.ctaUrl}" class="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-8 py-4 rounded-lg shadow-md transition-colors inline-block">
            ${block.settings.ctaText}
          </a>` : ""}
        </div>
      </section>
      `;
    }

    // 8. Typography Prose Renderer
    else if (block.type === "content") {
      htmlString += `
      <section class="${paddingClass} ${bgClass}">
        <div class="max-w-2xl mx-auto px-8 ${alignTextOnly}">
          ${block.settings.headline ? `<h2 class="text-3xl font-bold mb-6 text-slate-900">${block.settings.headline}</h2>` : ""}
          ${block.settings.text ? `<p class="text-slate-600 leading-relaxed whitespace-pre-line">${block.settings.text}</p>` : ""}
        </div>
      </section>
      `;
    }
  });

  return htmlString;
}
