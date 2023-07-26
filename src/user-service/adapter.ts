import { Effect } from "effect";
import postgres from "postgres";
import { env } from "../env";

export class UserServiceDatabase {
  sql = postgres(env.USER_SERVICE_DATABASE_URL, {
    ssl: { rejectUnauthorized: false },
  });

  public readonly getUsersFromDb = Effect.tryPromise({
    try: async () => {
      const result = await this.sql`
        SELECT u.id, u.contact_sfid, n.first_name, n.last_name, ms."name" FROM users as u
        JOIN user_names as n on u.id = n.user_id
        JOIN user_memberships as um on u.id = um.user_id
        JOIN membership_statuses as ms on um.membership_status_id = ms.id
        LIMIT 5
      `;

      return result.map((r) => ({
        user_id: r.id,
        nickname: r.first_name + r.last_name,
        profile_url: "",
        contact_sfid: r.contact_sfid,
      }));
    },
    catch: (e: unknown) => {
      console.log(e);
      throw e;
    },
  });
}
