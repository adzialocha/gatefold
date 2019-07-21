const ABSORPTION_TREE_PER_YEAR = 21.77;
const CARBON_KG_PER_KILOMETER = 0.158;
const COSTS_PER_TREE = 1;
const EARTH_RADIUS = 6371;

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // @TODO: Give option to have oneway or round trip flights
  return EARTH_RADIUS * c * 2; // Round trip!
}

function calculateEmission(distance) {
  // @TODO: Use better formula
  return distance * CARBON_KG_PER_KILOMETER;
}

function calculateCosts(emission) {
  // @TODO: Use better formula
  return (emission / ABSORPTION_TREE_PER_YEAR) * COSTS_PER_TREE;
}

module.exports = {
  calculateCosts,
  calculateDistance,
  calculateEmission,
};
