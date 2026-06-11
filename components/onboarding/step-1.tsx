"use client";

import { Button } from "@/components/ui/button";

interface Step1Props {
  name: string;
  age: string;
  onChange: (field: "name" | "age", value: string) => void;
  onNext: () => void;
}

export function OnboardingStep1({ name, age, onChange, onNext }: Step1Props) {
  const isValid =
    name.trim().length > 0 && age.trim().length > 0 && parseInt(age) >= 18;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          What&apos;s your name?
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="e.g., Sarah"
          className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          How old are you?
        </label>
        <input
          type="number"
          value={age}
          onChange={(e) => onChange("age", e.target.value)}
          placeholder="e.g., 28"
          min="18"
          className="w-full px-4 py-3 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {age && parseInt(age) < 18 && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">
            You must be at least 18 years old
          </p>
        )}
      </div>

      <Button onClick={onNext} disabled={!isValid} className="w-full">
        Continue
      </Button>
    </div>
  );
}
