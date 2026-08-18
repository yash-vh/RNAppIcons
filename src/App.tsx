import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import type { IconProject, IconShape, IconVariant } from "./shapes/types";
import { createVariant, SHAPE_REGISTRY } from "./shapes/registry";
import { buildProjectZip, downloadZip } from "./shapes/export";
import { loadImage } from "./shapes/render";
import { deletePreset, loadPresets, savePreset, type PresetConfig, type SavedPreset } from "./shapes/presets";
import ShapeSelector from "./components/ShapeSelector";
import VariantEditor from "./components/VariantEditor";
import GeneratedGrid from "./components/GeneratedGrid";
import ExportPanel from "./components/ExportPanel";
import Header from "./components/Header";
import PlatformPreview from "./components/PlatformPreview";
import PresetBar from "./components/PresetBar";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const DEFAULT_SHAPES: IconShape[] = ["original", "round"];

function initialProject(): IconProject {
  return {
    variants: DEFAULT_SHAPES.map((s) => createVariant(s as keyof typeof SHAPE_REGISTRY)),
    android: { legacy: true, adaptive: true, themed: false, notification: false, playStore: false },
    ios: { enabled: true, dark: false, tinted: false },
    web: { enabled: false },
    sourceImage: null,
  };
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function App() {
  const [project, setProject] = useState<IconProject>(initialProject);
  const [advanced, setAdvanced] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState(project.variants[0].id);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<{ totalFiles: number; sizeLabel: string } | null>(null);
  const [rnPresetApplied, setRnPresetApplied] = useState(true);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [presets, setPresets] = useState<SavedPreset[]>(() => loadPresets());
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const selectedShapes = useMemo(() => new Set(project.variants.map((v) => v.shape)), [project.variants]);
  const regularVariant = project.variants.find((v) => v.shape === "original");
  const roundVariant = project.variants.find((v) => v.shape === "round");
  const enabledCount = project.variants.filter((v) => v.enabled).length;

  const onUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProject((p) => ({ ...p, sourceImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const toggleShape = (shape: IconShape) => {
    setProject((p) => {
      const exists = p.variants.find((v) => v.shape === shape);
      if (exists) {
        const remainingEnabled = p.variants.filter((v) => v.id !== exists.id && v.enabled).length;
        if (exists.enabled && remainingEnabled === 0) {
          setNotice("At least one shape variant is required.");
          return p;
        }
        return { ...p, variants: p.variants.filter((v) => v.shape !== shape) };
      }
      const v = createVariant(shape as keyof typeof SHAPE_REGISTRY);
      setActiveVariantId(v.id);
      return { ...p, variants: [...p.variants, v] };
    });
  };

  const selectAllShapes = () => {
    setProject((p) => {
      const existingShapes = new Set(p.variants.map((v) => v.shape));
      const added = Object.keys(SHAPE_REGISTRY)
        .filter((s) => !existingShapes.has(s as IconShape))
        .map((s) => createVariant(s as keyof typeof SHAPE_REGISTRY));
      return { ...p, variants: [...p.variants, ...added] };
    });
  };

  const updateVariant = (id: string, patch: Partial<IconVariant>) => {
    setProject((p) => ({
      ...p,
      variants: p.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }));
  };

  const toggleEnabled = (id: string) => {
    setProject((p) => {
      const target = p.variants.find((v) => v.id === id);
      if (target?.enabled && enabledCount === 1) {
        setNotice("At least one shape variant is required.");
        return p;
      }
      return { ...p, variants: p.variants.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)) };
    });
  };

  const copyFromRegular = (id: string) => {
    const regular = project.variants.find((v) => v.shape === "original");
    if (!regular) return;
    updateVariant(id, {
      scale: regular.scale,
      padding: regular.padding,
      background: { ...regular.background },
      border: regular.border ? { ...regular.border } : undefined,
      shadow: regular.shadow ? { ...regular.shadow } : undefined,
    });
  };

  const applyReactNativePreset = () => {
    setProject((p) => ({
      ...p,
      variants: DEFAULT_SHAPES.map((s) => p.variants.find((v) => v.shape === s) ?? createVariant(s as keyof typeof SHAPE_REGISTRY)),
      android: { ...p.android, legacy: true, adaptive: true },
    }));
    setRnPresetApplied(true);
  };

  const handleGenerate = async () => {
    if (!project.sourceImage) return;
    setGenerating(true);
    try {
      const img = await loadImage(project.sourceImage);
      const { blob, summary: s } = await buildProjectZip(project, img);
      downloadZip(blob, "app-icons.zip");
      setSummary({ totalFiles: s.totalFiles, sizeLabel: formatSize(blob.size) });
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePreset = (name: string) => {
    const { sourceImage, ...config } = project;
    void sourceImage;
    setPresets(savePreset(name, config as PresetConfig));
    setNotice(`Preset "${name}" saved.`);
  };

  const handleLoadPreset = (id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setProject((p) => ({ ...preset.config, sourceImage: p.sourceImage }));
    setActiveVariantId(preset.config.variants[0]?.id ?? "");
    setNotice(`Preset "${preset.name}" loaded — upload a logo to render it.`);
  };

  const handleDeletePreset = (id: string) => {
    setPresets(deletePreset(id));
  };

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />

      <div className="app-body">
        <div className="workspace">
          <aside className="sidebar">
            <section className="upload-section">
              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) onUpload(file);
                }}
              >
                {project.sourceImage ? (
                  <img src={project.sourceImage} alt="source" className="upload-preview" />
                ) : (
                  <span>Drop your logo here, or click to upload</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                hidden
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />

              <button className="btn-secondary" onClick={applyReactNativePreset}>
                Use React Native Preset
              </button>
              {rnPresetApplied && (
                <p className="hint">
                  Android React Native projects commonly reference both regular and round launcher resources.
                </p>
              )}
            </section>

            <PresetBar presets={presets} onSave={handleSavePreset} onLoad={handleLoadPreset} onDelete={handleDeletePreset} />

            {!advanced ? (
              <section className="simple-section">
                <h2>Icon Shape</h2>
                <div className="simple-list">
                  {project.variants.map((v) => (
                    <div key={v.id} className="simple-item">
                      ✓ {v.name}
                    </div>
                  ))}
                </div>
                <button className="btn-link" onClick={() => setAdvanced(true)}>
                  + Add Variant
                </button>
              </section>
            ) : (
              <ShapeSelector
                imageSrc={project.sourceImage}
                selectedShapes={selectedShapes}
                onToggle={toggleShape}
                onSelectAll={selectAllShapes}
              />
            )}

            {project.variants.length > 0 && (
              <VariantEditor
                variants={project.variants}
                activeId={project.variants.find((v) => v.id === activeVariantId) ? activeVariantId : project.variants[0].id}
                onSelectTab={setActiveVariantId}
                onChange={updateVariant}
                onCopyFromRegular={copyFromRegular}
                imageSrc={project.sourceImage}
              />
            )}
          </aside>

          <main className="canvas-area">
            {notice && <div className="notice-banner">{notice}</div>}

            <PlatformPreview imageSrc={project.sourceImage} regular={regularVariant} round={roundVariant} appName="RniconHub" />

            <GeneratedGrid
              variants={project.variants}
              imageSrc={project.sourceImage}
              onToggleEnabled={toggleEnabled}
              onEdit={(id) => setActiveVariantId(id)}
            />

            {!project.sourceImage && <div className="upload-nudge">Upload a source image to enable generation.</div>}
          </main>
        </div>

        <ExportPanel
          project={project}
          imageSrc={project.sourceImage}
          regularVariant={regularVariant}
          onChangeAndroid={(patch) => setProject((p) => ({ ...p, android: { ...p.android, ...patch } }))}
          onChangeIos={(patch) => setProject((p) => ({ ...p, ios: { ...p.ios, ...patch } }))}
          onChangeWeb={(patch) => setProject((p) => ({ ...p, web: { ...p.web, ...patch } }))}
          onGenerate={handleGenerate}
          generating={generating}
          summary={summary}
        />
      </div>
    </div>
  );
}
