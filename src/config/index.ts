const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://46.102.157.211:6500/",
  itemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || "10", 10),
};

export default config;
