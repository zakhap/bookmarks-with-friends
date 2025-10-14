// Core bookmark type
export interface Bookmark {
  id: string;
  url: string;
  title: string;
  note?: string;
  savedBy: string;
  savedAt: Date;
}

// API request/response types
export interface CreateBookmarkInput {
  url: string;
  title: string;
  note?: string;
  savedBy: string;
  apiKey: string;
}

export interface GetBookmarksResponse {
  bookmarks: Bookmark[];
}

// Extension storage types
export interface ExtensionSettings {
  apiKey: string;
  savedBy: string;
  apiUrl: string;
}
