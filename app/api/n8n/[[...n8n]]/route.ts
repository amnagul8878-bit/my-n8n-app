import { NextRequest, NextResponse } from 'next/server';

// @ts-ignore
import { Instance } from 'n8n'; 

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let n8nAppInstance: any = null;

async function initN8n() {
  if (!n8nAppInstance) {
    // N8nInstance ki jagah ab hum Instance use kar rahe hain
    n8nAppInstance = new Instance({
      database: {
        type: 'postgresdb',
        postgresdb: {
          connectionString: process.env.DB_POSTGRES_CONNECTION_STRING,
        }
      },
      security: {
        jwtSecret: process.env.N8N_JWT_SECRET || 'super-secure-32-character-jwt-secret-string',
      },
      path: '/api/n8n', 
    });
    
    await n8nAppInstance.init();
  }
  return n8nAppInstance;
}

export async function catchAllHandler(req: NextRequest) {
  try {
    const instance = await initN8n();
    const response = await instance.handleIncomingRequest(req);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'n8n setup failed' }, { status: 500 });
  }
}

export { catchAllHandler as GET, catchAllHandler as POST, catchAllHandler as PUT, catchAllHandler as DELETE };