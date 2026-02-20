// Icon cache for plane markers to avoid recreation on every render
const iconCache = new Map();

export const getPlaneIcon = (heading, selected = false) => {
  // Round heading to nearest 5 degrees for better caching
  const roundedHeading = Math.round((heading || 0) / 5) * 5;
  const cacheKey = `${roundedHeading}-${selected}`;

  if (!iconCache.has(cacheKey)) {
    const L = window.L; // Access Leaflet globally
    const color = selected ? '#ff0000' : '#00ff00'; // Red for selected, green for normal
    iconCache.set(cacheKey, L.divIcon({
      html: `<div style="transform: rotate(${roundedHeading}deg); font-size: 20px; color: ${color};">✈</div>`,
      className: 'plane-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    }));
  }

  return iconCache.get(cacheKey);
};

// Clear cache if needed (for memory management)
export const clearIconCache = () => {
  iconCache.clear();
};