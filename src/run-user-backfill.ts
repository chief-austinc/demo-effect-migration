require("dotenv").config();

import { Effect, pipe } from "effect";
import { SendbirdApiAdapter } from "./sendbird/adapter";
import { UserServiceDatabase } from "./user-service/adapter";

(() => {
  const sb = new SendbirdApiAdapter();
  const db = new UserServiceDatabase();
  const program = pipe(
    db.getUsersFromDb,
    Effect.flatMap(Effect.forEach((u) => sb.upsertUser(u)))
  );

  Effect.runPromise(program)
    .then(() => console.log("program ran"))
    .catch((e) => console.log(e));
})();
