export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  OWNER = 'OWNER',
  PDG = 'PDG',
  DG = 'DG',
  ADG = 'ADG',
  ASSISTANT = 'ASSISTANT',
}

export enum UserStatus {
  REGISTERED = 'REGISTERED',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED',
  BANNED = 'BANNED',
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

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

export type UserResponse = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  status: UserStatus;
  createdAt: Date;
  firstName: string;
  lastName: string;
  role: UserRole;
};
