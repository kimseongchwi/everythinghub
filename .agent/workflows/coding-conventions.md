# 📜 프로젝트 코딩 컨벤션 (Coding Conventions)

이 문서는 프로젝트의 일관성을 유지하기 위한 핵심 스타일 가이드를 담고 있습니다.

---

## 1. 언어 및 주석 (Language & Comments)
- **주석 언어**: 모든 코드 내 주석은 반드시 **한국어**로 작성합니다.
- **사용자 메시지**: `alert`, `confirm`, 모달 메시지 등 사용자에게 보여지는 텍스트는 **한국어**를 사용합니다.

## 2. 코드 포맷팅 규칙 (Formatting & Styles)

### 2.1 따옴표 및 문자열 (Quotes & Strings)
- **로직 (TS/JS)**: 일반적인 문자열 리터럴에는 **홑따옴표 (`'`)**를 사용합니다.
  - 예: `const status = 'active';`
- **JSX 속성 (Attributes)**: HTML/JSX 속성 값에는 **쌍따옴표 (`"`)**를 사용합니다.
  - 예: `<div className="container" id="main">`
- **백틱 (`` ` ``)**: 변수 삽입(`${var}`)이 필요한 위치나 멀티라인 텍스트에만 사용합니다.

### 2.2 구문 스타일
- **세미콜론 (Semicolon)**: 모든 문장의 끝에는 생략 없이 **세미콜론 (`;`)**을 붙입니다.
- **들여쓰기 (Indent)**: 공백 **2칸 (Space 2)**을 사용합니다.
- **불필요한 로그**: 개발 시 사용한 `console.log`는 배포 전 삭제하거나 `console.error`로 교체합니다.

## 3. 리액트 컴포넌트 구조 (React Components)

### 3.1 Import 정렬 순서
1. `react`, `next` 등 프레임워크 핵심
2. 외부 npm 패키지 (lucide-react, framer-motion 등)
3. `@/`로 시작하는 내부 모듈 (components, lib, hooks 등)
4. 상대 경로 파일 및 스타일 (`./style.css`)

### 3.2 컴포넌트 내부 로직 순서
1. `useState` (상태 정의)
2. `useRef` (참조)
3. `useEffect` (생명주기 및 부수 효과)
4. `Handle Functions` (이벤트 및 비즈니스 로직)
5. `return JSX` (렌더링)

---

## 4. Tailwind CSS 클래스 정렬
클래스명이 길어질 경우 아래 순서로 배치하여 가독성을 높입니다.
1. `Layout` (flex, grid, absolute 등)
2. `Box Model` (margin, padding, width, height)
3. `Typography` (text-size, font-weight 등)
4. `Visuals` (bg, border, shadow)
5. `State` (hover, focus, active)

## 5. 데이터베이스 및 UI 필수 규칙 (DB & UX)
- **Prisma**: 관계 설정 시 `connect` 대신 `attachmentId: id`와 같이 ID를 직접 할당하는 방식을 우선시합니다.
- **UI 피드백**: 데이터 저장/수정/삭제 시 성공/실패 여부를 `alert()`로 알립니다.
- **위험 작업**: 삭제 전에는 반드시 `confirm()`을 거칩니다.
