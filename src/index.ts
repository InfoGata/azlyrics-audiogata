import azlyrics from "js-azlyrics";

const SEARCH_URL = "https://search.azlyrics.com";
const MAIN_URL = "https://www.azlyrics.com";
const defaultProxy = "https://cloudcors.audio-pwa.workers.dev/";

export const getLyrics = async (
  request: GetLyricsRequest
): Promise<GetLyricsResponse> => {
  let proxy = await application.getCorsProxy();
  if (!proxy) {
    proxy = defaultProxy;
  }
  let query = request.trackName;
  if (request.artistName) {
    query = `${request.artistName} - ${request.artistName}`;
  } else {
    // If only have trackName, remove things like (Official Video)
    // by removing things between parentheses
    query = query.replace(/ *\([^)]*\) */g, "");
  }
  const lyricsRespone = await azlyrics.get(query, {
    searchEndpoint: `${proxy}${SEARCH_URL}`,
    mainEndpoint: `${proxy}${MAIN_URL}`,
  });
  return { lyrics: lyricsRespone.lyrics };
};

application.onGetLyrics = getLyrics;
