import ug from "../src/index";

// Get hierarchy from village
const loc = ug.getLocationByVillage("KASAMBYA I");
console.log(`=========== Get hierarchy from village ============\n`);
console.log(loc);
// → { village: "KASAMBYA I", parish: "KATEREIGA", subcounty: "BUHANIKA", district: "HOIMA", ... }

console.log(`=========== Get Path ============\n`);
console.log(ug.getPath("KASAMBYA I"));
// → "HOIMA → BUHANIKA → KATEREIGA → KASAMBYA I"

// Search
console.log(`=========== Search ============\n`);
ug.search("kaba").slice(0, 5).forEach(console.log);

console.log(`=========== List subcounties in Hoima ============\n`);
// List subcounties in Hoima
console.log(ug.getSubcountiesInDistrict("Hoima"));
