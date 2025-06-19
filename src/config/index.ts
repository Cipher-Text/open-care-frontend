const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://46.102.157.211:6700/",
	itemsPerPage: parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || "10", 10),
};

export default config;
