// src/index.ts
import _DATA from "./data-optimized.json" with { type: "json" };

const DATA = _DATA as {
  districts: string[];
  byVillage: Record<string, UgandaLocation>;
  byParish: Record<string, { villages: string[] }>;
  bySubcounty: Record<string, { data: Array<{ parish: string }> }>;
};

export type UgandaLocation = {
  village: string;
  parish: string;
  subcounty: string;
  constituency?: string;
  district: string;
};

export class UgandaLocations {
  private data = DATA;

  getDistricts(): string[] {
    return this.data.districts;
  }

  getLocationByVillage(village: string): UgandaLocation | null {
    return this.data.byVillage[village.toUpperCase()] ?? null;
  }

  getVillagesInParish(
    district: string,
    subcounty: string,
    parish: string
  ): string[] {
    const key = `${district.toUpperCase()}||${subcounty.toUpperCase()}||${parish.toUpperCase()}`;
    const p = this.data.byParish[key];
    return p ? p.villages : [];
  }

  getParishesInSubcounty(district: string, subcounty: string): string[] {
    const key = `${district.toUpperCase()}||${subcounty.toUpperCase()}`;
    const sc = this.data.bySubcounty[key];
    return sc ? sc.data.map((p) => p.parish) : [];
  }

  getSubcountiesInDistrict(district: string): string[] {
    const d = district.toUpperCase();
    if (!this.data.districts.includes(d)) return [];

    const result = new Set<string>();
    for (const key of Object.keys(this.data.bySubcounty)) {
      if (key.startsWith(d + "||")) {
        const subcountyName = key.split("||")[1]!;
        result.add(subcountyName);
      }
    }
    return Array.from(result).sort();
  }

  search(query: string, options: { limit?: number } = {}): UgandaLocation[] {
    const q = query.toUpperCase().trim();
    const limit = options.limit ?? 50;
    const results: UgandaLocation[] = [];

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
        results.push(loc);
      }
    }

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

  getPath(village: string): string | null {
    const loc = this.getLocationByVillage(village);
    if (!loc) return null;
    return `${loc.district} → ${loc.subcounty} → ${loc.parish} → ${loc.village}`;
  }

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