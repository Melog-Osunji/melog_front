import type {YouTubeVideoParsed, YouTubeVideo} from '@/types/providerTypes';
import {extractVideoId} from '@/utils/providers';

//YouTubeVideoParsed -> YouTubeVideo 변환
export function mapParsedToYouTubeVideo(
  parsed: YouTubeVideoParsed,
): YouTubeVideo {
  const id =
    extractVideoId(parsed.url) ||
    extractVideoId(parsed.thumbnail) ||
    parsed.url ||
    '';
  const thumbnail =
    parsed.thumbnail ||
    (id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '');
  return {
    id,
    url: parsed.url,
    title: parsed.title || '',
    channel: '',
    duration: parsed.description || '',
    thumbnail,
  };
}
