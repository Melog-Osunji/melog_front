const introNavigations = {
  //첫화면
  INTRO_WELCOME: 'IntroWelcome',
  //시작 전 온보딩
  PRE_ONBOARDING: 'PreOnboarding',
  //로그인
  INTRO_LOGIN: 'IntroLogin',
  //이용약관
  TOS_CONSENTLIST: 'ConsentList',
  TOS_AGREEMENT_VIEWER: 'AgreementViewer',
  //프로필설정
  INTRO_PROFILE: 'IntroProfile',
  //온보딩
  INTRO_ONBOARDING_1: 'IntroOnboarding1',
  INTRO_ONBOARDING_2: 'IntroOnboarding2',
  INTRO_ONBOARDING_3: 'IntroOnboarding3',
} as const;

const postNavigations = {
  POST_HOME: 'PostList',
  POST_PAGE: 'PostPage',
  POST_CREATE: 'PostCreate',
  POST_SEARCH: 'PostSearch',
  POST_SEARCH_RESULT: 'PostSearchResult',
} as const;

const harmonyNavigations = {
  HARMONY_HOME: 'HarmonyList',
  HARMONY_PAGE: 'HarmonyPage',
  HARMONY_CREATE: 'HarmonyCreate',
  HARMONY_INFO: 'HarmonyInfo',
  HARMONY_EDIT: 'HarmonyEdit',
  HARMONY_SETTING: 'HarmonySetting',
  HARMONY_LIST: 'HarmonyRoomList',
  HARMONY_APPLY: 'HarmonyApply',
  HARMONY_POST: 'HarmonyPost',
  HARMONY_POST_PAGE: 'HarmonyPostPage',
  HARMONY_SEARCH: 'HarmonySearch',
  HARMONY_SEARCH_RESULT: 'HarmonySearchResult',
  HARMONY_FEED: 'HarmonyFeed',
} as const;

//프로필설정
const InitProfileNavigations = {
  INIT_PROFILE_IMG: 'InitProfileImg',
  INIT_PROFILE_NICKNAME: 'InitProfileNickname',
  INIT_PROFILE_INTRODUCTION: 'InitProfileIntroduction',
} as const;

// mypage
const myPageNavigations = {
  MYPAGE_HOME: 'MyPageHome',
  MYPAGE_EDIT: 'MyPageEdit',
  MYPAGE_POST_PAGE: 'MyPagePostPage',
  MYPAGE_HARMONY_STACK: 'MyPageHarmonyStack',
} as const;

// settings
const settingsNavigations = {
  SETTINGS_HOME: 'SettingsHome', //설정 및 더보기
  ACTIVITY_SCOPE: 'ActivityScope', //나의 활동 범위
  FOLLOWER_REQUESTS: 'FollowerRequests',  //팔로워 요청 관리
  BLOCKED_USERS: 'BlockedUsers',  //차단한 사용자 관리
  NOTICES: 'Notices', //공지사항
  SUPPORT: 'Support', //문의하기
  SUPPORT_FORM: 'SupportForm', //문의 전송 화면
  TERMS_OF_SERVICE: 'TermsOfService', //이용약관
  PRIVACY_POLICY: 'PrivacyPolicy', //개인정보 처리방침 
  LANGUAGE_SETTING: 'LanguageSetting', //언어 설정
  ACCOUNT_DELETE: 'AccountDelete', //탈퇴하기 
} as const;

export {introNavigations};
export {postNavigations};
export {harmonyNavigations};
export {InitProfileNavigations};
export {myPageNavigations};
export {settingsNavigations};
