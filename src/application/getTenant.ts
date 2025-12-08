import { Tenant } from '@/domain/tenant';
import { TenantRepository } from '@/domain/tenantRepository';

export class GetTenant {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(tenantId: string): Promise<Tenant | null> {
    return this.tenantRepository.findById(tenantId);
  }
}
