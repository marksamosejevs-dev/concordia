export interface InstagramPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

interface GraphMediaItem {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
}

/**
 * Fetches the latest posts from the Instagram Graph API (graph.instagram.com),
 * revalidated hourly so new posts show up without a redeploy. Returns null
 * (rather than throwing) whenever the feed can't be loaded — missing token,
 * expired token, network error — so callers can fall back gracefully.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const fields = "id,media_type,media_url,thumbnail_url,permalink,caption";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = (await res.json()) as { data?: GraphMediaItem[] };
    if (!data.data) return null;

    return data.data
      .filter((item) => item.media_type !== "VIDEO" || item.thumbnail_url)
      .slice(0, limit)
      .map((item) => ({
        id: item.id,
        mediaUrl: item.media_type === "VIDEO" ? item.thumbnail_url! : item.media_url,
        permalink: item.permalink,
        caption: item.caption,
        mediaType: item.media_type,
      }));
  } catch {
    return null;
  }
}
