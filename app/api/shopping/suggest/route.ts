import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ items: [] });
  }

  try {
    // 네이버 검색 자동완성 엔드포인트
    const response = await fetch(
      `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(query)}&con=1&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&run=2&rev=4&q_enc=UTF-8&st=100`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch suggestions');

    const data = await response.json();
    
    // 네이버 자동완성 데이터 구조: [[["키워드", ...], ...]]
    const suggestions = data.items[0].map((item: any[]) => item[0]);

    return NextResponse.json({ items: suggestions });
  } catch (error) {
    console.error('Suggest API Error:', error);
    return NextResponse.json({ items: [] });
  }
}
