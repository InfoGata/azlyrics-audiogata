import azlyrics from "js-azlyrics";
import "@infogata/audiogata-plugin-typings";

// Monkey patch fetch to use application.networkRequest
(globalThis as any).fetch = async (url: string, options?: RequestInit) => {
  return application.networkRequest(url, options);
};

const SEARCH_URL = "https://search.azlyrics.com";
const MAIN_URL = "https://www.azlyrics.com";

export const getLyrics = async (
  request: GetLyricsRequest
): Promise<GetLyricsResponse> => {
  const isCorsDisabled = await application.isNetworkRequestCorsDisabled();
  if (!isCorsDisabled) {
    application.createNotification({
      type: "error",
      message: "InfoGata extension must be enabled to use this plugin.",
    });
    return { lyrics: "" };
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
    searchEndpoint: SEARCH_URL,
    mainEndpoint: MAIN_URL
  });
  return { lyrics: lyricsRespone.lyrics };
};

application.onGetLyrics = getLyrics;
