import { AuthDto } from "@/common/dto/auth/auth.dto";
import api from "@/common/util/api";
import { UserDto } from "../dto/users/user.dto";

export class Session {
    authenticate = async () => {
        if (!sessionStorage.getItem("token")) {
            const refreshData: string = await api.post("/auth/refresh", null, {
                headers: { Accept: "text/plain" },
            });
            sessionStorage.setItem("token", refreshData);
        }
        return await api.get<UserDto>("/auth/user");
    };

    login = async (credentials: AuthDto, remember?: boolean) => {
        const loginData: string = await api.post("/auth/login", credentials, {
            params: { "remember-me": remember ? "on" : undefined },
            headers: { Accept: "text/plain" },
        });
        sessionStorage.setItem("token", loginData);
    };

    logout = async () => {
        await api.post("/auth/logout", null);
        sessionStorage.removeItem("token");
    };
}

const session = new Session();

export default session;
