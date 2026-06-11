"use client";

import { Button } from "@/components/ui/button";
import { languages } from "@/lib/mock-data";

interface Step2Props {
  nativeLanguage: string;
  learningLanguages: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (field: "nativeLanguage" | "learningLanguages", value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingStep2({
  nativeLanguage,
  learningLanguages,
  onChange,
  onNext,
  onBack,
}: Step2Props) {
  const toggleLanguage = (lang: string) => {
    const updated = learningLanguages.includes(lang)
      ? learningLanguages.filter((l) => l !== lang)
      : [...learningLanguages, lang];
    onChange("learningLanguages", updated);
  };

  const isValid = nativeLanguage && learningLanguages.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">
          What&apos;s your native language?
        </label>
        <select
          value={nativeLanguage}
          onChange={(e) => onChange("nativeLanguage", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a language</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">
          Which languages do you want to learn? (Select at least 1)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {languages
            .filter((lang) => lang !== nativeLanguage)
            .map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-4 py-2 rounded-lg border transition-colors font-medium text-sm ${
                  learningLanguages.includes(lang)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-card hover:border-primary"
                }`}
              >
                {lang}
              </button>
            ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
