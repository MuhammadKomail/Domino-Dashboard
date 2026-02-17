// utils/routeMappings.ts
export const routeMappings: { [key: string]: string[] } = {
    '/dashboard': [
      '/totp/itotpfeature/getallaccountinfo',
      '/auth/iauthfeature/generateotp',
    ],
    '/profile': ['/auth/iauthfeature/verifyotp'],
    '/settings': ['/totp/itotpfeature/updatefavourite'],
  };
  