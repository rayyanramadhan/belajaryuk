/**
 * Design tokens for belajaryuk, mirrored from the "belajaryuk Design System"
 * artifact (slug 6b5c9ba9-3d50-48e2-9bff-176c31ee3c6c) — project/tokens.json.
 *
 * Every screen should pull colors/type/spacing/radius from here instead of
 * hardcoding values, so a token change only needs to happen in one place.
 */

export const colors = {
  ink: "#231A33",
  paper: "#FAF7F2",
  surface: "#FFFFFF",
  mist: "#E8E3DA",
  brand: "#4F3FF0",
  brandPressed: "#3B2FC0",
  english: "#FF6B3D",
  englishTint: "#FFE9DF",
  parenting: "#3E7A5D",
  parentingTint: "#E3EEE7",
  error: "#C23B3B",
  muted: "#6B6275",
} as const;

export const fontFamily = {
  // Plus Jakarta Sans is loaded via useFonts in the root layout; this name
  // must match the key passed to Font.loadAsync there.
  sans: "PlusJakartaSans",
} as const;

export type TextStyleName =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "bodyLg"
  | "body"
  | "bodyMedium"
  | "label"
  | "caption";

export const type: Record<
  TextStyleName,
  { fontSize: number; lineHeight: number; fontWeight: "400" | "500" | "600" | "700" | "800" }
> = {
  display: { fontSize: 40, lineHeight: 48, fontWeight: "800" },
  h1: { fontSize: 30, lineHeight: 38, fontWeight: "700" },
  h2: { fontSize: 23, lineHeight: 30, fontWeight: "700" },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "600" },
  bodyLg: { fontSize: 18, lineHeight: 27, fontWeight: "400" },
  body: { fontSize: 16, lineHeight: 24, fontWeight: "400" },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: "500" },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 10,
  md: 12,
  lg: 16,
} as const;

export const shadow = {
  card: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  focus: {
    // RN has no box-shadow ring; consumers apply a colored border instead
    // (see Input.tsx) to approximate the web shadow-focus token.
  },
} as const;
