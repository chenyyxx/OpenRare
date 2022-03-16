namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
      GOOGLE_ID: string
      GOOGLE_SECRET: string
      TWITTER_ID: string
      TWITTER_SECRET: string
      DATABASE_URL: string
      SECRET: string
    }
  }