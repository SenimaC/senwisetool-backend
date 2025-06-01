export enum CompanyStatus {
  BUILDING = 'BUILDING',
  PENDING = 'PENDING',
  UNACTIVE = 'UNACTIVE',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  REJECTED = 'REJECTED',
  MAINTENANCE = 'MAINTENANCE',
  CLOSE = 'CLOSE',
}

export enum OnboardingStep {
  COMPANY = 'COMPANY',
  LOCATION = 'LOCATION',
  CONTACT = 'CONTACT',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export type CompanyResponse = {
  id: string;
  name: string;
  description: string;
  sector: string;
  logo: string;
  authorization: string;
  country: string | null;
  region: string | null;
  city: string | null;
  address: string | null;
  email: string | null;
  phoneNumber: string | null;
  isEmailVerified: boolean;
  bucketName: string | null;
  status: CompanyStatus;
  onboardingSteps: number[];
  createdAt: Date;
};
