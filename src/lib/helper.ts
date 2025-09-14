// src/util/helper.ts
const Signout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("profileImageUrl");
};

export { Signout };
