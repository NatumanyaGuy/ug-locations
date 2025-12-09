# ug-locations

**The fastest, most accurate way to work with Uganda's administrative hierarchy in JavaScript/TypeScript.**

Instantly search villages, get complete administrative paths, and traverse Uganda's location hierarchy from village → parish → subcounty → county → district.

[![npm version](https://img.shields.io/npm/v/ug-locations.svg)](https://www.npmjs.com/package/ug-locations)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Zero runtime data fetching** — ~7MB optimized data bundled with package
- ⚡ **O(1) village lookups** — instant location resolution
- 🔍 **Smart search** — fuzzy matching with relevance ranking
- 🗺️ **Complete hierarchy** — traverse all administrative levels
- 📦 **Tree-shakeable** — only bundle what you use
- 💪 **TypeScript native** — full type safety included

## 📦 Installation

```bash
npm install ug-locations
```

```bash
yarn add ug-locations
```

```bash
pnpm add ug-locations
```

```bash
bun add ug-locations
```

## 🚀 Quick Start

```typescript
import ug from "ug-locations";

// Get complete location hierarchy from a village name
const location = ug.getLocationByVillage("KASAMBYA I");
console.log(location);
// {
//   village: "KASAMBYA I",
//   parish: "KATEREIGA",
//   subcounty: "BUHANIKA",
//   constituency: "BUGAHYA COUNTY",
//   district: "HOIMA"
// }

// Get human-readable path
console.log(ug.getPath("KASAMBYA I"));
// "HOIMA → BUHANIKA → KATEREIGA → KASAMBYA I"
```

## 📚 Usage Examples

### Working with Districts

```typescript
// Get all districts in Uganda
const districts = ug.getDistricts();
console.log(districts.slice(0, 5));
// ["ABIM", "ADJUMANI", "AGAGO", "ALEBTONG", "AMOLATAR"]

// List all subcounties in a district
const subcounties = ug.getSubcountiesInDistrict("HOIMA");
console.log(subcounties);
// ["BOMBO", "BUHANIKA", "BULINDI TOWN COUNCIL", "BURARU", ...]
```

### Traversing the Hierarchy

```typescript
// Get all parishes in a subcounty
const parishes = ug.getParishesInSubcounty("HOIMA", "BUHANIKA");
console.log(parishes);
// ["KATEREIGA", "KYABIGAMBIRE", ...]

// Get all villages in a parish
const villages = ug.getVillagesInParish("HOIMA", "BUHANIKA", "KATEREIGA");
console.log(villages);
// ["KASAMBYA I", "KASAMBYA II", ...]

// Get parent location of a village
const parent = ug.getParent("KASAMBYA I");
console.log(parent);
// { parish: "KATEREIGA", subcounty: "BUHANIKA", district: "HOIMA" }
```

### Searching Locations

```typescript
// Search across all administrative levels
const results = ug.search("KABANDA");
results.slice(0, 3).forEach((loc) => {
  console.log(`${loc.village} (${loc.district})`);
});
// KABANDA (NTUNGAMO)
// KABANDA (MBARARA)
// KABANDA (RUKUNGIRI)

// Limit search results
const topResults = ug.search("kaba", { limit: 5 });
console.log(topResults.length); // 5

// Search prioritizes exact matches and start-with matches
const kampalaResults = ug.search("KAMPALA");
// Villages/locations starting with "KAMPALA" appear first
```

### Building Location Forms

```typescript
// Example: Create a cascading location selector
function buildLocationSelector() {
  const districts = ug.getDistricts();

  // User selects district
  const selectedDistrict = "KAMPALA";
  const subcounties = ug.getSubcountiesInDistrict(selectedDistrict);

  // User selects subcounty
  const selectedSubcounty = "CENTRAL DIVISION";
  const parishes = ug.getParishesInSubcounty(
    selectedDistrict,
    selectedSubcounty
  );

  // User selects parish
  const selectedParish = "INDUSTRIAL AREA";
  const villages = ug.getVillagesInParish(
    selectedDistrict,
    selectedSubcounty,
    selectedParish
  );

  return { districts, subcounties, parishes, villages };
}
```

### Validating User Input

```typescript
// Verify if a location exists
function validateLocation(villageName: string): boolean {
  const location = ug.getLocationByVillage(villageName);
  return location !== null;
}

// Get suggestions for partial input
function getSuggestions(partial: string) {
  return ug.search(partial, { limit: 10 });
}

console.log(validateLocation("KASAMBYA I")); // true
console.log(validateLocation("FAKE VILLAGE")); // false
```

## 📖 API Reference

| Method                                             | Parameters                                                      | Returns                                 | Description                                                       |
| -------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `getDistricts()`                                   | -                                                               | `string[]`                              | Returns all 135+ districts in Uganda                              |
| `getLocationByVillage(village)`                    | `village: string`                                               | `UgandaLocation \| null`                | Get complete hierarchy for a village (O(1) lookup)                |
| `getPath(village)`                                 | `village: string`                                               | `string \| null`                        | Returns formatted path: "District → Subcounty → Parish → Village" |
| `search(query, options?)`                          | `query: string`<br/>`options?: { limit?: number }`              | `UgandaLocation[]`                      | Search across all levels with fuzzy matching. Default limit: 50   |
| `getSubcountiesInDistrict(district)`               | `district: string`                                              | `string[]`                              | Lists all subcounties in a district                               |
| `getParishesInSubcounty(district, subcounty)`      | `district: string`<br/>`subcounty: string`                      | `string[]`                              | Lists all parishes in a subcounty                                 |
| `getVillagesInParish(district, subcounty, parish)` | `district: string`<br/>`subcounty: string`<br/>`parish: string` | `string[]`                              | Lists all villages in a parish                                    |
| `getParent(village)`                               | `village: string`                                               | `{parish, subcounty, district} \| null` | Returns parent location information                               |

### Type Definitions

```typescript
type UgandaLocation = {
  village: string;
  parish: string;
  subcounty: string;
  constituency?: string;
  district: string;
};
```

## ⚡ Performance

| Operation               | Time    | Complexity        |
| ----------------------- | ------- | ----------------- |
| Village → Full Location | ~0.01ms | O(1) hash lookup  |
| Search 10,000+ villages | ~8ms    | Optimized scoring |
| Package initialization  | ~15ms   | Cold start (Bun)  |
| Bundle size             | ~7MB    | Includes all data |

## 🗺️ Data Coverage

- **135+ Districts**
- **10,000+ Villages**
- **Complete administrative hierarchy** (Village → Parish → Subcounty → Constituency → District)

## 📊 Data Source

Based on Uganda Electoral Commission Administrative Units - 2022

**Source Document:** [Uganda Electoral Commission Administrative Units PDF (July 2022)](https://www.ec.or.ug/election/administrative-units-uganda-july-2022)

## 🙏 Acknowledgments

Special thanks to [@gxnsamuel](https://github.com/gxnsamuel/UG-AU-DS-2022) for providing the JSON extract of the Uganda Electoral Commission Administrative Units PDF.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Natumanya Guy](https://github.com/NatumanyaGuy)

## 🐛 Issues

Found a bug or have a feature request? [Open an issue](https://github.com/NatumanyaGuy/ug-locations/issues)

---

**Made with ❤️ in Uganda** 🇺🇬
