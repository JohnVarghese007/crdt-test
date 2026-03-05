export interface Session {
  token: string;
  user: {
    _id: string;
    username: string;
  };
}
