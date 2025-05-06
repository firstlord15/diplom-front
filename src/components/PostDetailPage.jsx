import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./css/PostDetailPage.css";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [socialAccounts, setSocialAccounts] = useState([]);
    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
        type: "TEXT",
        tags: "",
        mediaIds: [],
        mediaCaptions: [],
        socialAccountIds: [],
    });

    useEffect(() => {
        fetchSocialAccounts();
        fetchPost();
    }, [id]);

    const fetchSocialAccounts = async () => {
        try {
            const response = await axios.get("/social-service/social/active/" + currentUser?.id); // 1 - ID текущего пользователя
            setSocialAccounts(response.data || []);
        } catch (err) {
            console.error("Ошибка при загрузке социальных аккаунтов:", err);
        }
    };

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/post-service/post/${id}`, {
                headers: {
                    "X-User-Id": currentUser?.id || 0,
                },
            });

            setPost(response.data);

            // Инициализация формы редактирования данными из поста
            setEditForm({
                title: response.data.title,
                content: response.data.content,
                type: response.data.type,
                tags: response.data.tags ? response.data.tags.join(", ") : "",
                mediaIds: response.data.media ? response.data.media.map((m) => m.mediaId) : [],
                mediaCaptions: response.data.media ? response.data.media.map((m) => m.caption || "") : [],
                socialAccountIds: response.data.socialTasks ? response.data.socialTasks.map((t) => t.socialAccountId) : [],
                scheduledAt: response.data.scheduledAt || "",
            });

            setError(null);
        } catch (err) {
            console.error("Ошибка при загрузке поста:", err);
            setError("Не удалось загрузить пост. Пожалуйста, попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        try {
            setLoading(true);
            console.log("POST ID:" + id);
            await axios.post(
                `/post-service/post/${id}/publish`,
                {},
                {
                    headers: {
                        "X-User-Id": currentUser?.id || 0,
                    },
                }
            );
            // Обновляем информацию о посте после публикации
            fetchPost();
        } catch (err) {
            console.error("Ошибка при публикации поста:", err);
            setError("Не удалось опубликовать пост. Пожалуйста, попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Вы уверены, что хотите удалить этот пост?")) {
            try {
                setLoading(true);
                await axios.delete(`/post-service/post/${id}`, {
                    headers: {
                        "X-User-Id": currentUser?.id || 0,
                    },
                });
                navigate("/posts"); // Перенаправление на страницу постов после удаления
            } catch (err) {
                console.error("Ошибка при удалении поста:", err);
                setError("Не удалось удалить пост. Пожалуйста, попробуйте позже.");
                setLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Преобразование строки тегов через запятую в массив
            const tagsArray = editForm.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            // Формируем полный объект запроса
            const postData = {
                title: editForm.title,
                content: editForm.content,
                type: editForm.type,
                tags: tagsArray,
                mediaIds: editForm.mediaIds,
                mediaCaptions: editForm.mediaCaptions,
                socialAccountIds: editForm.socialAccountIds,
                scheduledAt: editForm.scheduledAt || null,
            };

            await axios.put(`/post-service/post/${id}`, postData, {
                headers: {
                    "X-User-Id": currentUser?.id || 0,
                },
            });

            setEditing(false);
            fetchPost(); // Обновляем данные после успешного обновления
        } catch (err) {
            console.error("Ошибка при обновлении поста:", err);
            setError("Не удалось обновить пост. Пожалуйста, попробуйте позже.");
        } finally {
            setLoading(false);
        }
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

    if (loading && !post) {
        return (
            <div className="Main">
                <div className="container">
                    <div className="content br-25 h-1000">
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Загрузка поста...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Main">
                <div className="container">
                    <div className="content br-25 h-1000">
                        <div className="error-container">
                            <div className="error-message">{error}</div>
                            <button className="btn btn-secondary" onClick={() => navigate("/posts")}>
                                Вернуться к списку постов
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="Main">
                <div className="container">
                    <div className="content br-25 h-1000">
                        <div className="error-container">
                            <div className="warning-message">Пост не найден</div>
                            <button className="btn btn-secondary" onClick={() => navigate("/posts")}>
                                Вернуться к списку постов
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="Main">
            <div className="container">
                <div className="content br-25 h-1000">
                    <div className="post-detail-container">
                        <div className="post-detail-header">
                            <button className="btn btn-back" onClick={() => navigate("/posts")}>
                                ← Назад к постам
                            </button>
                        </div>

                        {editing ? (
                            <div className="post-edit-form">
                                <h2>Редактирование поста</h2>
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group">
                                        <label htmlFor="title">Заголовок</label>
                                        <input type="text" className="form-control" id="title" name="title" value={editForm.title} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Публиковать в соцсети</label>
                                        <div className="social-accounts-list">
                                            {socialAccounts.map((account) => (
                                                <div key={account.id} className="social-account-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`social-${account.id}`}
                                                        name="socialAccountIds"
                                                        value={account.id}
                                                        // Проверяем, есть ли этот аккаунт в списке выбранных
                                                        checked={editForm.socialAccountIds.includes(account.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    socialAccountIds: [...prev.socialAccountIds, account.id],
                                                                }));
                                                            } else {
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    socialAccountIds: prev.socialAccountIds.filter((id) => id !== account.id),
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`social-${account.id}`}>{account.platform === "TELEGRAM" ? "Telegram" : account.platform}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="content">Содержание</label>
                                        <textarea className="form-control" id="content" name="content" value={editForm.content} onChange={handleInputChange} rows="8" required />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="tags">Теги (через запятую)</label>
                                        <input type="text" className="form-control" id="tags" name="tags" value={editForm.tags} onChange={handleInputChange} placeholder="новость, акция, ..." />
                                    </div>

                                    {/* Скрытые поля для хранения данных */}
                                    <input type="hidden" name="type" value={editForm.type} />
                                    <input type="hidden" name="scheduledAt" value={editForm.scheduledAt} />

                                    {/* Если нужно показать выбор социальных сетей */}
                                    <div className="form-group">
                                        <label>Публиковать в соцсети</label>
                                        <div className="social-accounts-list">
                                            {socialAccounts.map((account) => (
                                                <div key={account.id} className="social-account-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`social-${account.id}`}
                                                        name="socialAccountIds"
                                                        value={account.id}
                                                        checked={editForm.socialAccountIds.includes(account.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    socialAccountIds: [...prev.socialAccountIds, account.id],
                                                                }));
                                                            } else {
                                                                setEditForm((prev) => ({
                                                                    ...prev,
                                                                    socialAccountIds: prev.socialAccountIds.filter((id) => id !== account.id),
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`social-${account.id}`}>{account.platform === "TELEGRAM" ? "Telegram" : account.platform}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn-primary m-0" disabled={loading}>
                                            {loading ? "Сохранение..." : "Сохранить изменения"}
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)} disabled={loading}>
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="post-detail-content">
                                <div className="post-detail-main">
                                    <div className="post-detail-title-row">
                                        <h1 className="post-detail-title">{post.title}</h1>
                                        <div className="post-detail-meta">
                                            <span className="post-detail-date">{formatDate(post.createdAt)}</span>
                                            <span className={`post-detail-status status-${post.status.toLowerCase()}`}>{post.status === "PUBLISHED" ? "Опубликован" : post.status === "DRAFT" ? "Черновик" : post.status === "SCHEDULED" ? "Запланирован" : "Ошибка"}</span>
                                        </div>
                                    </div>

                                    <div className="post-detail-actions">
                                        {post.status === "DRAFT" && (
                                            <>
                                                <button className="btn btn-publish" onClick={handlePublish} disabled={loading}>
                                                    Опубликовать
                                                </button>
                                                <button className="btn btn-edit" onClick={() => setEditing(true)} disabled={loading}>
                                                    Редактировать
                                                </button>
                                            </>
                                        )}
                                        {(post.status === "DRAFT" || post.status === "FAILED") && (
                                            <button className="btn btn-delete" onClick={handleDelete} disabled={loading}>
                                                Удалить
                                            </button>
                                        )}
                                    </div>

                                    <div className="post-detail-body">{post.content.split("\n").map((paragraph, index) => (paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />))}</div>

                                    {post.tags && post.tags.length > 0 && (
                                        <div className="post-detail-tags">
                                            <h4>Теги:</h4>
                                            <div className="tags-list">
                                                {post.tags.map((tag) => (
                                                    <span key={tag} className="post-tag">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {post.media && post.media.length > 0 && (
                                    <div className="post-detail-media">
                                        <h3>Медиа:</h3>
                                        <div className="media-grid">
                                            {post.media.map((media) => (
                                                <div className="media-item" key={media.id}>
                                                    {media.type === "IMAGE" && media.mediaDetails && (
                                                        <div className="media-content">
                                                            <img src={media.mediaDetails.url || "https://via.placeholder.com/300x200"} alt={media.caption || "Изображение"} />
                                                        </div>
                                                    )}
                                                    {media.caption && <div className="media-caption">{media.caption}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {post.socialTasks && post.socialTasks.length > 0 && (
                                    <div className="post-detail-social">
                                        <h3>Публикации в соцсетях:</h3>
                                        <div className="social-tasks-list">
                                            {post.socialTasks.map((task) => (
                                                <div className="social-task-item" key={task.id}>
                                                    <div className="social-task-platform">
                                                        <span className="platform-icon">{task.platform === "TELEGRAM" ? <i className="fa fa-telegram"></i> : <i className="fa fa-instagram"></i>}</span>
                                                        <span className="platform-name">{task.platform}</span>
                                                    </div>
                                                    <div className="social-task-status">
                                                        <span className={`status-badge status-${task.status.toLowerCase()}`}>{task.status === "COMPLETED" ? "Опубликовано" : task.status === "PENDING" ? "Ожидает публикации" : task.status === "FAILED" ? "Ошибка публикации" : "В процессе"}</span>
                                                    </div>
                                                    {task.externalPostUrl && (
                                                        <a href={task.externalPostUrl} target="_blank" rel="noreferrer" className="social-task-link">
                                                            Открыть в соцсети
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {post.publishedAt && (
                                    <div className="post-detail-published-info">
                                        <p>Опубликовано: {formatDate(post.publishedAt)}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
