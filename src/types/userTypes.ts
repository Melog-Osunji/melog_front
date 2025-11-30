export type ProfileDTO = {
  id: string;
  email?: string;
  intro?: string;
  nickName: string;
  platform: string;
  profileImg?: string;
};

export type followingCheckDTO = {
  result: boolean;
  status: "REQUESTED" | "ACCEPTED" | "BLOCKED" | "UNFOLLOW";
};