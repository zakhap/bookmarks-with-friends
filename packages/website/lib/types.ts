export interface Bookmark {
  id: string;
  url: string;
  title: string;
  note?: string;
  savedBy: string;
  savedAt: Date;
}
