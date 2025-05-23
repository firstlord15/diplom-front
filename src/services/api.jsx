import axios from "axios";

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // 10 секунд таймаут
});

const telegram = "TELEGRAM";

// Add request interceptor for authentication
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User-related API calls
const userService = {
    login: (credentials) => {
        return apiClient.post("/user-service/auth/sign-in", credentials);
    },

    register: (userData) => {
        return apiClient.post("/user-service/auth/sign-up/user", userData);
    },

    getCurrentUser: () => {
        return apiClient.get("/user-service/users/current");
    },

    updateProfile: (userData) => {
        return apiClient.put(`/user-service/users/profile`, userData);
    },
};

// Post-related API calls
const postService = {
    getUserPostsCount: (userId) => {
        return apiClient.get(`/post-service/post/count/${userId}`);
    },

    getPosts: (page = 0, size = 10) => {
        return apiClient.get(`/post-service/post?page=${page}&size=${size}`);
    },

    createPost: (postData) => {
        return apiClient.post("/post-service/post", postData);
    },

    getPostById: (postId) => {
        return apiClient.get(`/post-service/post/${postId}`);
    },

    publishPost: (postId) => {
        return apiClient.post(`/post-service/post/${postId}/publish`);
    },
};

// Media-related API calls
const mediaService = {
    uploadMedia: (file, metadata) => {
        const formData = new FormData();
        formData.append("file", file);
        if (metadata) {
            formData.append("metadata", JSON.stringify(metadata));
        }
        return apiClient.post("/media-storage-service/media/files", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getMediaById: (mediaId) => {
        return apiClient.get(`/media-storage-service/media/files/${mediaId}`);
    },
};

// Social-related API calls
const socialService = {
    getAccounts: (userId) => {
        if (!userId) {
            console.error("getAccounts: userId не предоставлен");
            return Promise.reject(new Error("userId не предоставлен"));
        }

        return apiClient.get(`/social-service/social/${userId}/${telegram}`);
    },

    // В socialService
    toggleAccountStatus: (userId, platform) => {
        return apiClient.put(`/social-service/social/${userId}/${platform}/toggle`);
    },

    // Обновление метода для привязки аккаунта
    linkAccount: (accountData) => {
        if (!accountData.userId) {
            console.error("linkAccount: userId не предоставлен в данных аккаунта");
            return Promise.reject(new Error("userId не предоставлен"));
        }
        return apiClient.post("/social-service/social/link", accountData);
    },

    unlinkAccount: (userId) => {
        return apiClient.delete(`/social-service/social/${userId}/${telegram}`);
    },
};

export { userService, postService, mediaService, socialService };
