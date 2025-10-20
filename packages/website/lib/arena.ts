import Arena from 'are.na';
import type { Bookmark } from './types';

const arena = new Arena();

export interface ArenaBlock {
  id: number;
  title: string;
  source?: {
    url: string;
  };
  image?: {
    original: {
      url: string;
    };
    display: {
      url: string;
    };
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
    const channel = await arena.channel(channelSlug).contents({ per: 50, sort: 'position', direction: 'desc' });

    return channel.map((block: ArenaBlock) => {
      // For Link blocks
      if (block.class === 'Link' && block.source?.url) {
        return {
          id: String(block.id),
          type: 'link' as const,
          url: block.source.url,
          title: block.title || block.source.url,
          note: block.description || block.content,
          savedBy: block.user.username || block.user.full_name,
          savedAt: new Date(block.created_at),
        };
      }

      // For Image blocks
      if (block.class === 'Image' && block.image) {
        return {
          id: String(block.id),
          type: 'image' as const,
          url: block.image.original.url,
          imageUrl: block.image.display.url,
          title: block.title || 'Untitled Image',
          note: block.description || block.content,
          savedBy: block.user.username || block.user.full_name,
          savedAt: new Date(block.created_at),
        };
      }

      // For Text blocks
      if (block.class === 'Text') {
        return {
          id: String(block.id),
          type: 'text' as const,
          title: block.title || 'Text Block',
          note: block.content || block.description,
          savedBy: block.user.username || block.user.full_name,
          savedAt: new Date(block.created_at),
        };
      }

      // For other block types, treat as generic content
      return {
        id: String(block.id),
        type: 'other' as const,
        url: block.source?.url,
        title: block.title || `${block.class} Block`,
        note: block.description || block.content,
        savedBy: block.user.username || block.user.full_name,
        savedAt: new Date(block.created_at),
      };
    });
  } catch (error) {
    console.error('Error fetching Are.na channel:', error);
    return [];
  }
}
