// import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";

// API call abstractions
const api = () => {
    const { token, refreshToken, _storeRefreshedToken, _logout } = useAuth();
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    // Make sure our access token hasn't expired. If it has, we want to try to refresh it with the 'refresh' token that lasts longer
    const verifyTokenAndRefresh = async () => {
        // Only verify the token if it exists. We still want to allow for unauthenticated requests to certain endpoints, like for user login.
        if (token) {
            const response = await fetch(`${baseUrl}/api/token/verify`, { method: "POST", headers, body: JSON.stringify({ token: token }) });

            if (!response.ok) {
                await getNewToken();
            }
        }
    }

    const getNewToken = async () => {
        console.log("Access token is expired. Retrieving new access token.");
        const response = await fetch(`${baseUrl}/api/token/refresh`, { method: "POST", headers, body: JSON.stringify({ refresh: refreshToken }) });

        // If refresh token expired, log user out and redirect them to login page
        if (!response.ok) {
            console.log("'Refresh' token is invalid or expired. Please sign in again.");
            _logout();
            return;
        }

        const data = await response.json();
        let newToken = data.access
        headers["Authorization"] = "Bearer " + newToken;

        // Have the auth context store this new token since it is the global source of truth for tokens/authentication
        await _storeRefreshedToken(newToken);

        return newToken;
    }

    const _get = async (url) => {
        console.log("Sending GET request");
        await verifyTokenAndRefresh();

        return fetch(baseUrl + url, { method: "GET", headers });
    };

    const _post = async (url, body) => {
        console.log("Sending POST request");
        await verifyTokenAndRefresh();

        return fetch(
            baseUrl + url,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers,
            },
        );
    };

    const _patch = async (url, body) => {
        console.log("Sending PATCH request");
        await verifyTokenAndRefresh();

        return fetch(
            baseUrl + url,
            {
                method: "PATCH",
                body: JSON.stringify(body),
                headers,
            },
        )
    };

    const _delete = async (url) => {
        console.log("Sending DELETE request");
        await verifyTokenAndRefresh();

        return fetch(
            baseUrl + url,
            {
                method: "DELETE",
                headers,
            },
        )
    };

    return { _get, _post, _patch, _delete };
};

export default api;