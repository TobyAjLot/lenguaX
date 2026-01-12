/**
 * Language codes and display names
 * ISO 639-1 two-letter codes
 */
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "vi", name: "Vietnamese" },
  { code: "th", name: "Thai" },
  { code: "id", name: "Indonesian" },
  { code: "he", name: "Hebrew" },
] as const;

/**
 * Get language name from code
 */
export function getLanguageName(code: string): string {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang?.name || code.toUpperCase();
}

/**
 * Format an array of language codes into readable text
 */
export function formatLanguages(codes: string[]): string {
  if (!codes || codes.length === 0) return "None";
  return codes.map(getLanguageName).join(", ");
}
