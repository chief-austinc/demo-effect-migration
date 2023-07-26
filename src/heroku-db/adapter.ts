import postgres from "postgres";
import { env } from "../env";
import { Effect } from "effect";

export class HerokuDatabaseAdapter {
  sql = postgres(env.HEROKU_DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
  });

  getAvatarForUsersByContactSfids(contactSfids: string[]) {
    return Effect.tryPromise({
      try: async () => {
        const results = await this.sql`
          SELECT p.avatar, p.sfid FROM profiles as p
          WHERE p.sfid IN (${contactSfids.join(",")})
        `;
        const contactSfidToAvatarMap = results.map((r) => ({
          contactSfid: r.sfid,
          avatar: r.avatar?.url,
        }));
        return contactSfidToAvatarMap;
      },
      catch: () => {},
    });
  }
}
