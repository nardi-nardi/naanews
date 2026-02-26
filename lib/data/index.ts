/**
 * Data layer — satu titik ekspor untuk server-side data.
 * Loader per domain di file terpisah (feeds, books, stories, roadmaps, products).
 */

export { CONTENT_REVALIDATE_SECONDS, CACHE_TAGS } from "./constants";
export { getFeeds, getFeedById, getFeedIds } from "./feeds";
export { getBooks, getBookById, getBookIds } from "./books";
export { getStories } from "./stories";
export { getRoadmaps } from "./roadmaps";
export { getProducts } from "./products";
