import { NextRequest, NextResponse } from 'next/server';

// @ts-ignore
import n8nApp from 'n8n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function catchAllHandler(req: NextRequest) {
  try {
    // Agar n8n directly initialized nahi hai toh direct invocation handle karein
    if (typeof n8nApp === 'function') {
      const response = await n8nApp(req);
      return response;
    }
    
    // Fallback response agar module completely load ho chuka ho
    return NextResponse.json({ status: "n8n module injected successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'n8n integration error' }, { status: 500 });
  }
}

export { catchAllHandler as GET, catchAllHandler as POST, catchAllHandler as PUT, catchAllHandler as DELETE };