import { describe, expect, test } from "vitest";
import { getLyrics } from "../src";
import { application } from "./application";

describe("index", () => {
  test("Can get lyrics", async () => {
    const lyricsResponse = await getLyrics({
      trackName: "Kendrick Lamar - Alright",
    });
    expect(lyricsResponse.lyrics).not.toBeNull();
  });

  test("Can get lyrics with artistName", async () => {
    const lyricResponse = await getLyrics({
      trackName: "Alright",
      artistName: "Kendrick Lamar",
    });
    expect(lyricResponse.lyrics).not.toBeNull();
  });

  test("Can get lyrics with extra info", async () => {
    const lyricResponse = await getLyrics({
      trackName: "Doja Cat - Demons (Official Video)",
    });
    console.log(lyricResponse);
    expect(lyricResponse.lyrics).not.toBeNull();
  });
});
