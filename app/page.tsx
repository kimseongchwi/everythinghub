// src/app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>나의 잡다한 허브 메인</h1>
      <p>여기는 메인 페이지입니다. (Vue의 index.vue 역할)</p>
      
      {/* <a> 태그 대신 Next.js의 Link를 씁니다 */}
      <nav>
        <a href="/memo" style={{ marginRight: '10px' }}>메모장으로 이동</a>
      </nav>
    </main>
  );
}