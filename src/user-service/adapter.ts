import { Effect } from "effect";
import postgres from "postgres";
import { env } from "../env";

export class UserServiceDatabaseAdapter {
  sql = postgres(env.USER_SERVICE_DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
  });

  public readonly getUsersFromDb = Effect.tryPromise({
    try: async () => {
      const limit = 100;
      const offset = 0;
      const result = await this.sql`
        SELECT u.id, u.contact_sfid, n.first_name, n.last_name, ms."name" FROM members as u
        JOIN user_names as n on u.id = n.user_id
        JOIN user_memberships as um on u.id = um.user_id
        JOIN membership_statuses as ms on um.membership_status_id = ms.id
        WHERE u.id = 'ff55c020-04ae-4138-98dd-eb8a3117e65b'
        LIMIT 100
        ORDER BY u.created_at
        LIMIT ${this.sql(limit.toString())}
        OFFSET ${this.sql(offset.toString())}
      `;

      return result.map((r) => ({
        user_id: r.id,
        profile_url: "",
        contact_sfid: r.contact_sfid,
        nickname: r.first_name + r.last_name,
      }));
    },
    catch: (e: unknown) => {
      console.log(e);
      throw e;
    },
  });
}
