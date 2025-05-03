import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./css/PostPage.css";

const PostPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        type: "TEXT",
        tags: "",
        mediaIds: [],
    });

    // Загрузка постов при монтировании компонента
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/post-service/post", {
                headers: {
                    "X-User-Id": currentUser?.id || 0,
                },
            });
            setPosts(response.data.content || []);
            setError(null);
        } catch (err) {
            console.error("Ошибка при загрузке постов:", err);
            setError("Не удалось загрузить посты. Пожалуйста, попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Преобразование строки тегов через запятую в массив
            const tagsArray = newPost.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            const postData = {
                ...newPost,
                tags: tagsArray,
            };

            await axios.post("/post-service/post", postData, {
                headers: {
                    "X-User-Id": currentUser?.id || 0,
                },
            });

            // Сброс формы и обновление списка постов
            setNewPost({
                title: "",
                content: "",
                type: "TEXT",
                tags: "",
                mediaIds: [],
            });
            setShowCreateForm(false);
            fetchPosts();
        } catch (err) {
            console.error("Ошибка при создании поста:", err);
            setError("Не удалось создать пост. Пожалуйста, попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return (
            date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) +
            ", " +
            date
                .toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
                .slice(0, 5)
        );
    };

    const handleDetails = (postId) => {
        navigate(`/posts/${postId}`);
    };

    if (loading && posts.length === 0) {
        return (
            <div className="Main">
                <div className="container">
                    <div className="content br-25 h-1000">
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Загрузка постов...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="Main">
            <div className="post-container">
                <div className="content br-25 h-1000">
                    <h1 className="page-title">Посты</h1>

                    {error && <div className="error-message">{error}</div>}

                    <div className="action-button-container">
                        <button className="btn btn-primary create-post-btn" onClick={() => setShowCreateForm(true)}>
                            Создать новый пост
                        </button>
                    </div>

                    {showCreateForm && (
                        <div className="create-post-form">
                            <h3>Создать новый пост</h3>
                            <form onSubmit={handleCreatePost}>
                                <div className="form-group">
                                    <label htmlFor="title">Заголовок</label>
                                    <input type="text" className="form-control" id="title" name="title" value={newPost.title} onChange={handleInputChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="content">Содержание</label>
                                    <textarea className="form-control" id="content" name="content" value={newPost.content} onChange={handleInputChange} rows="4" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="type">Тип поста</label>
                                    <select className="form-control" id="type" name="type" value={newPost.type} onChange={handleInputChange}>
                                        <option value="TEXT">Текст</option>
                                        <option value="IMAGE">Изображение</option>
                                        <option value="VIDEO">Видео</option>
                                        <option value="MIXED">Смешанный</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tags">Теги (через запятую)</label>
                                    <input type="text" className="form-control" id="tags" name="tags" value={newPost.tags} onChange={handleInputChange} placeholder="новость, акция, ..." />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="m-0 btn btn-primary" disabled={loading}>
                                        {loading ? "Сохранение..." : "Сохранить"}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)} disabled={loading}>
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {posts.length === 0 ? (
                        <div className="no-posts-message">
                            <p>Постов пока нет</p>
                        </div>
                    ) : (
                        <div className="posts-list">
                            {posts.map((post) => (
                                <div className="post-item" key={post.id}>
                                    <div className="post-header">
                                        <h3 className="post-title">{post.title}</h3>
                                        <div className="post-date">{formatDate(post.createdAt)}</div>
                                    </div>

                                    <div className="post-preview">{post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}</div>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className="post-tags">
                                            {post.tags.map((tag) => (
                                                <span key={tag} className="post-tag">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="post-footer">
                                        <span className="post-status">{post.status}</span>
                                        <button className="btn btn-details" onClick={() => handleDetails(post.id)}>
                                            Подробнее
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostPage;
