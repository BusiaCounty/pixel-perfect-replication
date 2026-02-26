/**
 * Home page configuration stored in localStorage.
 * Index.tsx reads this and applies it at runtime.
 */
export interface HomePageConfig {
  // Brand
  siteName: string;
  tagline: string;
  logoType: "icon" | "text" | "both";

  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroPrimaryBtnText: string;
  heroSecondaryBtnText: string;
  heroLayout: "centered" | "left-aligned";

  // Colors (HSL values used in CSS variables)
  primaryColor: string;    // hex for picker, converted to HSL on apply
  secondaryColor: string;
  accentColor: string;
  heroGradientFrom: string;
  heroGradientTo: string;

  // Typography
  bodyFont: string;
  headingFont: string;
  baseFontSize: "sm" | "md" | "lg";

  // Footer
  footerText: string;

  // Sections visibility
  showStats: boolean;
  showFlagship: boolean;
  showDepartments: boolean;
}

export const DEFAULT_HOME_CONFIG: HomePageConfig = {
  siteName: "County PMTS",
  tagline: "",
  logoType: "both",

  heroTitle: "County Project Management & Tracking System",
  heroSubtitle:
    "Real-time visibility into county development projects. Track progress, budgets, and outcomes across all departments and wards.",
  heroBadgeText: "Transparency · Accountability · Efficiency",
  heroPrimaryBtnText: "Browse All Projects",
  heroSecondaryBtnText: "Staff Login",
  heroLayout: "centered",

  primaryColor: "#1e3a5f",
  secondaryColor: "#2d8c7b",
  accentColor: "#f59e0b",
  heroGradientFrom: "#1a2f52",
  heroGradientTo: "#2d8c7b",

  bodyFont: "Inter",
  headingFont: "Playfair Display",
  baseFontSize: "md",

  footerText: "© 2026 County Government. Project Management & Tracking System.",

  showStats: true,
  showFlagship: true,
  showDepartments: true,
};

const STORAGE_KEY = "pmts_home_config";

export function loadHomeConfig(): HomePageConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HOME_CONFIG;
    return { ...DEFAULT_HOME_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_HOME_CONFIG;
  }
}

export function saveHomeConfig(cfg: HomePageConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

/** Convert #rrggbb → "H S% L%" string for CSS HSL variables */
export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Apply a HomePageConfig to the document root's CSS custom properties */
export function applyHomeConfig(cfg: HomePageConfig): void {
  const root = document.documentElement;

  root.style.setProperty("--primary", hexToHsl(cfg.primaryColor));
  root.style.setProperty("--secondary", hexToHsl(cfg.secondaryColor));
  root.style.setProperty("--accent", hexToHsl(cfg.accentColor));
  root.style.setProperty(
    "--hero-gradient",
    `linear-gradient(135deg, ${cfg.heroGradientFrom}, ${cfg.heroGradientTo})`
  );

  // Font size multiplier
  const sizeMap = { sm: "14px", md: "16px", lg: "18px" };
  root.style.setProperty("--base-font-size", sizeMap[cfg.baseFontSize]);
  document.body.style.fontSize = sizeMap[cfg.baseFontSize];

  // Font families (Google Fonts must already be loaded)
  document.body.style.fontFamily = `'${cfg.bodyFont}', system-ui, sans-serif`;
}
