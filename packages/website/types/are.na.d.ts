declare module 'are.na' {
  // Configuration
  export interface ArenaConfig {
    accessToken?: string;
  }

  // Block types
  export type BlockClass = 'Image' | 'Link' | 'Text' | 'Media' | 'Attachment' | 'Channel';

  // User interface
  export interface User {
    id: number;
    slug: string;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar: string;
    avatar_image: {
      thumb: string;
      display: string;
    };
    channel_count: number;
    following_count: number;
    profile_id: number;
    follower_count: number;
    initials: string;
    can_index: boolean;
    metadata?: {
      description?: string;
    };
    is_premium: boolean;
    is_lifetime_premium: boolean;
    is_supporter: boolean;
    is_exceeding_connections_limit: boolean;
    is_confirmed: boolean;
    is_pending_reconfirmation: boolean;
    is_pending_confirmation: boolean;
    badge?: string;
    can_create_channels: boolean;
    created_at: string;
    class: 'User';
  }

  // Base block interface
  export interface BaseBlock {
    id: number;
    title: string;
    description?: string;
    description_html?: string;
    content?: string;
    created_at: string;
    updated_at: string;
    state: 'available' | 'processing' | 'failed';
    comment_count: number;
    connections_count: number;
    class: BlockClass;
    base_class: 'Block';
    user: User;
  }

  // Image block
  export interface ImageBlock extends BaseBlock {
    class: 'Image';
    image: {
      filename: string;
      content_type: string;
      updated_at: string;
      thumb: { url: string };
      square: { url: string };
      display: { url: string };
      large: { url: string };
      original: {
        url: string;
        file_size: number;
        file_size_display: string;
      };
    };
    source?: {
      url: string;
      title?: string;
      provider?: {
        name: string;
        url: string;
      };
    };
  }

  // Link block
  export interface LinkBlock extends BaseBlock {
    class: 'Link';
    source: {
      url: string;
      title?: string;
      provider?: {
        name: string;
        url: string;
      };
    };
    image?: {
      thumb: { url: string };
      square: { url: string };
      display: { url: string };
      large: { url: string };
      original: { url: string };
    };
  }

  // Text block
  export interface TextBlock extends BaseBlock {
    class: 'Text';
    content: string;
    content_html: string;
  }

  // Media block
  export interface MediaBlock extends BaseBlock {
    class: 'Media';
    attachment?: {
      url: string;
      content_type: string;
      extension: string;
      file_name: string;
      file_size: number;
      file_size_display: string;
    };
    embed?: {
      type: string;
      url: string;
      title?: string;
      author_name?: string;
      author_url?: string;
      source_url?: string;
      thumbnail_url?: string;
      html?: string;
      width?: number;
      height?: number;
    };
  }

  // Attachment block
  export interface AttachmentBlock extends BaseBlock {
    class: 'Attachment';
    attachment: {
      url: string;
      content_type: string;
      extension: string;
      file_name: string;
      file_size: number;
      file_size_display: string;
    };
  }

  // Channel block (when a channel is nested)
  export interface ChannelBlock extends BaseBlock {
    class: 'Channel';
    length: number;
    kind: 'default' | 'profile';
    status: 'public' | 'closed' | 'private';
  }

  // Union type for all blocks
  export type Block =
    | ImageBlock
    | LinkBlock
    | TextBlock
    | MediaBlock
    | AttachmentBlock
    | ChannelBlock
    | BaseBlock;

  // Channel interface
  export interface Channel {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    added_to_at: string;
    published: boolean;
    open: boolean;
    collaboration: boolean;
    slug: string;
    length: number;
    kind: 'default' | 'profile';
    status: 'public' | 'closed' | 'private';
    user_id: number;
    metadata?: {
      description?: string;
    };
    class: 'Channel';
    base_class: 'Channel';
    user: User;
    contents?: Block[];
  }

  // Query options
  export interface ContentsOptions {
    page?: number;
    per?: number;
    sort?: 'position' | 'created_at' | 'updated_at';
    direction?: 'asc' | 'desc';
  }

  export interface PaginationOptions {
    page?: number;
    per?: number;
  }

  export interface SearchOptions extends PaginationOptions {
    q: string;
  }

  // API Interfaces
  export interface ChannelAPI {
    get(options?: { forceRefresh?: boolean }): Promise<Channel>;
    thumb(options?: { forceRefresh?: boolean }): Promise<Channel>;
    contents(options?: ContentsOptions): Promise<Block[]>;
    channels(options?: PaginationOptions): Promise<Channel[]>;
    create(title: string, status?: 'public' | 'closed' | 'private'): Promise<Channel>;
    delete(): Promise<{ status: string }>;
    update(attributes: Partial<Channel>): Promise<Channel>;
    addCollaborators(ids: number[]): Promise<User[]>;
    deleteCollaborators(ids: number[]): Promise<{ status: string }>;
    createBlock(content: string | { source: string } | { content: string }): Promise<Block>;
    deleteBlock(blockId: number): Promise<{ status: string }>;
  }

  export interface BlockAPI {
    get(options?: { forceRefresh?: boolean }): Promise<Block>;
    channels(options?: PaginationOptions): Promise<Channel[]>;
    create(channelSlug: string, content: any): Promise<Block>;
    update(attributes: Partial<Block>): Promise<Block>;
  }

  export interface UserAPI {
    get(options?: { forceRefresh?: boolean }): Promise<User>;
    channels(options?: PaginationOptions): Promise<Channel[]>;
    following(options?: PaginationOptions): Promise<Channel[]>;
    followers(options?: PaginationOptions): Promise<User[]>;
  }

  export interface SearchAPI {
    all(options: SearchOptions): Promise<{ channels: Channel[]; blocks: Block[]; users: User[] }>;
    channels(options: SearchOptions): Promise<Channel[]>;
    blocks(options: SearchOptions): Promise<Block[]>;
    users(options: SearchOptions): Promise<User[]>;
  }

  // Main Arena class
  export default class Arena {
    constructor(config?: ArenaConfig);

    channel(slug: string | number): ChannelAPI;
    block(id: number): BlockAPI;
    user(id: number | string): UserAPI;
    search(): SearchAPI;
  }
}
