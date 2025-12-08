import { OnboardingInfo, Tenant } from '@/domain/tenant';
import { TenantRepository } from '@/domain/tenantRepository';

export class OnboardTenant {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(tenantId: string, onboardingInfo: OnboardingInfo): Promise<Tenant | null> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      // Or handle this as an error
      return null;
    }

    // Attach onboarding info and save
    tenant.onboarding = onboardingInfo;
    await this.tenantRepository.save(tenant);

    return tenant;
  }
}
