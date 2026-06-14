export type AuthInfo = {
  id: number;
  email: string;
  name: string;
  avatarUrl: string;
  isPro: boolean;
  token: string;
};

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}
