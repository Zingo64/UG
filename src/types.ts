export interface Game {
  id: string;
  title: string;
  category: 'Arcade' | 'Puzzle' | 'Action' | 'Retro' | 'Strategy' | 'Sports' | 'Other';
  thumbnail: string;
  url: string;
  description: string;
  controls?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  featured?: boolean;
  rating?: number;
  custom?: boolean;
}

export type CategoryFilterType = 'All' | 'Arcade' | 'Puzzle' | 'Action' | 'Retro' | 'Strategy' | 'Favorites';
export type SortOption = 'featured' | 'rating' | 'title-asc' | 'title-desc';
