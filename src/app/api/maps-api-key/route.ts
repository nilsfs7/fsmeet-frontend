import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow requests from the same origin for security
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // Basic security check - ensure request is from the same domain
  if (origin && !origin.includes(host || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  return NextResponse.json({ apiKey });
}
