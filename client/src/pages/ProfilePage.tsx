/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../lib/supabase";

interface Language {
  id?: string;
  language_code: string;
  proficiency_level: number;
  is_learning: boolean;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "hi", name: "Hindi" },
];

const PROFICIENCY_LABELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Advanced",
  "Native/Fluent",
];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Profile fields
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nativeLanguages, setNativeLanguages] = useState<Language[]>([]);
  const [learningLanguages, setLearningLanguages] = useState<Language[]>([]);

  // Form state
  const [selectedNative, setSelectedNative] = useState("");
  const [selectedLearning, setSelectedLearning] = useState("");
  const [learningProficiency, setLearningProficiency] = useState(1);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("bio, avatar_url")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || "");
      }

      // Load user languages
      const { data: languages, error: langError } = await supabase
        .from("user_languages")
        .select("*")
        .eq("user_id", user?.id);

      if (langError) throw langError;

      if (languages) {
        const native = languages.filter((lang) => !lang.is_learning);
        const learning = languages.filter((lang) => lang.is_learning);
        setNativeLanguages(native);
        setLearningLanguages(learning);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const addNativeLanguage = async () => {
    if (!selectedNative) return;

    const exists = nativeLanguages.some(
      (lang) => lang.language_code === selectedNative
    );
    if (exists) {
      setError("This language is already in your native languages");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from("user_languages")
        .insert({
          user_id: user?.id,
          language_code: selectedNative,
          proficiency_level: 5,
          is_learning: false,
        })
        .select()
        .single();

      if (error) throw error;

      setNativeLanguages([...nativeLanguages, data]);
      setSelectedNative("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to add language");
      setTimeout(() => setError(null), 3000);
    }
  };

  const addLearningLanguage = async () => {
    if (!selectedLearning) return;

    const exists = learningLanguages.some(
      (lang) => lang.language_code === selectedLearning
    );
    if (exists) {
      setError("This language is already in your learning languages");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const isNative = nativeLanguages.some(
      (lang) => lang.language_code === selectedLearning
    );
    if (isNative) {
      setError("This language is already in your native languages");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from("user_languages")
        .insert({
          user_id: user?.id,
          language_code: selectedLearning,
          proficiency_level: learningProficiency,
          is_learning: true,
        })
        .select()
        .single();

      if (error) throw error;

      setLearningLanguages([...learningLanguages, data]);
      setSelectedLearning("");
      setLearningProficiency(1);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to add language");
      setTimeout(() => setError(null), 3000);
    }
  };

  const removeLanguage = async (id: string, isLearning: boolean) => {
    try {
      setError(null);
      const { error } = await supabase
        .from("user_languages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (isLearning) {
        setLearningLanguages(
          learningLanguages.filter((lang) => lang.id !== id)
        );
      } else {
        setNativeLanguages(nativeLanguages.filter((lang) => lang.id !== id));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to remove language");
      setTimeout(() => setError(null), 3000);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      const { error } = await supabase
        .from("users")
        .update({
          bio: bio.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        })
        .eq("id", user?.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getLanguageName = (code: string) => {
    return LANGUAGES.find((lang) => lang.code === code)?.name || code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">
          Manage your profile information and language preferences
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Changes saved successfully!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>

        {/* Avatar URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL (optional)
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              className="mt-3 w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${
                  user?.full_name || "User"
                }&background=3b82f6&color=fff`;
              }}
            />
          )}
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell potential language partners about yourself..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            {bio.length} / 500 characters
          </p>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {saving ? "Saving..." : "Save Profile Information"}
        </button>
      </div>

      {/* Native Languages Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Native Languages
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Languages you speak fluently
        </p>

        {/* Add Native Language */}
        <div className="flex gap-3 mb-4">
          <select
            value={selectedNative}
            onChange={(e) => setSelectedNative(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            onClick={addNativeLanguage}
            disabled={!selectedNative}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Add
          </button>
        </div>

        {/* Native Languages List */}
        <div className="space-y-2">
          {nativeLanguages.length === 0 ? (
            <p className="text-gray-500 text-sm italic py-2">
              No native languages added yet
            </p>
          ) : (
            nativeLanguages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {getLanguageName(lang.language_code)}
                  </p>
                  <p className="text-sm text-gray-500">Native/Fluent</p>
                </div>
                <button
                  onClick={() => removeLanguage(lang.id!, false)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Learning Languages Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Languages I'm Learning
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Languages you want to practice with partners
        </p>

        {/* Add Learning Language */}
        <div className="space-y-3 mb-4">
          <select
            value={selectedLearning}
            onChange={(e) => setSelectedLearning(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>

          {/* Proficiency Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level: {PROFICIENCY_LABELS[learningProficiency - 1]}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={learningProficiency}
              onChange={(e) => setLearningProficiency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Beginner</span>
              <span>Elementary</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Fluent</span>
            </div>
          </div>

          <button
            onClick={addLearningLanguage}
            disabled={!selectedLearning}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Add Learning Language
          </button>
        </div>

        {/* Learning Languages List */}
        <div className="space-y-2">
          {learningLanguages.length === 0 ? (
            <p className="text-gray-500 text-sm italic py-2">
              No learning languages added yet
            </p>
          ) : (
            learningLanguages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {getLanguageName(lang.language_code)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {PROFICIENCY_LABELS[lang.proficiency_level - 1]}
                  </p>
                </div>
                <button
                  onClick={() => removeLanguage(lang.id!, true)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completion Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          {nativeLanguages.length > 0 && learningLanguages.length > 0 ? (
            <>✓ Your profile is ready! You can now find language partners.</>
          ) : (
            <>
              Add at least one native language and one learning language to
              start finding partners.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
