// src/uganda.ts
import { readFileSync } from "fs";

const _DATA = JSON.parse(
  readFileSync(new URL("./data-optimized.json", import.meta.url), "utf8")
) as {
  districts: string[];
  byVillage: Record<string, any>;
  byParish: Record<string, any>;
  bySubcounty: Record<string, any>;
};

export type UgandaLocation = {
  village: string;
  parish: string;
  subcounty: string;
  constituency?: string;
  district: string;
};

class UgandaLocations {
  private data = _DATA;

  /** Get all districts */
  getDistricts(): string[] {
    return this.data.districts;
  }

  /** Find village → full hierarchy (O(1)) */
  getLocationByVillage(village: string): UgandaLocation | null {
    return this.data.byVillage[village.toUpperCase()] ?? null;
  }

  /** Get all villages in a parish */
  getVillagesInParish(
    district: string,
    subcounty: string,
    parish: string
  ): string[] {
    const key = `${district.toUpperCase()}||${subcounty.toUpperCase()}||${parish.toUpperCase()}`;
    const p = this.data.byParish[key];
    return p ? p.villages.map((v: string) => v) : [];
  }

  /** Get all parishes in a subcounty */
  getParishesInSubcounty(district: string, subcounty: string): string[] {
    const key = `${district.toUpperCase()}||${subcounty.toUpperCase()}`;
    const sc = this.data.bySubcounty[key];
    return sc ? sc.data.map((p: any) => p.parish) : [];
  }

  /** Get all subcounties in a district — FIXED, no more 'raw' needed */
  getSubcountiesInDistrict(district: string): string[] {
    const d = district.toUpperCase();
    if (!this.data.districts.includes(d)) return [];

    const result = new Set<string>();

    // Loop through all subcounty keys and extract those belonging to this district
    for (const key of Object.keys(this.data.bySubcounty)) {
      if (key.startsWith(d + "||")) {
        const subcountyName = key.split("||")[1]!;
        result.add(subcountyName);
      }
    }

    return Array.from(result).sort();
  }

  /** Search villages, parishes, subcounties, districts */
  search(query: string, options: { limit?: number } = {}): UgandaLocation[] {
    const q = query.toUpperCase().trim();
    const limit = options.limit ?? 50;
    const results: UgandaLocation[] = [];

    // Fast exact or starts-with match first
    for (const [village, loc] of Object.entries(this.data.byVillage)) {
      if (results.length >= limit * 3) break;

      const matches =
        village.includes(q) ||
        loc.district.includes(q) ||
        loc.subcounty.includes(q) ||
        loc.parish.includes(q) ||
        village.startsWith(q) ||
        loc.district === q;

      if (matches) {
        results.push(loc as UgandaLocation);
      }
    }

    // Sort by relevance
    results.sort((a, b) => {
      const aScore =
        (a.village.startsWith(q) ? 4 : 0) +
        (a.village === q ? 10 : 0) +
        (a.district === q ? 8 : 0) +
        (a.subcounty === q ? 6 : 0);
      const bScore =
        (b.village.startsWith(q) ? 4 : 0) +
        (b.village === q ? 10 : 0) +
        (b.district === q ? 8 : 0) +
        (b.subcounty === q ? 6 : 0);
      return bScore - aScore;
    });

    return results.slice(0, limit);
  }

  /** Get human-readable path */
  getPath(village: string): string | null {
    const loc = this.getLocationByVillage(village);
    if (!loc) return null;
    return `${loc.district} → ${loc.subcounty} → ${loc.parish} → ${loc.village}`;
  }

  /** Get parent location (e.g. parish of a village) */
  getParent(
    village: string
  ): Pick<UgandaLocation, "parish" | "subcounty" | "district"> | null {
    const loc = this.getLocationByVillage(village);
    if (!loc) return null;
    return {
      parish: loc.parish,
      subcounty: loc.subcounty,
      district: loc.district,
    };
  }
}

export const ug = new UgandaLocations();
export default ug;
