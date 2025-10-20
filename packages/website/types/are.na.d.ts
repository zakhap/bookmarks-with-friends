declare module 'are.na' {
  export default class Arena {
    constructor(config?: { accessToken?: string });
    channel(slug: string): {
      contents(options?: { per?: number; sort?: string; direction?: string }): Promise<any[]>;
      get(): Promise<any>;
    };
  }
}
