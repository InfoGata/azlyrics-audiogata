import "@infogata/audiogata-plugin-typings";

const normalizeForUrl = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/^the\s+/i, "")
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/[^a-z0-9]/g, "");
};

const parseArtistAndSong = (
  request: GetLyricsRequest
): { artist: string; song: string } => {
  let artist = request.artistName || "";
  let song = request.trackName || "";

  if (!artist && song.includes(" - ")) {
    const parts = song.split(" - ");
    artist = parts[0].trim();
    song = parts.slice(1).join(" - ").trim();
  }

  return { artist, song };
};

const extractLyrics = (html: string): string => {
  const match = html.match(
    /<!-- Usage of azlyrics[\s\S]*?-->\s*([\s\S]*?)<\/div>/
  );
  if (!match) return "";
  return match[1]
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
};

const findSongOnArtistPage = async (
  artist: string,
  song: string
): Promise<string | null> => {
  const firstLetter = artist.charAt(0);
  const artistPageUrl = `https://www.azlyrics.com/${firstLetter}/${artist}.html`;

  try {
    const response = await application.networkRequest(artistPageUrl);
    if (!response.ok) return null;
    const html = await response.text();

    const linkPattern = new RegExp(
      `href="(/lyrics/${artist}/[^"]+\\.html)"[^>]*>([^<]+)<`,
      "gi"
    );
    const normalizedSearch = song.toLowerCase().replace(/[^a-z0-9]/g, "");

    let match;
    while ((match = linkPattern.exec(html)) !== null) {
      const songPath = match[1];
      const songTitle = match[2].toLowerCase().replace(/[^a-z0-9]/g, "");

      if (
        songTitle.includes(normalizedSearch) ||
        normalizedSearch.includes(songTitle)
      ) {
        return `https://www.azlyrics.com${songPath}`;
      }
    }
  } catch {
    return null;
  }
  return null;
};

export const getLyrics = async (
  request: GetLyricsRequest
): Promise<GetLyricsResponse> => {
  if (!(await application.isNetworkRequestCorsDisabled())) {
    await application.createNotification({
      type: "error",
      message: "InfoGata extension must be enabled to use this plugin.",
    });
    return { lyrics: "" };
  }

  const { artist, song } = parseArtistAndSong(request);
  const normalizedArtist = normalizeForUrl(artist);
  const normalizedSong = normalizeForUrl(song);

  if (!normalizedArtist || !normalizedSong) {
    return { lyrics: "" };
  }

  // Try direct URL first
  const url = `https://www.azlyrics.com/lyrics/${normalizedArtist}/${normalizedSong}.html`;

  try {
    let response = await application.networkRequest(url);

    // Fallback: search artist page if direct URL fails
    if (!response.ok) {
      const fallbackUrl = await findSongOnArtistPage(
        normalizedArtist,
        normalizedSong
      );
      if (!fallbackUrl) return { lyrics: "" };
      response = await application.networkRequest(fallbackUrl);
    }

    const html = await response.text();
    const lyrics = extractLyrics(html);
    return { lyrics };
  } catch {
    return { lyrics: "" };
  }
};

application.onGetLyrics = getLyrics;
