import hashtagData from './hashtags.json';

const categoryMap = new Map<string, string[]>();
hashtagData.categories.forEach(category => {
  categoryMap.set(category.name.toLowerCase(), category.hashtags);
});

const allCategories = Array.from(categoryMap.keys());
const trendingHashtags = categoryMap.get('trending') || [];

export function getHashtags(keywords: string, maxHashtags = 30): string[] {
  // Use a broader split for keywords, including commas and spaces, and filter for meaningful length
  const searchKeywords = keywords.toLowerCase().trim().split(/[\s,]+/).filter(kw => kw.length > 2);
  
  if (searchKeywords.length === 0) {
    return trendingHashtags.slice(0, maxHashtags);
  }

  const matchedCategories = new Set<string>();
  
  // Find categories where the name includes one of the user's keywords
  for (const keyword of searchKeywords) {
      for (const category of allCategories) {
          if (category.includes(keyword)) {
              matchedCategories.add(category);
          }
      }
  }

  const matchedHashtags = new Set<string>();
  matchedCategories.forEach(category => {
      const tags = categoryMap.get(category);
      if (tags) {
        tags.forEach(tag => matchedHashtags.add(tag));
      }
  })

  if (matchedHashtags.size > 0) {
    return Array.from(matchedHashtags).slice(0, maxHashtags);
  }

  // Fallback to trending if no categories matched
  return trendingHashtags.slice(0, maxHashtags);
}
