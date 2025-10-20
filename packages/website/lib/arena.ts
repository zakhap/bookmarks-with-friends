import Arena, { type Block, type LinkBlock, type ImageBlock } from 'are.na';
import { unstable_cache } from 'next/cache';
import type { Bookmark } from './types';

const arena = new Arena();

async function fetchChannelContents(channelSlug: string): Promise<Bookmark[]> {
  const channel = await arena.channel(channelSlug).contents({ per: 50, sort: 'position', direction: 'desc' });

  return channel.map((block: Block) => {
      // For Link blocks
      if (block.class === 'Link') {
        const linkBlock = block as LinkBlock;
        return {
          id: String(linkBlock.id),
          type: 'link' as const,
          url: linkBlock.source.url,
          title: linkBlock.title || linkBlock.source.url,
          note: linkBlock.description || linkBlock.content,
          savedBy: linkBlock.user.username || linkBlock.user.full_name,
          savedAt: new Date(linkBlock.created_at),
        };
      }

      // For Image blocks
      if (block.class === 'Image') {
        const imageBlock = block as ImageBlock;
        return {
          id: String(imageBlock.id),
          type: 'image' as const,
          url: imageBlock.image.original.url,
          imageUrl: imageBlock.image.display.url,
          title: imageBlock.title || 'Untitled Image',
          note: imageBlock.description || imageBlock.content,
          savedBy: imageBlock.user.username || imageBlock.user.full_name,
          savedAt: new Date(imageBlock.created_at),
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
      const sourceUrl = 'source' in block && block.source && typeof block.source === 'object' && 'url' in block.source ? String(block.source.url) : undefined;
      return {
        id: String(block.id),
        type: 'other' as const,
        url: sourceUrl,
        title: block.title || `${block.class} Block`,
        note: block.description || block.content,
        savedBy: block.user.username || block.user.full_name,
        savedAt: new Date(block.created_at),
      };
    });
}

export async function getChannelContents(channelSlug: string): Promise<Bookmark[]> {
  // Create a cached version of the fetch function with stale-while-revalidate behavior
  const getCachedChannelContents = unstable_cache(
    async () => fetchChannelContents(channelSlug),
    [`channel-${channelSlug}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`channel-${channelSlug}`],
    }
  );

  try {
    return await getCachedChannelContents();
  } catch (error) {
    console.error('Error fetching Are.na channel:', error);
    // Try to get cached data one more time, even if stale
    try {
      return await getCachedChannelContents();
    } catch {
      // If all else fails, return empty array
      return [];
    }
  }
}
