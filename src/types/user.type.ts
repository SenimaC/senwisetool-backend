export enum UserRole {
  OWNER = 'OWNER',
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN',
}

export enum AccountRole {
  ADG = 'ADG',
  AGENT = 'AGENT',
  INSPECTOR = 'INSPECTOR',
  TRAINER = 'TRAINER',
}

export interface JwtUser {
  id: string;
  email: string;
}
