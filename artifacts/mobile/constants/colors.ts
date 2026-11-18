/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#17372E',
    tint: '#176C50',

    // Core surfaces
    background: '#F7F6F0',
    foreground: '#17372E',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#17372E',

    // Primary action color (buttons, links, active states)
    primary: '#176C50',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E8F1EA',
    secondaryForeground: '#214B3B',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#EEF0E9',
    mutedForeground: '#68776D',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F4C550',
    accentForeground: '#22392F',

    // Destructive actions (delete, error states)
    destructive: '#C45044',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#E1E7DF',
    input: '#D7E1D8',
    success: '#2D8C63',
    successSoft: '#E4F3E8',
    warning: '#D69C27',
    warningSoft: '#F7EFD7',
    codeSurface: '#183C30',
    codeText: '#F4F2E6',
    codeMuted: '#BBD2C4',
    certificatePaper: '#FFFDF7',
    certificateBorder: '#E9DDAE',
  },
  dark: {
    text: '#F2F4E9',
    tint: '#75C49A',
    background: '#11271F',
    foreground: '#F2F4E9',
    card: '#1B352A',
    cardForeground: '#F2F4E9',
    primary: '#75C49A',
    primaryForeground: '#10271E',
    secondary: '#254638',
    secondaryForeground: '#E5F3E8',
    muted: '#263A31',
    mutedForeground: '#A8B7AB',
    accent: '#F4C550',
    accentForeground: '#22392F',
    destructive: '#E7786A',
    destructiveForeground: '#FFFFFF',
    border: '#355143',
    input: '#476251',
    success: '#75C49A',
    successSoft: '#244734',
    warning: '#F1C25C',
    warningSoft: '#493C20',
    codeSurface: '#0A1D16',
    codeText: '#F4F2E6',
    codeMuted: '#BBD2C4',
    certificatePaper: '#20382C',
    certificateBorder: '#566543',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 22,
};

export default colors;
