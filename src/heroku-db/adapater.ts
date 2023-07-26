import postgres from "postgres";
import { env } from "../env";

export class HerokuDatabase {
  sql = postgres(env.HEROKU_DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
  });
}
