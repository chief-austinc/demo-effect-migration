import { Effect } from "effect";

export class UserServiceDb {
  public readonly getUsersFromDb = Effect.tryPromise({
    try: async () => {
      const mockTempResult = [
        {
          user_id: "15523",
          nickname: "name_string",
          profile_url: "url_string",
        },
        {
          user_id: "92ce5075-3503-4b10-9886-8420c36616b1",
          nickname: "austin-test-user-5",
          profile_url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Matthew_McConaughey_2019_%2848648344772%29.jpg/1200px-Matthew_McConaughey_2019_%2848648344772%29.jpg",
        },
      ];
      return mockTempResult;
    },
    catch: (e: unknown) => {
      console.log(e);
      throw e;
    },
  });
}
