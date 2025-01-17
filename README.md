This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## environment variables to be set in .env file:
```
DATABASE_URL="mysql://username:password@localhost:3306/tsp_payroll_cloud" 
SiteURL="localhost:3000"
AUTH_SECRET="Any value "
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Same value as Auth_secret"
OPENAI_API_KEY=api key from open ai
```
## Docker compose file (only to build in Docker)
1. Create a file in the root directory named "docker-compose.yml" 
2. Add below code and change variables as necessary. 

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: "mysql://username:password@host.docker.internal:3306/tsp_payroll_cloud"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "Any random value"
    ports:
      - "3000:3000"
    restart: unless-stopped
```





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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
