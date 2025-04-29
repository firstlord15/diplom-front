import axios from "axios";

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

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

    updateProfile: (userId, userData) => {
        return apiClient.put(`/user-service/users/${userId}`, userData);
    },
};

// Post-related API calls
const postService = {
    getPosts: (page = 0, size = 10) => {
        return apiClient.get(`/post?page=${page}&size=${size}`);
    },

    createPost: (postData) => {
        return apiClient.post("/post", postData);
    },

    getPostById: (postId) => {
        return apiClient.get(`/post/${postId}`);
    },

    publishPost: (postId) => {
        return apiClient.post(`/post/${postId}/publish`);
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
        return apiClient.post("/media/files", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    getMediaById: (mediaId) => {
        return apiClient.get(`/media/files/${mediaId}`);
    },
};

// Social-related API calls
const socialService = {
    getActiveAccounts: () => {
        return apiClient.get("/social/active");
    },

    linkAccount: (accountData) => {
        return apiClient.post("/social/link", accountData);
    },
};

export { userService, postService, mediaService, socialService };
