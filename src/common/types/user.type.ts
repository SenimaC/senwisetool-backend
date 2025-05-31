export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  OWNER = 'OWNER',
  PDG = 'PDG',
  DG = 'DG',
  ADG = 'ADG',
  ASSISTANT = 'ASSISTANT',
}

export enum UserRegisterSource {
  SCRIPT = 'SCRIPT',
  PUBLIC = 'PUBLIC',
  DEVELOPER = 'DEVELOPER',
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

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
};
