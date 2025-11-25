import { META, ANIME } from "@consumet/extensions";

const getParser = (provider: string) => {
  switch (provider) {
    case "animekai":
      return new ANIME.AnimeKai();
    case "animepahe":
      return new ANIME.AnimePahe();
    default:
      return new ANIME.Hianime();
  }
};

const getAnilist = (provider: string) => {
  const parser = getParser(provider);
  return new META.Anilist(parser);
};

export const getAnimeData = async (animeId: string, provider: string) => {
  const anilist = getAnilist(provider);
  return await anilist.fetchAnimeInfo(animeId);
};

export const getAnimeEpisodeData = async (animeId: string, provider: string) => {
  const anilist = getAnilist(provider);
  const info = await anilist.fetchAnimeInfo(animeId);
  return info.episodes || [];
};

export const getAnimeEpisodeLinks = async (episodeId: string, provider: string) => {
  const anilist = getAnilist(provider);
  return await anilist.fetchEpisodeSources(episodeId);
};

export const getAnimeSearch = async (query: string, count: number) => {
  const anilist = getAnilist("zoro");
  return await anilist.search(query, 1, count);
};

export const getTopAnime = async (count: number, provider: string) => {
  const anilist = getAnilist(provider);
  const popular = await anilist.fetchPopularAnime(1, count);
  const sorted = {
    ...popular,
    results: [...popular.results].sort((a: any, b: any) => (b.score || 0) - (a.score || 0)),
  };
  return sorted;
};

export const getAnimeTrending = async (count: number, provider: string) => {
  const anilist = getAnilist(provider);
  return await anilist.fetchTrendingAnime(1, count);
};

export const getAnimePopular = async (count: number, provider: string) => {
  const anilist = getAnilist(provider);
  return await anilist.fetchPopularAnime(1, count);
};

export const getAnimeNew = async (count: number, provider: string) => {
  const anilist = getAnilist(provider);
  const popular = await anilist.fetchPopularAnime(1, count * 2);
  const filtered = popular.results.filter((a: any) => a.status === "RELEASING").slice(0, count);
  return { ...popular, results: filtered };
};

export const getAnimeGenre = async (genre: string, count: number) => {
  const anilist = getAnilist("zoro");
  return await anilist.fetchAnimeGenres([genre], 1, count);
};

export const getUpcomingAnime = async (count: number, provider: string) => {
  const anilist = getAnilist(provider);
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const weekStart = Math.floor(monday.getTime() / 1000);
  const weekEnd = Math.floor(sunday.getTime() / 1000);
  return await anilist.fetchAiringSchedule(1, count, weekStart, weekEnd, true);
};

export const getExternalLink = async (episodeId: string, provider: string = "zoro") => {
  const anilist = getAnilist(provider);
  return await anilist.fetchEpisodeSources(episodeId);
};