// src/index.d.ts
export type UgandaLocation = {
  village: string;
  parish: string;
  subcounty: string;
  constituency?: string;
  district: string;
};

declare class UgandaLocations {
  /** Get all districts */
  getDistricts(): string[];

  /** Find village → full hierarchy (O(1)) */
  getLocationByVillage(village: string): UgandaLocation | null;

  /** Get all villages in a parish */
  getVillagesInParish(
    district: string,
    subcounty: string,
    parish: string
  ): string[];

  /** Get all parishes in a subcounty */
  getParishesInSubcounty(district: string, subcounty: string): string[];

  /** Get all subcounties in a district */
  getSubcountiesInDistrict(district: string): string[];

  /** Search villages, parishes, subcounties, districts */
  search(query: string, options?: { limit?: number }): UgandaLocation[];

  /** Get human-readable path */
  getPath(village: string): string | null;

  /** Get parent location (e.g. parish of a village) */
  getParent(
    village: string
  ): Pick<UgandaLocation, "parish" | "subcounty" | "district"> | null;
}

/** The main instance */
export declare const ug: UgandaLocations;

/** Default export */
declare const _default: UgandaLocations;
export default _default;
