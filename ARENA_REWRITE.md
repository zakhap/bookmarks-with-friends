# Rewriting the Are.na Package as Type-Safe

The current `are.na` npm package (v0.1.5) is a JavaScript-only library without TypeScript support. Here's how to rewrite it as a modern, type-safe TypeScript package.

## Current Issues

1. **No TypeScript definitions** - Need to create `.d.ts` declaration files
2. **Uses CommonJS** - Modern packages should use ESM (ES Modules)
3. **Implicit `any` types** - No compile-time type checking
4. **Limited documentation** - Types would provide inline documentation via IDE autocomplete

## Approach 1: Create Type Definitions Only

The quickest approach is to create comprehensive TypeScript definitions for the existing package.

### Steps:

1. **Create a types package**: `@types/are-na` or include types in the main package
2. **Map the Are.na API** responses to TypeScript interfaces
3. **Define the SDK methods** with proper return types

### Example Structure:

```typescript
// types/index.d.ts

declare module 'are.na' {
  // Configuration
  export interface ArenaConfig {
    accessToken?: string;
  }

  // Block types
  export type BlockClass = 'Image' | 'Link' | 'Text' | 'Media' | 'Attachment' | 'Channel';

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

  export interface TextBlock extends BaseBlock {
    class: 'Text';
    content: string;
    content_html: string;
  }

  export type Block = ImageBlock | LinkBlock | TextBlock | BaseBlock;

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

  export interface SearchOptions {
    q: string;
    page?: number;
    per?: number;
  }

  // API Interfaces
  export interface ChannelAPI {
    get(options?: { forceRefresh?: boolean }): Promise<Channel>;
    thumb(options?: { forceRefresh?: boolean }): Promise<Channel>;
    contents(options?: ContentsOptions): Promise<Block[]>;
    channels(options?: { page?: number; per?: number }): Promise<Channel[]>;
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
    channels(options?: { page?: number; per?: number }): Promise<Channel[]>;
    create(channelSlug: string, content: any): Promise<Block>;
    update(attributes: Partial<Block>): Promise<Block>;
  }

  export interface UserAPI {
    get(options?: { forceRefresh?: boolean }): Promise<User>;
    channels(options?: { page?: number; per?: number }): Promise<Channel[]>;
    following(options?: { page?: number; per?: number }): Promise<Channel[]>;
    followers(options?: { page?: number; per?: number }): Promise<User[]>;
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
```

## Approach 2: Full TypeScript Rewrite

For a complete rewrite as a modern TypeScript package:

### Project Structure:

```
arena-ts/
├── src/
│   ├── index.ts              # Main export
│   ├── client.ts             # Arena client class
│   ├── resources/
│   │   ├── channels.ts       # Channel API methods
│   │   ├── blocks.ts         # Block API methods
│   │   ├── users.ts          # User API methods
│   │   └── search.ts         # Search API methods
│   ├── types/
│   │   ├── index.ts          # Re-export all types
│   │   ├── blocks.ts         # Block type definitions
│   │   ├── channels.ts       # Channel type definitions
│   │   ├── users.ts          # User type definitions
│   │   └── common.ts         # Shared types
│   └── utils/
│       ├── http.ts           # HTTP client wrapper
│       └── errors.ts         # Custom error types
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

### Key Implementation Points:

#### 1. Modern HTTP Client

```typescript
// src/utils/http.ts
import { ArenaError } from './errors';

export class HttpClient {
  private baseUrl = 'https://api.are.na/v2';
  private accessToken?: string;

  constructor(accessToken?: string) {
    this.accessToken = accessToken;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new ArenaError(
        `Arena API error: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}
```

#### 2. Type-Safe Resource Classes

```typescript
// src/resources/channels.ts
import type { Channel, Block, ContentsOptions } from '../types';
import type { HttpClient } from '../utils/http';

export class ChannelResource {
  constructor(
    private client: HttpClient,
    private slug: string | number
  ) {}

  async get(): Promise<Channel> {
    return this.client.get<Channel>(`/channels/${this.slug}`);
  }

  async contents(options: ContentsOptions = {}): Promise<Block[]> {
    const params = new URLSearchParams();

    if (options.page) params.set('page', String(options.page));
    if (options.per) params.set('per', String(options.per));
    if (options.sort) params.set('sort', options.sort);
    if (options.direction) params.set('direction', options.direction);

    const query = params.toString();
    const endpoint = `/channels/${this.slug}/contents${query ? `?${query}` : ''}`;

    return this.client.get<Block[]>(endpoint);
  }

  async createBlock(content: string | { source: string } | { content: string }): Promise<Block> {
    return this.client.post<Block>(`/channels/${this.slug}/blocks`, content);
  }

  async deleteBlock(blockId: number): Promise<void> {
    await this.client.delete(`/channels/${this.slug}/blocks/${blockId}`);
  }
}
```

#### 3. Main Client Class

```typescript
// src/client.ts
import { HttpClient } from './utils/http';
import { ChannelResource } from './resources/channels';
import { BlockResource } from './resources/blocks';
import { UserResource } from './resources/users';
import { SearchResource } from './resources/search';

export interface ArenaConfig {
  accessToken?: string;
}

export class Arena {
  private client: HttpClient;

  constructor(config?: ArenaConfig) {
    this.client = new HttpClient(config?.accessToken);
  }

  channel(slug: string | number): ChannelResource {
    return new ChannelResource(this.client, slug);
  }

  block(id: number): BlockResource {
    return new BlockResource(this.client, id);
  }

  user(id: number | string): UserResource {
    return new UserResource(this.client, id);
  }

  search(): SearchResource {
    return new SearchResource(this.client);
  }
}
```

#### 4. Main Export

```typescript
// src/index.ts
export { Arena } from './client';
export type * from './types';
export { ArenaError } from './utils/errors';
```

### Package Configuration

```json
// package.json
{
  "name": "arena-ts",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "test": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Benefits of Type-Safe Rewrite

1. **Autocomplete** - IDEs provide intelligent suggestions
2. **Compile-time errors** - Catch bugs before runtime
3. **Better documentation** - Types serve as inline docs
4. **Refactoring safety** - Changes are caught by the compiler
5. **Modern tooling** - Tree-shaking, ESM, better bundling
6. **Unit testing** - Easier to mock and test type-safe code

## Migration Path

For existing users of `are.na`:

```typescript
// Before (JavaScript)
const Arena = require('are.na');
const arena = new Arena();
const channel = await arena.channel('my-channel').contents({ per: 50 });

// After (TypeScript)
import { Arena } from 'arena-ts';
const arena = new Arena();
const channel = await arena.channel('my-channel').contents({ per: 50 });
// Now with full type checking and autocomplete!
```

## Resources

- [Are.na API Documentation](https://dev.are.na/documentation)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Building Libraries with TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html)
- [tsup - TypeScript bundler](https://tsup.egoist.dev/)
