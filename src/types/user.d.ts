import { Response } from "../shared/Http";

export type UserInfo = {
  loggedIn: boolean;
};

export type AuthResponse = Response<UserInfo>;
