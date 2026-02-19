/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://everythinghub.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'], // 서버 사이드 시트맵이 필요하면 추가
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://everythinghub.vercel.app/server-sitemap.xml', // 필요시
    ],
  },
}
