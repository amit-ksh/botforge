# BotForge

BotForge is a realtime AI application used for creating AI bots. These bots can used in the application and integrated into other websites through a REST API.

Live: https://botforge.vercel.app/

## Technologies Used

- [Next.js 13](https://nextjs.org/docs/getting-started)
- [Convex](https://convex.dev)
- [OpenAI](https://openai.com/)
- [Pinecone](https://www.pinecone.io/)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Demo

[![BotForge Demo](https://img.youtube.com/vi/MoN72bifz_c/0.jpg)](https://www.youtube.com/watch?v=MoN72bifz_c)

## Setup

1. Clone the repo and install dependencies
   ```bash
    git clone https://github.com/amit-ksh/botforge
    cd botforge
    npm install or pnpm install or yarn install
   ```
2. Create `.env` file and create the following variables, also save these to your convex envirnoment variables

   ```bash
    CONVEX_DEPLOYMENT="dev:CONVEX_DEPLOY_KEY"

    NEXT_PUBLIC_CONVEX_URL="CONVEX_URL"

    # https://docs.convex.dev/auth/clerk
    CLERK_ISSUE_URL="CLERK_ISSUE_URL"
    CLERK_JWKS_ENDPOINT="CLERK_JWKS_ENDPOINT"

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="CLERK_PUBLISHABLE_KEY"
    CLERK_SECRET_KEY="CLERK_SECRET_KEY"

    OPENAI_API_KEY="OPENAI_API_KEY"
    PINECONE_API_KEY="PINECONE_API_KEY"
    PINECONE_ENVIRONMENT="PINECONE_ENVIROMENT"
    PINECONE_INDEX_NAME="PINECONE_INDEX_NAME"
   ```

3. Run `pnpm dev:backend` in your CLI
4. Run `pnpm dev` in your CLI
5. Open http://localhost:3000
