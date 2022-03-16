namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
      GOOGLE_ID: string
      GOOGLE_SECRET: string
      FACEBOOK_CLIENT_ID: string
      FACEBOOK_CLIENT_SECRET: string
      DATABASE_URL: string
      SECRET: string
    }
  }