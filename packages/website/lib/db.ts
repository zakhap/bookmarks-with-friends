import { sql } from '@vercel/postgres';
import type { Bookmark } from '@bookmarks/shared';

export async function createBookmark(
  url: string,
  title: string,
  savedBy: string,
  note?: string
): Promise<Bookmark> {
  const result = await sql`
    INSERT INTO bookmarks (url, title, note, saved_by)
    VALUES (${url}, ${title}, ${note || null}, ${savedBy})
    RETURNING id, url, title, note, saved_by as "savedBy", saved_at as "savedAt"
  `;

  return result.rows[0] as Bookmark;
}

export async function getLatestBookmarks(limit: number = 50): Promise<Bookmark[]> {
  const result = await sql`
    SELECT
      id,
      url,
      title,
      note,
      saved_by as "savedBy",
      saved_at as "savedAt"
    FROM bookmarks
    ORDER BY saved_at DESC
    LIMIT ${limit}
  `;

  return result.rows as Bookmark[];
}
