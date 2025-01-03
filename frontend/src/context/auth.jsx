import { useState, createContext } from "react";

// For auth we need global state that is shared accross the entire application, 
// which is why we need the Context API
const AuthContext = createContext();

// Refresh token is a longer lasting token that can be used to get a new access token without the user
// needing to login again
const getToken = () => localStorage.getItem("echolearn_token");
const getRefreshToken = () => localStorage.getItem("echolearn_refresh_token");

const storeTokens = (token, refreshToken) => {
    console.log("Storing tokens");
    localStorage.setItem("echolearn_token", token);
    localStorage.setItem("echolearn_refresh_token", refreshToken);
};

const clearTokens = () => {
    console.log("Clearing tokens from session storage");
    localStorage.removeItem("echolearn_token");
    localStorage.removeItem("echolearn_refresh_token");
};

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getToken);
    const [refreshToken, setRefreshToken] = useState(getRefreshToken);

    const _login = (tokenData) => {
        console.log("Logging in.");
        setToken(tokenData.access);
        setRefreshToken(tokenData.refresh);
        storeTokens(tokenData.access, tokenData.refresh);
    };

    const _logout = () => {
        console.log("Logging out.");
        setToken(null);
        setRefreshToken(null);
        clearTokens();
    };

    const _storeRefreshedToken = async (newToken) => {
        console.log("Storing new access token.");
        setToken(newToken);
        localStorage.setItem("echolearn_token", newToken); // Update the token in storage
        return newToken;
    }

    // Converts token to boolean to check if it is truthy
    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ _login, _logout, _storeRefreshedToken, isLoggedIn, token, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };