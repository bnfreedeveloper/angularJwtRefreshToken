import { CoreResponse } from "./coreResponse";

export interface LoginResponse extends CoreResponse {
    name: string,
    username: string,
    token: string,
    refreshToken: string,
    expiration: Date
}