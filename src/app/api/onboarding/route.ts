import { NextRequest, NextResponse } from 'next/server';
import { OnboardTenant } from '@/application/onboardTenant';
import { MockTenantRepository } from '@/infrastructure/mockTenantRepository';
import { OnboardingInfo } from '@/domain/tenant';

export async function POST(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id');
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID is missing' }, { status: 400 });
    }

    const body = await request.json();
    const onboardingInfo: OnboardingInfo = {
      userName: body.name,
      userEmail: body.email,
      botName: body.botName,
    };

    // --- Execute the Use Case ---
    const tenantRepository = new MockTenantRepository();
    const onboardTenant = new OnboardTenant(tenantRepository);
    const updatedTenant = await onboardTenant.execute(tenantId, onboardingInfo);
    // -------------------------

    if (!updatedTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tenant: updatedTenant });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
