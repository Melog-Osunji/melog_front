const introNavigations = {
  //첫화면
  INTRO_WELCOME: 'IntroWelcome',
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
} as const;

const harmonyNavigations = {
  HARMONY_HOME: 'HarmonyList',
  HARMONY_PAGE: 'HarmonyPage',
  HARMONY_CREATE: 'HarmonyCreate',
} as const;

export {introNavigations};
export {postNavigations};
export {harmonyNavigations};
