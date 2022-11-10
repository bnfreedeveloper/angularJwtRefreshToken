import { CoreResponse } from "./coreResponse";

export interface LoginResponse extends CoreResponse {
    name: string,
    userName: string,
    token: string,
    refreshToken: string,
    expiration: Date
}