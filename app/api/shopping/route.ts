import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const display = searchParams.get('display') || '10';

  if (!query) {
    return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: '네이버 API 환경변수가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=${display}`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    );

    if (!response.ok) {
      throw new Error('네이버 API 요청에 실패했습니다.');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Shopping API Error:', error);
    return NextResponse.json(
      { error: '쇼핑 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
