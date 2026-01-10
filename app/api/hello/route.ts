// src/app/api/hello/route.ts
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function GET() {
  return NextResponse.json({
    message: "Vercel 배포 성공!",
    project: config.project.name,
    env: config.env,
    isProd: config.isProd
  });
}