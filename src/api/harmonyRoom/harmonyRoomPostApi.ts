import instance from '../axiosInstance';

export type HarmonyRoomBaseResponse = {
  success: boolean; // true
  code: number;     // 201
  message: string;  // "생성완료"
};

export type HarmonyRoomBaseResponse2 = {
  success: boolean;   // true
  code: number;       // 200
  message: string;    // "즐겨찾기 완료"
  data: null;         // null 고정
};

// 하모니룸 생성
export type CreateHarmonyRoomRequest = {
  name: string;
  category: string[];
  intro: string;
  profileImg: string;
};

export const createHarmonyRoom = async (
  payload: CreateHarmonyRoomRequest
): Promise<HarmonyRoomBaseResponse> => {
  const res = await instance.post<HarmonyRoomBaseResponse>('/api/posts/harmony', payload);

  return res.data;
};

// 하모니룸 수정
export type UpdateHarmonyRoomRequest = {
  name?: string;
  intro?: string;
  category?: string[];
  profileImg?: string;
  isPrivate?: boolean;
  isDirectAssign?: boolean;
};

export const updateHarmonyRoom = async (
  harmonyId: string,
  payload: UpdateHarmonyRoomRequest
): Promise<HarmonyRoomBaseResponse> => {
  const res = await instance.patch<HarmonyRoomBaseResponse>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/update`,
    payload
  );
  return res.data;
};

// 이미지 전송
export type UploadHarmonyImageResponse = BaseResponse<string>;

export const uploadHarmonyImage = async (
  harmonyId: string,
  file: { uri: string; name?: string; type?: string }
): Promise<string> => {
  const form = new FormData();
  const name =
    file.name ??
    `harmony_${Date.now()}.${(file.type?.split('/')[1] || 'jpg')}`;
  const type = file.type ?? 'image/jpeg';

  form.append('file', {
    // RN FormData 규격
    uri: file.uri,
    name,
    type,
  } as any);

  const res = await instance.post<UploadHarmonyImageResponse>(
    `/api/images/harmony/${encodeURIComponent(harmonyId)}`,
    form,
    {
        headers: {
        // boundary는 axios가 자동으로 붙입니다
        'Content-Type': 'multipart/form-data',
      },
  }
  );
  return (res.data as any).data;
};


// 하모니룸 삭제
export type DeleteHarmonyRoomRequest = {
  reason: string;
};

export const deleteHarmonyRoom = async (
  harmonyId: string,
  payload: DeleteHarmonyRoomRequest
): Promise<HarmonyRoomBaseResponse> => {
  const res = await instance.delete<HarmonyRoomBaseResponse>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/delete`,
    { data: payload } // <- axios는 delete시 body를 { data }로 보냄
  );

  return res.data;
}

// 하모니룸 가입 신청 유저 조회
export type waitingUser = {
    id: string;
    nickname: string;
    profileImgLink: string;
    intro: string;
};

export type waitingUserListDTO = {
    user: waitingUser[];
};

export const fetchWaitingUserList = async (
  harmonyId: string,
): Promise<waitingUserListDTO> => {
  const res = await instance.get<BaseResponse<waitingUserListDTO>>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/waitingUser`,
  );
  return res.data.data;
};

// 하모니룸 가입 승인/거부
export type ApproveDenyMemberRequest = {
  userID: string;
};

export const updateHarmonyMembership = async (
  harmonyId: string,
  action: 'approve' | 'deny',
  payload: ApproveDenyMemberRequest
): Promise<HarmonyRoomBaseResponse> => {
  const res = await instance.patch<HarmonyRoomBaseResponse>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/${action}`,
    payload
  );
  return res.data;
};

// 하모니룸 즐겨찾기
export const bookmarkHarmonyRoom = async (
  harmonyId: string
): Promise<HarmonyRoomBaseResponse2> => {
  // 바디 없음 → axios는 두 번째 인수에 {} 전달
  const res = await instance.post<HarmonyRoomBaseResponse2>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/bookmark`,
    {}
  );
  return res.data;
};

// 하모니룸 공유


// 하모니룸 신고


// 하모니룸 가입신청
export const requestJoinHarmonyRoom = async (
  harmonyId: string
): Promise<HarmonyRoomBaseResponse> => {
  // 바디 없음 → axios는 두 번째 인수에 {} 전달
  const res = await instance.post<HarmonyRoomBaseResponse>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/join`,
    { }
  );
  return res.data;
};

// 하모니룸 탈퇴
export const leaveHarmonyRoom = async (
  harmonyId: string,
): Promise<HarmonyRoomBaseResponse> => {
  const res = await instance.delete<HarmonyRoomBaseResponse>(
    `/api/harmony/${encodeURIComponent(harmonyId)}/leave`,
    { } // <- axios는 delete시 body를 { data }로 보냄
  );

  return res.data;
}


// 하모니룸 내부 피드 작성
export type CreateHarmonyRoomPostRequest = {
    content: string;
    mediaType: 'youtube' | string;
    tags: string[];
};

export const createHarmonyRoomPost = async (
  harmonyId: string,
  payload: CreateHarmonyRoomPostRequest
): Promise<HarmonyRoomBaseResponse> => {
  const res = await instance.post<HarmonyRoomBaseResponse>(
      `/api/harmony/${encodeURIComponent(harmonyId)}/posts`,
      payload
    );
  return res.data;
};
