declare module "js-azlyrics" {
  export function get(
    query: string,
    options?: { searchEndpoint: string; mainEndpoint: string }
  ): Promise<{ lyrics: string; songs: string; artist: string }>;
}
