export type ThemeKey = "romantic" | "classic" | "modern" | "nature"

export type ThemeDefinition = {
  key: ThemeKey
  label: string
  description: string
  primary: string        // Tailwind class for primary color
  primaryHex: string     // Hex for inline styles / CSS vars
  accent: string         // Tailwind class for accent bg
  accentHex: string
  progressBar: string    // Tailwind bg class for progress bar
  buttonClass: string    // Tailwind classes for primary buttons
  headerGradient: string // CSS gradient for header fallback
  swatchColors: [string, string] // Two colors for the swatch preview
}

export const themes: Record<ThemeKey, ThemeDefinition> = {
  romantic: {
    key: "romantic",
    label: "Romantisch",
    description: "Zachte roze en rozen tinten",
    primary: "text-rose-500",
    primaryHex: "#f43f5e",
    accent: "bg-rose-100",
    accentHex: "#ffe4e6",
    progressBar: "bg-rose-500",
    buttonClass: "bg-rose-500 hover:bg-rose-600 text-white",
    headerGradient: "linear-gradient(135deg, #ffe4e6, #fecdd3)",
    swatchColors: ["#f43f5e", "#ffe4e6"],
  },
  classic: {
    key: "classic",
    label: "Klassiek",
    description: "Navy en goud, elegant",
    primary: "text-blue-900",
    primaryHex: "#1e3a5f",
    accent: "bg-amber-100",
    accentHex: "#fef3c7",
    progressBar: "bg-blue-900",
    buttonClass: "bg-blue-900 hover:bg-blue-800 text-white",
    headerGradient: "linear-gradient(135deg, #fef3c7, #dbeafe)",
    swatchColors: ["#1e3a5f", "#fef3c7"],
  },
  modern: {
    key: "modern",
    label: "Modern",
    description: "Strak zwart-wit minimalistisch",
    primary: "text-zinc-900",
    primaryHex: "#18181b",
    accent: "bg-zinc-100",
    accentHex: "#f4f4f5",
    progressBar: "bg-zinc-900",
    buttonClass: "bg-zinc-900 hover:bg-zinc-800 text-white",
    headerGradient: "linear-gradient(135deg, #f4f4f5, #e4e4e7)",
    swatchColors: ["#18181b", "#f4f4f5"],
  },
  nature: {
    key: "nature",
    label: "Natuur",
    description: "Salie groen en aardse tinten",
    primary: "text-emerald-700",
    primaryHex: "#047857",
    accent: "bg-emerald-50",
    accentHex: "#ecfdf5",
    progressBar: "bg-emerald-700",
    buttonClass: "bg-emerald-700 hover:bg-emerald-800 text-white",
    headerGradient: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
    swatchColors: ["#047857", "#ecfdf5"],
  },
}

export const themeKeys = Object.keys(themes) as ThemeKey[]

export function getTheme(key: string | null | undefined): ThemeDefinition {
  if (key && key in themes) return themes[key as ThemeKey]
  return themes.romantic
}
