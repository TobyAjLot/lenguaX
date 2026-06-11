"use client";

import { Button } from "@/components/ui/button";
import { interests } from "@/lib/mock-data";

interface Step3Props {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingStep3({
  selectedInterests,
  onChange,
  onNext,
  onBack,
}: Step3Props) {
  const toggleInterest = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">
          What are your interests? (Select at least 2)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-lg border transition-colors font-medium text-sm ${
                selectedInterests.includes(interest)
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border bg-card hover:border-accent"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        {selectedInterests.length < 2 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Please select at least 2 interests
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedInterests.length < 2}
          className="flex-1"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
