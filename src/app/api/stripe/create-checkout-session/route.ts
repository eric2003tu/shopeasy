import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Minimal placeholder for Stripe Checkout Session creation.
// This keeps the route as a valid module during the demo build.
export async function POST(req: NextRequest) {
	try {
		// In a production integration you'd parse the body and call Stripe's API
		// using STRIPE_SECRET_KEY to create a Checkout Session and return the
		// session URL or client_secret. This placeholder intentionally returns
		// 501 Not Implemented so the frontend can be wired later.
		return NextResponse.json({ error: 'Not implemented: create-checkout-session' }, { status: 501 });
		} catch {
			return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
		}
}

export const runtime = 'edge';
