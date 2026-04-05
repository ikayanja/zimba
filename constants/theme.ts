export const theme = {
  colors: {
    bgTop: "#fbfbf7",
    bgBottom: "#f1f1ec",
    surface: "#ffffff",
    surfaceStrong: "#f4f4ee",
    surfaceSoft: "#ebebe5",
    border: "rgba(23, 34, 18, 0.1)",
    borderStrong: "rgba(23, 34, 18, 0.18)",
    text: "#1b2418",
    textMuted: "#8b9488",
    textSoft: "#5a6456",
    success: "#aaf57f",
    successDeep: "#97e56f",
    emerald: "#1e3713",
    cyan: "#42533a",
    plum: "#72806c",
    rose: "#a1a99d",
    shadow: "#000000",
  },
  radius: {
    xl: 28,
    lg: 22,
    md: 18,
    pill: 999,
  },
};

export const glass = {
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  soft: {
    backgroundColor: theme.colors.surfaceSoft,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
};
