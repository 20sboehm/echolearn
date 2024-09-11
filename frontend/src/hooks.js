// Export all custom hooks from this file

import api from "./utils/api"
import { AuthContext, AuthProvider } from "./context/auth"
import { useContext } from "react";

const useApi = () => {
    const { token, refreshToken, _logout } = useAuth();
    return api(token, refreshToken, _logout);
}

const useApiWithoutToken = () => {
    return api();
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export {
    useApi,
    useApiWithoutToken,
    useAuth
};