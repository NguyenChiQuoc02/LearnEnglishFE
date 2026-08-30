export type JwtResponse = {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
};

export type MessageResponse = {
  message: string;
};
