// Export all custom hooks from this file

import api from "./utils/api"
import { AuthContext, AuthProvider } from "./context/auth"
import { useContext, useState, useEffect } from "react";

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

const useTheme = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return { theme, toggleTheme };
};


export {
    useApi,
    useApiWithoutToken,
    useAuth,
    useTheme
};