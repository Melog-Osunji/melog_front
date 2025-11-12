import {
  SearchResultItem,
} from '@/api/search/searchResultApi';
import {
  PostDTO,
  UserDTO,
  PostWithUserDTO,
} from '@/types/postTypes';

// ⏺ SearchUser → UserDTO
export const convertToUserDTO = (user: any): UserDTO => ({
  id: user.id,
  nickName: user.nickname, // ✅ 이름 변경
  profileImg: user.profileImageUrl, // ✅ key 변경
});

// ⏺ SearchPost → PostDTO
export const convertToPostDTO = (post: any): PostDTO => ({
  id: post.id,
  title: post.title,
  content: post.content,
  mediaType: post.mediaType,
  mediaUrl: post.mediaUrl,
  tags: post.tags ?? [],
  createdAgo: calcCreatedAgo(post.createdAt), // ✅ createdAt → createdAgo
  likeCount: post.likeCount ?? 0,
  hiddenUser: post.hiddenUsers ?? [],
  commentCount: post.commentCount ?? 0, // 백엔드에서 제공되면 그대로
  bestComment: undefined, // 필요 시 매핑
});

// ⏺ 날짜 차이 계산 (예시)
const calcCreatedAgo = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
  return diffHours;
};

// ⏺ SearchResultItem → PostWithUserDTO
export const convertToPostWithUserDTO = (
  item: SearchResultItem
): PostWithUserDTO => ({
  post: convertToPostDTO(item.post),
  user: convertToUserDTO(item.user),
});

// ⏺ 전체 변환
export const convertSearchResponse = (results: SearchResultItem[]): PostWithUserDTO[] =>
  results.map(convertToPostWithUserDTO);
