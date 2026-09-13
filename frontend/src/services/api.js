import axios from "axios";

const api = axios.create({
    baseURL:
        process.env.REACT_APP_API_URL ||
        "http://localhost:8081",

    headers: {
        "Content-Type": "application/json"
    }
});


/* =========================================================
   REQUEST INTERCEPTOR
   Automatically attach JWT to every API request
========================================================= */

api.interceptors.request.use(
    (config) => {

        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            try {

                const user =
                    JSON.parse(storedUser);

                if (user?.token) {

                    config.headers.Authorization =
                        `Bearer ${user.token}`;
                }

            } catch (error) {

                console.error(
                    "Invalid user data in localStorage:",
                    error
                );

                localStorage.removeItem("user");
            }
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/* =========================================================
   RESPONSE INTERCEPTOR
   Handle unauthorized requests
========================================================= */

api.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("user");

            window.location.href =
                "/login";
        }

        return Promise.reject(error);
    }
);


export default api;