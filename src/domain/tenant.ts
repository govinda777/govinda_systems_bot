export interface OnboardingInfo {
  userName: string;
  userEmail: string;
  botName: string;
}

export interface Tenant {
  id: string;
  name: string;
  onboarding?: OnboardingInfo; // Add onboarding data to the tenant
}
