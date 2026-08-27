import api from "./api";

const login = async (userData) => {
    const response = await api.post("/api/auth/login", userData);

    if (response.data) {
        localStorage.setItem(
            "user",
            JSON.stringify(response.data)
        );
    }

    return response.data;
};

const register = async (userData) => {
    const response = await api.post(
        "/api/user/register",
        userData
    );

    return response.data;
};

const logout = () => {
    localStorage.removeItem("user");
};

const authService = {
    login,
    register,
    logout
};

export default authService;