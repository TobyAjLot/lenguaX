import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import type { CompatiblePartner, PartnerFilters } from "../../../shared/types";
import { findCompatiblePartners } from "../services/partner.service";
import { LANGUAGES } from "../utils/languages";
import PartnerCard from "./PartnerCard";

export default function FindPartnersTab() {
  const { user } = useAuthStore();
  const [partners, setPartners] = useState<CompatiblePartner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<CompatiblePartner[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<PartnerFilters>({
    nativeLanguage: "",
    learningLanguage: "",
    minMatchScore: 0,
  });

  useEffect(() => {
    if (user) {
      loadPartners();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filters, partners]);

  const loadPartners = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const results = await findCompatiblePartners(user.id);
      setPartners(results);
      setFilteredPartners(results);
    } catch (err) {
      console.error("Failed to load partners:", err);
      setError("Failed to load partners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...partners];

    if (filters.nativeLanguage) {
      results = results.filter((p) =>
        p.native_languages.includes(filters.nativeLanguage!)
      );
    }

    if (filters.learningLanguage) {
      results = results.filter((p) =>
        p.learning_languages.includes(filters.learningLanguage!)
      );
    }

    if (filters.minMatchScore && filters.minMatchScore > 0) {
      results = results.filter((p) => p.match_score >= filters.minMatchScore!);
    }

    setFilteredPartners(results);
  };

  const resetFilters = () => {
    setFilters({
      nativeLanguage: "",
      learningLanguage: "",
      minMatchScore: 0,
    });
  };

  const handleConnect = async (partnerId: string) => {
    // TODO: Implement session request logic
    console.log("Connecting with partner:", partnerId);
    alert("Session request feature coming soon!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Partners</h1>
        <p className="mt-2 text-gray-600">
          Discover language exchange partners who match your learning goals
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Native Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              They Speak (Native)
            </label>
            <select
              value={filters.nativeLanguage}
              onChange={(e) =>
                setFilters({ ...filters, nativeLanguage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Learning Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              They're Learning
            </label>
            <select
              value={filters.learningLanguage}
              onChange={(e) =>
                setFilters({ ...filters, learningLanguage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Match Score Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Match Score
            </label>
            <select
              value={filters.minMatchScore}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  minMatchScore: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={0}>Any Score</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPartners.length} of {partners.length} partners
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Partner Grid */}
      {filteredPartners.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No partners found
          </h3>
          <p className="mt-2 text-gray-600">
            {partners.length === 0
              ? "We couldn't find any compatible partners yet. Check back soon!"
              : "Try adjusting your filters to see more results."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onConnect={handleConnect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
