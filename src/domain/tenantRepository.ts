import { Tenant } from './tenant';

export interface TenantRepository {
  findById(id: string): Promise<Tenant | null>;
  save(tenant: Tenant): Promise<void>;
}
