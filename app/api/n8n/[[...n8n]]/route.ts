import { NextRequest, NextResponse } from 'next/server';

// @ts-ignore
import { N8N } from 'n8n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let n8nInstance: any = null;

async function getN8NHandler() {
  if (!n8nInstance) {
    // Hum built-in N8N method use kar rahe hain jo internally sab handle karta hai
    n8nInstance = await N8N.create({
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
  }
  return n8nInstance;
}

export async function catchAllHandler(req: NextRequest) {
  try {
    const n8n = await getN8NHandler();
    // Yeh line automatic request ko process karegi bina kisi error ke
    const response = await n8n.handleRequest(req);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'n8n execution failed' }, { status: 500 });
  }
}

export { catchAllHandler as GET, catchAllHandler as POST, catchAllHandler as PUT, catchAllHandler as DELETE };