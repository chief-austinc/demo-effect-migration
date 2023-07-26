import { Effect, pipe } from "effect";
import { SendbirdApiAdapter } from "./sendbird/adapter";
import { UserServiceDb } from "./user-service/adapter";

(() => {
  const sb = new SendbirdApiAdapter();
  const db = new UserServiceDb();
  const program = pipe(
    db.getUsersFromDb,
    Effect.flatMap(Effect.forEach((u) => sb.upsertUser(u)))
  );

  Effect.runPromise(program)
    .then(() => console.log("program ran"))
    .catch((e) => console.log(e));
})();
