This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Management

Prisma를 사용하여 데이터베이스 스키마를 업데이트하고 클라이언트를 생성하는 명령어입니다:

### 1. Prisma Client 생성
스키마 변경 후 TypeScript 타입을 생성합니다.
```bash
npx prisma generate
```

### 2. DB 스키마 업데이트

스키마 변경 사항을 DB에 반영하는 방법은 두 가지가 있습니다:

#### A. 일반적인 업데이트 (추천)
데이터를 최대한 유지하면서 변경 사항(새 컬럼 등)만 반영하고 기록(Migration)을 남깁니다.
```bash
npx prisma migrate dev --name [변경명칭]
```
**예시 (현재 프로젝트의 CamelCase 필드 기준):**
*   `npx prisma migrate dev --name renameRoleToPosition` (회원 role 필드를 position으로 변경)
*   `npx prisma migrate dev --name addDetailedEducationFields` (학력 startDate, endDate, degreeStatus 필드 추가)
*   `npx prisma migrate dev --name addSortOrderToItems` (정렬을 위한 sortOrder 필드 추가)

#### B. 빠른 프로토타이핑 (db push)
마이그레이션 기록 없이 즉시 스키마를 동기화합니다. (개발 초기 단계에 유용)
```bash
npx prisma db push
```

> [!CAUTION]
> 필드 이름 변경 등 파괴적인 변경이 있을 경우 `db push`는 데이터 유실 경고를 띄웁니다. 기록이 필요하거나 안전한 업데이트를 원한다면 **Migrate** 방식을 사용하세요. 초기화가 필요한 특수한 경우에만 `--force-reset`을 사용합니다.

### 3. Prisma Studio 실행
브라우저에서 직접 데이터를 확인하고 수정할 수 있습니다.
```bash
npx prisma studio
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
