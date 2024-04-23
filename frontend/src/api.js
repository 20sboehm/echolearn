const api = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    // const baseUrl = "http://52.36.4.210";

    const headers = {
        "Content-Type": "application/json",
    };

    const _get = (url) => {
        return fetch(baseUrl + url, { method: "GET", headers });
    };
    
    const _post = (url, body) => {
        return fetch(
            baseUrl + url,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers,
            },
        );
    };

    const _patch = (url, body) => {
        return fetch(
            baseUrl + url,
            {
                method: "PATCH",
                body: JSON.stringify(body),
                headers,
            },
        )
    };

    const _delete = (url) => {
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

const useApi = () => {
    return api();
}

export { useApi };