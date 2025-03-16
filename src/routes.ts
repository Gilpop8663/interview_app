export const LAYOUT_PATHS = {
  TABS: '/(tabs)',
  AUTH: '/(auth)',
};

export const ROUTES = {
  INDEX: '/index',
  HOME: `${LAYOUT_PATHS.TABS}`,
  INTERVIEW: `${LAYOUT_PATHS.TABS}/interview`,
  SETTINGS: `${LAYOUT_PATHS.TABS}/settings`,
  LOGIN: `${LAYOUT_PATHS.AUTH}/login`,
  SIGNUP: `${LAYOUT_PATHS.AUTH}/signUp`,
  FORGOT_PASSWORD: `${LAYOUT_PATHS.AUTH}/forgotPassword`,
  RESET_PASSWORD: `${LAYOUT_PATHS.AUTH}/resetPassword`,
  ACCOUNT_SETTING: `${LAYOUT_PATHS.AUTH}/accountSetting`,
  MODAL: 'modal',
};
