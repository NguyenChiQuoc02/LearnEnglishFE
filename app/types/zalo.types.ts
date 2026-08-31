export type ZaloAuthUrlResponse = {
  url: string;
};

export type ZaloStatusResponse = {
  connected: boolean;
};

export type ZaloLinkCodeResponse = {
  code: string;
  followUrl: string;
  expiresAt: string;
};

export type ZaloMeResponse = {
  linked: boolean;
};
