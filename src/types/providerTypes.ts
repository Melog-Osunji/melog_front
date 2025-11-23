export interface YouTubeVideo {
  id: string;
  url?: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

export interface YouTubeVideoParsed {
  url: string;
  title: string;
  thumbnail: string;
  description: string;
}
