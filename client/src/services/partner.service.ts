import { supabase } from "../lib/supabase";
import type { CompatiblePartner, PartnerFilters } from "../../../shared/types";

/**
 * Find compatible language exchange partners
 * Uses the find_compatible_partners RPC function
 */
export async function findCompatiblePartners(
  userId: string,
  filters?: PartnerFilters
): Promise<CompatiblePartner[]> {
  try {
    // Call the Supabase RPC function
    const { data, error } = await supabase.rpc("find_compatible_partners", {
      current_user_id: userId,
    });

    if (error) {
      console.error("Error finding partners:", error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Apply client-side filters if provided
    let results = data as CompatiblePartner[];

    if (filters?.nativeLanguage) {
      results = results.filter((partner) =>
        partner.native_languages.includes(filters.nativeLanguage!)
      );
    }

    if (filters?.learningLanguage) {
      results = results.filter((partner) =>
        partner.learning_languages.includes(filters.learningLanguage!)
      );
    }

    if (filters?.minMatchScore !== undefined) {
      results = results.filter(
        (partner) => partner.match_score >= filters.minMatchScore!
      );
    }

    return results;
  } catch (error) {
    console.error("Partner search failed:", error);
    throw error;
  }
}

/**
 * Get common languages between current user and a partner
 * Used to display what languages they can exchange
 */
export function getExchangeLanguages(
  userNative: string[],
  userLearning: string[],
  partnerNative: string[],
  partnerLearning: string[]
): {
  youTeach: string[];
  youLearn: string[];
} {
  return {
    // Languages you can teach them (your native that they're learning)
    youTeach: userNative.filter((lang) => partnerLearning.includes(lang)),
    // Languages they can teach you (their native that you're learning)
    youLearn: partnerNative.filter((lang) => userLearning.includes(lang)),
  };
}
