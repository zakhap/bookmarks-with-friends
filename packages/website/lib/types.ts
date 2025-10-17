export interface Bookmark {
  id: string;
  type: 'link' | 'image' | 'text' | 'other';
  url?: string;
  imageUrl?: string;
  title: string;
  note?: string;
  savedBy: string;
  savedAt: Date;
}
