import axios from "axios";
import { Effect, Option, pipe } from "effect";

import { env } from "../env";
import {
  SendbirdCreateUserRequiredArgs,
  SendbirdUpdateUserRequiredArgs,
} from "./types";
import { RateLimitError, UnknownAxiosError, UserAlreadyExists } from "./errors";

export class SendbirdApiAdapter {
  private readonly apiKey = env.SENDBIRD_API_TOKEN;
  private readonly baseUrl = `https://api-${env.SENDBIRD_APP_ID}.sendbird.com/v3`;
  private readonly endpoints = {
    createUser: {
      method: "post",
      path: "/users",
    },
    updateUser: {
      method: "put",
      path: (userId: string) => "/users/" + userId,
    },
  };

  createSendbirdUser = (data: SendbirdCreateUserRequiredArgs) => {
    return Effect.tryPromise<any, UserAlreadyExists | UnknownAxiosError>({
      try: async () => {
        const { user_id, nickname, profile_url } = data;
        const endpoint = this.endpoints["createUser"];
        const response = await axios<{
          userId: string;
        }>(this.baseUrl + endpoint.path, {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json; charset=utf8",
            "Api-Token": this.apiKey,
          },
          data: { user_id, nickname, profile_url },
        });
        return Effect.succeed(Option.some(response.data));
      },
      catch: (error: any) => {
        console.log("createSendbirdUser.catch()");
        if (error.response?.status) {
          switch (error.response?.status) {
            default:
            case 400:
              console.log(`new UserAlreadyExists()`);
              return new UserAlreadyExists();
            case 429:
              console.log(`new RateLimitError()`);
              return new RateLimitError();
          }
        }
        console.log("new UnknownAxiosError()");
        return new UnknownAxiosError();
      },
    });
  };

  private updateSendbirdUser = (data: SendbirdUpdateUserRequiredArgs) =>
    Effect.tryPromise({
      try: async () => {
        const endpoint = this.endpoints["updateUser"];
        const response = await axios<{
          userId: string;
        }>(this.baseUrl + endpoint.path(data.user_id), {
          method: endpoint.method,
          headers: {
            "Content-Type": "application/json; charset=utf8",
            "Api-Token": this.apiKey,
          },
          params: {
            user_id: data.user_id,
          },
          data: {
            nickname: data.nickname,
            profile_url: data.profile_url,
          },
        });

        switch (response.status) {
          case 200:
            return Effect.succeed(Option.some(response.data));
          default:
            throw new Error(
              `Unknown response.status (${response.status}) in createSendbirdUser`
            );
        }
      },
      catch: (e) => {
        console.log("updateSendbirdUser.catch()");
        return Effect.fail(e);
      },
    });

  upsertUser = (user: SendbirdCreateUserRequiredArgs) => {
    return pipe(
      this.createSendbirdUser(user),
      Effect.catchTags({
        UnknownAxiosError: () =>
          Effect.fail("There was an unrecoverable UnknownAxiosError"),
        UserAlreadyExists: () => {
          return this.updateSendbirdUser(user);
        },
      })
    );
  };
}
