import postgres from "postgres";
import { env } from "../env";
import { Effect } from "effect";

export class HerokuDatabaseAdapter {
  sql = postgres(env.HEROKU_DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
  });

  private readonly queryByContactSfids = (contactSfids: string[]) => this.sql`
    SELECT p.avatar, p.sfid FROM profiles as p
    WHERE p.sfid IN ${this.sql(contactSfids)}
  `;

  public getAvatarForUsersByContactSfids(contactSfids: string[]) {
    return Effect.tryPromise({
      try: () =>
        this.queryByContactSfids(contactSfids).then((results) =>
          results.map((r) => ({
            contactSfid: r.sfid,
            avatar: r.avatar?.url,
          }))
        ),
      catch: (e) => {
        console.log(e);
      },
    });
  }
}
