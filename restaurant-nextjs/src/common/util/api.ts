import { BadRequestError } from "@/common/error/bad-request.error";
import { ConflictError } from "@/common/error/conflict.error";
import { ForbiddenError } from "@/common/error/forbidden.error";
import { InternalServerError } from "@/common/error/internal-server.error";
import { NotFoundError } from "@/common/error/not-found.error";
import { UnauthorizedError } from "@/common/error/unauthorized.error";
import { UnprocessableEntityError } from "@/common/error/unprocessable-entity.error";
import config, { ConfigKey } from "@/common/util/config";
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    HttpStatusCode,
} from "axios";

export interface ApiRequestOptions {
    params?: any;
    headers?: { Accept: string };
}

export class Api {
    private api: AxiosInstance = axios.create({
        baseURL: config.get(ConfigKey.ApiUrl),
        withCredentials: true,
        headers: {
            Accept: "application/json",
        },
    });

    private handleResponse = async <T, D = any>(
        action: () => Promise<AxiosResponse<T, D>>
    ) => {
        try {
            const response = await action();
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                switch (error.response.status) {
                    case HttpStatusCode.BadRequest:
                        throw new BadRequestError(error.response.data);
                    case HttpStatusCode.UnprocessableEntity:
                        throw new UnprocessableEntityError(error.response.data);
                    case HttpStatusCode.Unauthorized:
                        sessionStorage.removeItem("token");
                        throw new UnauthorizedError(error.response.data);
                    case HttpStatusCode.Forbidden:
                        throw new ForbiddenError(error.response.data);
                    case HttpStatusCode.NotFound:
                        throw new NotFoundError(error.response.data);
                    case HttpStatusCode.Conflict:
                        throw new ConflictError(error.response.data);
                    case HttpStatusCode.InternalServerError:
                        throw new InternalServerError(error.response.data);
                    default:
                        throw new Error(error.response.data);
                }
            }
            throw error;
        }
    };

    public get = async <T>(
        url: string,
        options?: {
            params?: any;
            headers?: { Accept: string };
        }
    ): Promise<T> => {
        const requestConfig: AxiosRequestConfig = {
            params: options?.params,
            headers: {
                Authorization: sessionStorage.getItem("token")
                    ? `Bearer ${sessionStorage.getItem("token")}`
                    : undefined,
                ...options?.headers,
            },
        };
        return await this.handleResponse(() =>
            this.api.get(url, requestConfig)
        );
    };

    public post = async <T, D = any>(
        url: string,
        data: D,
        options?: ApiRequestOptions
    ): Promise<T> => {
        const requestConfig: AxiosRequestConfig = {
            params: options?.params,
            headers: {
                Authorization: sessionStorage.getItem("token")
                    ? `Bearer ${sessionStorage.getItem("token")}`
                    : undefined,
                ...options?.headers,
            },
        };
        return await this.handleResponse(() =>
            this.api.post(url, data, requestConfig)
        );
    };

    public put = async <T, D = any>(
        url: string,
        data: D,
        options?: ApiRequestOptions
    ): Promise<T> => {
        const requestConfig: AxiosRequestConfig = {
            params: options?.params,
            headers: {
                Authorization: sessionStorage.getItem("token")
                    ? `Bearer ${sessionStorage.getItem("token")}`
                    : undefined,
                ...options?.headers,
            },
        };
        return await this.handleResponse(() =>
            this.api.put(url, data, requestConfig)
        );
    };

    public patch = async <T, D = any>(
        url: string,
        data: D,
        options?: ApiRequestOptions
    ): Promise<T> => {
        const requestConfig: AxiosRequestConfig = {
            params: options?.params,
            headers: {
                Authorization: sessionStorage.getItem("token")
                    ? `Bearer ${sessionStorage.getItem("token")}`
                    : undefined,
                ...options?.headers,
            },
        };
        return await this.handleResponse(() =>
            this.api.patch(url, data, requestConfig)
        );
    };
    public delete = async <T>(
        url: string,
        options?: ApiRequestOptions
    ): Promise<T> => {
        const requestConfig: AxiosRequestConfig = {
            params: options?.params,
            headers: {
                Authorization: sessionStorage.getItem("token")
                    ? `Bearer ${sessionStorage.getItem("token")}`
                    : undefined,
                ...options?.headers,
            },
        };
        return await this.handleResponse(() =>
            this.api.delete(url, requestConfig)
        );
    };

    public upload = async <T>(
        url: string,
        formData: FormData,
        options?: ApiRequestOptions
    ): Promise<T> => {
        const requestConfig: AxiosRequestConfig = {
            params: options?.params,
            headers: {
                Authorization: sessionStorage.getItem("token")
                    ? `Bearer ${sessionStorage.getItem("token")}`
                    : undefined,
                Accept: "text/plain",
                "Content-Type": "multipart/form-data",
                ...options?.headers,
            },
        };
        return await this.handleResponse(() =>
            this.api.post(url, formData, requestConfig)
        );
    };
}

const api = new Api();

export default api;
