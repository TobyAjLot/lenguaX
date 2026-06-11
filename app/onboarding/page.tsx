"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { OnboardingStep1 } from "@/components/onboarding/step-1";
import { OnboardingStep2 } from "@/components/onboarding/step-2";
import { OnboardingStep3 } from "@/components/onboarding/step-3";
import { OnboardingData } from "@/types";
import { useToast } from "@/lib/toast-context";

export default function OnboardingPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<OnboardingData>({
    step: 1,
    name: "",
    age: 0,
    nativeLanguage: "",
    learningLanguages: [],
    interests: [],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (field: string, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!data.name.trim()) {
        addToast("Please enter your name", "warning");
        return;
      }
      if (!data.age || data.age < 18) {
        addToast("You must be at least 18 years old", "warning");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!data.nativeLanguage || data.learningLanguages.length === 0) {
        addToast(
          "Please select your native language and at least one learning language",
          "warning",
        );
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (data.interests.length < 2) {
        addToast("Please select at least 2 interests", "warning");
        return;
      }
      // Complete onboarding
      addToast("Welcome to LenguaX!", "success");
      localStorage.setItem("onboardingCompleted", "true");
      router.push("/dashboard");
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStep((step - 1) as any);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 h-16 border-b border-border bg-card">
        <Link href="/" className="font-bold text-xl text-primary">
          LenguaX
        </Link>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Step {step} of 3</div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Languages"}
              {step === 3 && "Interests"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {step === 1 && "We need some basic information to get started"}
              {step === 2 &&
                "Choose your native language and what you want to learn"}
              {step === 3 && "Select topics you&apos;re passionate about"}
            </p>

            {step === 1 && (
              <OnboardingStep1
                name={data.name}
                age={data.age.toString()}
                onChange={(field, value) => {
                  if (field === "age") {
                    handleFieldChange(field, value ? parseInt(value) : 0);
                  } else {
                    handleFieldChange(field, value);
                  }
                }}
                onNext={handleNextStep}
              />
            )}

            {step === 2 && (
              <OnboardingStep2
                nativeLanguage={data.nativeLanguage}
                learningLanguages={data.learningLanguages}
                onChange={handleFieldChange}
                onNext={handleNextStep}
                onBack={handleBackStep}
              />
            )}

            {step === 3 && (
              <OnboardingStep3
                selectedInterests={data.interests}
                onChange={(interests) =>
                  handleFieldChange("interests", interests)
                }
                onNext={handleNextStep}
                onBack={handleBackStep}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
