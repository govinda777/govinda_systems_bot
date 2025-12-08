import { Tenant } from '@/domain/tenant';
import { TenantRepository } from '@/domain/tenantRepository';

// In-memory "database" for tenants
let tenants: Tenant[] = [
  { id: 'localhost', name: 'Localhost Tenant' },
  { id: 'cliente1', name: 'Cliente Um' },
  { id: 'cliente2', name: 'Cliente Dois' },
];

export class MockTenantRepository implements TenantRepository {
  async findById(id: string): Promise<Tenant | null> {
    const tenant = tenants.find((t) => t.id === id);
    return Promise.resolve(tenant || null);
  }

  async save(tenantToSave: Tenant): Promise<void> {
    const index = tenants.findIndex((t) => t.id === tenantToSave.id);
    if (index !== -1) {
      // Update existing tenant
      tenants[index] = tenantToSave;
    } else {
      // Add new tenant
      tenants.push(tenantToSave);
    }
    console.log('Saved tenant:', tenantToSave);
    console.log('Current tenants in memory:', tenants);
    return Promise.resolve();
  }
}
