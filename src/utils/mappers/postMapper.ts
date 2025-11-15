import {PostWithUserDTO} from '@/types/postTypes';

// mapper : PostWithUserDTO로 정규화
export function normalizePostWithUser(raw: any): PostWithUserDTO {
  const rawPost = raw.post ?? raw;
  const post = {
    id: String(raw.id),
    title: raw.title ?? '',
    content: raw.content ?? '',
    mediaType: raw.mediaType ?? 'text',
    mediaUrl: raw.mediaUrl ?? '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    createdAgo: raw.createdAgo ?? undefined,
    likeCount: Number(raw.likeCount ?? 0),
    hiddenUser: raw.hiddenUser,
    commentCount: Number(raw.commentCount ?? 0),
    bestComment: raw.bestComment ?? undefined,
  };

  const user =
    raw.user ??
    raw.userObj ??
    ({
      id: rawPost.userId ?? raw.userId ?? '',
      nickName: rawPost.nickName ?? raw.nickName ?? '',
      profileImg: rawPost.profileImg ?? raw.profileImg ?? '',
    } as any);

  return {post, user};
}

// list용 정규화 함수
export function normalizePostsList(rawList: any): PostWithUserDTO[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(item => normalizePostWithUser(item));
}
