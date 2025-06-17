import { Company, Role, User } from '@prisma/client';
import { CompanyResponse } from './company.type';
export enum UserRoles {
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

// export enum UserRegisterSource {
//   SCRIPT = 'SCRIPT',
//   PUBLIC = 'PUBLIC',
//   DEVELOPER = 'DEVELOPER',
// }

export enum AccountRole {
  ADG = 'ADG',
  AGENT = 'AGENT',
  INSPECTOR = 'INSPECTOR',
  TRAINER = 'TRAINER',
}

export type CurrentUser = User & {
  Company: Company;
  Role: Role;
};

export type UserResponse = {
  id: string;
  email: string;
  isEmailVerified: boolean;
  status: UserStatus;
  createdAt: Date;
  firstName: string;
  lastName: string;
  company: CompanyResponse | null;
  role: Role;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
};
