const Arena = require('are.na');
import type { Bookmark } from './types';

const arena = new Arena();

export interface ArenaBlock {
  id: number;
  title: string;
  source?: {
    url: string;
  };
  description?: string;
  description_html?: string;
  content?: string;
  user: {
    username: string;
    full_name: string;
  };
  created_at: string;
  class: string;
}

export async function getChannelContents(channelSlug: string): Promise<Bookmark[]> {
  try {
    const channel = await arena.channel(channelSlug).contents({ per: 50 });

    return channel
      .filter((block: ArenaBlock) => block.class === 'Link' && block.source?.url)
      .map((block: ArenaBlock) => ({
        id: String(block.id),
        url: block.source!.url,
        title: block.title || block.source!.url,
        note: block.description || block.content,
        savedBy: block.user.username || block.user.full_name,
        savedAt: new Date(block.created_at),
      }));
  } catch (error) {
    console.error('Error fetching Are.na channel:', error);
    return [];
  }
}
