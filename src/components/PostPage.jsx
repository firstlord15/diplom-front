import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MediaUploader from "./MediaUploader";
import "./css/PostPage.css";

const PostPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [socialAccounts, setSocialAccounts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        type: "TEXT",
        tags: "",
        mediaIds: [],
        mediaCaptions: [],
        socialAccountIds: [],
    });

    const [uploadedMedia, setUploadedMedia] = useState([]);
    const [uploadError, setUploadError] = useState(null);

    // Загрузка постов и социальных аккаунтов при монтировании компонента
    useEffect(() => {
        fetchPosts();
        fetchSocialAccounts();
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

    const fetchSocialAccounts = async () => {
        try {
            const response = await axios.get("/social-service/social/active/" + (currentUser?.id || 1));
            setSocialAccounts(response.data || []);
        } catch (err) {
            console.error("Ошибка при загрузке социальных аккаунтов:", err);
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
                // mediaIds и mediaCaptions уже установлены при успешной загрузке
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
                mediaCaptions: [],
                socialAccountIds: [],
            });
            setUploadedMedia([]);
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

    const handleSocialAccountChange = (accountId, checked) => {
        setNewPost((prev) => {
            if (checked) {
                return {
                    ...prev,
                    socialAccountIds: [...prev.socialAccountIds, accountId],
                };
            } else {
                return {
                    ...prev,
                    socialAccountIds: prev.socialAccountIds.filter((id) => id !== accountId),
                };
            }
        });
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

    //media service
    const handleMediaUploadSuccess = (media) => {
        setUploadedMedia(media);
        setUploadError(null);

        // Обновляем состояние newPost, добавляя ID медиа-файлов
        setNewPost((prev) => ({
            ...prev,
            mediaIds: media.map((item) => item.id),
            mediaCaptions: Array(media.length).fill(""),
        }));
    };

    const handleMediaUploadError = (error) => {
        setUploadError(error);
    };

    const handleCaptionChange = (index, caption) => {
        const updatedCaptions = [...newPost.mediaCaptions];
        updatedCaptions[index] = caption;
        setNewPost((prev) => ({
            ...prev,
            mediaCaptions: updatedCaptions,
        }));
    };

    return (
        <div className="Main">
            <div className="container">
                <div className="content br-25">
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

                                {/* Блок для загрузки медиа */}
                                <div className="form-group">
                                    <label>Медиа-файлы</label>
                                    <MediaUploader onUploadSuccess={handleMediaUploadSuccess} onError={handleMediaUploadError} />

                                    {uploadError && <div className="error-message">{uploadError}</div>}

                                    {/* Отображение загруженных медиа и поля для описаний */}
                                    {uploadedMedia.length > 0 && (
                                        <div className="uploaded-media">
                                            <h4>Загруженные медиа</h4>
                                            {uploadedMedia.map((media, index) => (
                                                <div key={index} className="uploaded-media-item">
                                                    <div className="media-preview">{media.type === "IMAGE" ? <img src={media.url} alt={media.filename} /> : <div className="media-icon">{media.filename}</div>}</div>
                                                    <div className="media-caption-input">
                                                        <input type="text" placeholder="Описание медиа" value={newPost.mediaCaptions[index] || ""} onChange={(e) => handleCaptionChange(index, e.target.value)} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {socialAccounts.length > 0 && (
                                    <div className="form-group">
                                        <label>Публиковать в соцсети</label>
                                        <div className="social-accounts-list">
                                            {socialAccounts.map((account) => (
                                                <div key={account.id} className="social-account-item">
                                                    <input type="checkbox" id={`social-${account.id}`} name="socialAccountIds" value={account.id} checked={newPost.socialAccountIds.includes(account.id)} onChange={(e) => handleSocialAccountChange(account.id, e.target.checked)} />
                                                    <label htmlFor={`social-${account.id}`}>{account.platform === "TELEGRAM" ? "Telegram" : account.platform}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary m-0" disabled={loading}>
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
