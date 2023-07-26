import * as z from "zod";

const EnvSchema = z.object({
  SENDBIRD_APP_ID: z.string(),
  SENDBIRD_API_TOKEN: z.string(),
  HEROKU_DATABASE_URL: z.string(),
  USER_SERVICE_DATABASE_URL: z.string(),
});

export const env = EnvSchema.parse(process.env);
