import React, { useState, useEffect } from "react";
import { socialService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./css/TelegramConnect.css";

const TelegramAccountConnect = () => {
    const { currentUser } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newAccount, setNewAccount] = useState({
        externalId: "",
        platform: "TELEGRAM",
        userId: currentUser?.id,
        active: false,
    });

    useEffect(() => {
        const fetchAccounts = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                console.log("Запрос на получение аккаунтов Telegram...");
                const response = await socialService.getAccounts(currentUser?.id);
                console.log("Ответ API:", response.data);

                // Преобразуем ответ в массив, если получили один объект
                let accountsData = response.data;
                if (!response.data) {
                    console.log("Пустой ответ от сервера - нет подключенных аккаунтов");
                    setAccounts([]);
                    return;
                }

                // Если ответ - пустая строка, считаем, что нет аккаунтов
                if (typeof response.data === "string" && response.data.trim() === "") {
                    console.log("Пустая строка в ответе - нет подключенных аккаунтов");
                    setAccounts([]);
                    return;
                }

                if (!Array.isArray(accountsData) && accountsData && typeof accountsData === "object") {
                    // Если получили один объект, преобразуем его в массив
                    accountsData = [accountsData];
                    console.log("Преобразовано в массив:", accountsData);
                }

                // Устанавливаем аккаунты напрямую, без дополнительной фильтрации
                if (Array.isArray(accountsData)) {
                    console.log("Аккаунты Telegram:", accountsData);
                    setAccounts(accountsData);
                } else {
                    console.error("Неожиданный формат данных:", response.data);
                    // В случае неожиданного формата просто показываем пустой список
                    setAccounts([]);
                }
            } catch (err) {
                console.error("Ошибка при загрузке аккаунтов Telegram:", err);
                // Не устанавливаем ошибку, просто оставляем пустой массив аккаунтов
                setAccounts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount({
            ...newAccount,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка на пустое значение
        if (!newAccount.externalId.trim()) {
            setError("ID канала не может быть пустым");
            return;
        }

        // Проверка на дубликаты
        const isDuplicate = accounts.some((account) => account.externalId === newAccount.externalId);

        if (isDuplicate) {
            setError("Этот канал уже подключен");
            return;
        }

        try {
            setLoading(true);
            // Добавляем ID пользователя, если его нет
            const accountData = {
                ...newAccount,
                userId: currentUser?.id,
            };

            const response = await socialService.linkAccount(accountData);

            // Добавляем новый аккаунт в список
            setAccounts([...accounts, response.data]);

            // Сбрасываем форму
            setNewAccount({
                externalId: "",
                platform: "TELEGRAM",
                userId: currentUser?.id,
                active: true,
            });
            setShowForm(false);
            setError(null);
        } catch (err) {
            console.error("Error linking Telegram account:", err);
            setError("Не удалось подключить канал Telegram. Пожалуйста, проверьте введенные данные.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        if (window.confirm("Вы уверены, что хотите отключить этот канал Telegram?")) {
            try {
                setLoading(true);
                await socialService.unlinkAccount(accountId);

                // Удаляем аккаунт из списка
                setAccounts(accounts.filter((account) => account.id !== accountId));
                setError(null);
            } catch (err) {
                console.error("Error unlinking Telegram account:", err);
                setError("Не удалось отключить канал Telegram");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleAccountStatus = async (account) => {
        try {
            setLoading(true);

            // Используем API для переключения статуса аккаунта
            const response = await socialService.toggleAccountStatus(currentUser?.id, "telegram");

            // Обновляем статус аккаунта в списке
            setAccounts(accounts.map((acc) => (acc.id === account.id ? response.data : acc)));

            setError(null);
        } catch (err) {
            console.error("Error toggling account status:", err);
            setError("Не удалось изменить статус канала Telegram");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="telegram-connect-container">
            <div className="telegram-header">
                <h3>Подключенные каналы Telegram</h3>
                <button className="btn btn-add" onClick={() => setShowForm(!showForm)} disabled={loading}>
                    {showForm ? "Отмена" : "Подключить канал"}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* {showConfirmDialog && (
                <div className="confirm-dialog-overlay">
                    <div className="confirm-dialog">
                        <p>Вы уверены, что хотите отключить этот канал Telegram?</p>
                        <div className="confirm-dialog-buttons">
                            <button className="btn btn-succes mr-1" onClick={handleCancelDelete} disabled={loading}>
                                Отмена
                            </button>
                            <button className="btn btn-delete" onClick={handleConfirmDelete} disabled={loading}>
                                {loading ? "Удаление..." : "Подтвердить"}
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {showForm && (
                <div className="telegram-form">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="externalId">ID канала/группы Telegram</label>
                            <input type="text" className="form-control" id="externalId" name="externalId" value={newAccount.externalId} onChange={handleInputChange} required placeholder="Например: -1001234567890" />
                            <small className="form-text helper-text">ID канала/группы обычно начинается с "-100" и содержит цифры</small>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? "Подключение..." : "Подключить канал"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="telegram-accounts-list">
                {loading && accounts.length === 0 ? (
                    <div className="loading">Загрузка каналов...</div>
                ) : accounts.length === 0 ? (
                    <div className="no-accounts">У вас пока нет подключенных каналов Telegram</div>
                ) : (
                    accounts.map((account, index) => (
                        <div className="account-item" key={`${account.id}_${index}`}>
                            <div className="account-info">
                                <div className="account-platform">
                                    <svg className="platform-icon" viewBox="0 0 24 24" width="24" height="24">
                                        <path
                                            d="M20.302734 2.984375C20.013769 2.996945 19.748583 3.080055 19.515625 3.171875C19.300407 3.256634 18.52754 3.5814726 17.296875 4.0976562C16.06621 4.61384 14.435476 5.2982348 12.697266 6.0292969C9.2208449 7.4914211 5.314238 9.1361259 3.3125 9.9785156C3.243759 10.007156 2.9645852 10.092621 2.65625 10.328125C2.3471996 10.564176 2.0039062 11.076462 2.0039062 11.636719C2.0039062 12.088671 2.2295201 12.548966 2.5019531 12.8125C2.7743861 13.076034 3.0504903 13.199244 3.28125 13.291016L3.28125 13.289062C4.0612776 13.599827 6.3906939 14.531938 6.9453125 14.753906C7.1420423 15.343433 7.9865895 17.867278 8.1875 18.501953L8.1855469 18.501953C8.3275588 18.951162 8.4659791 19.243913 8.6582031 19.488281C8.7543151 19.610465 8.8690398 19.721184 9.0097656 19.808594C9.0637596 19.842134 9.1235454 19.868148 9.1835938 19.892578C9.191962 19.896131 9.2005867 19.897012 9.2089844 19.900391L9.1855469 19.894531C9.2029579 19.901531 9.2185841 19.911859 9.2363281 19.917969C9.2652427 19.927926 9.2852873 19.927599 9.3242188 19.935547C9.4612233 19.977694 9.5979794 20.005859 9.7246094 20.005859C10.26822 20.005859 10.601562 19.710937 10.601562 19.710938L10.623047 19.695312L12.970703 17.708984L15.845703 20.369141C15.898217 20.443289 16.309604 21 17.261719 21C17.829844 21 18.279025 20.718791 18.566406 20.423828C18.853787 20.128866 19.032804 19.82706 19.113281 19.417969L19.115234 19.416016C19.179414 19.085834 21.931641 5.265625 21.931641 5.265625L21.925781 5.2890625C22.011441 4.9067171 22.036735 4.5369631 21.935547 4.1601562C21.834358 3.7833495 21.561271 3.4156252 21.232422 3.2226562C20.903572 3.0296874 20.591699 2.9718046 20.302734 2.984375z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span className="platform-name">Telegram</span>
                                </div>
                                <div className="account-details">
                                    <span className="account-id">ID: {account.externalId}</span>
                                    <span className={`account-status ${account.active ? "active" : "inactive"}`}>{account.active ? "Активен" : "Неактивен"}</span>
                                </div>
                            </div>
                            <div className="account-actions">
                                {/* Кнопка для активации/деактивации аккаунта */}
                                <button className={`btn mr-1 ${account.active ? "btn-details" : "btn-succes"}`} onClick={() => handleToggleAccountStatus(account)} disabled={loading}>
                                    {account.active ? "Деактивировать" : "Активировать"}
                                </button>

                                {/* Кнопка для удаления аккаунта */}
                                <button className="btn btn-delete" onClick={() => handleDeleteAccount(account.id)} disabled={loading}>
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="telegram-help">
                <h4>Как подключить канал/группу Telegram?</h4>
                <ol>
                    <li>
                        Создайте бота в Telegram через <strong>@BotFather</strong>
                    </li>
                    <li>Добавьте бота в ваш канал/группу в качестве администратора</li>
                    <li>
                        Найдите ID канала - это можно сделать одним из следующих способов:
                        <ul>
                            <li>
                                Отправьте сообщение в канал, затем перешлите его боту <strong>@getidsbot</strong>
                            </li>
                            <li>Откройте ваш канал в веб-версии Telegram и найдите числа после "c/" в URL</li>
                        </ul>
                    </li>
                    <li>Введите полученный ID канала в форму выше (добавьте "-100" перед числом, если его нет)</li>
                    <li>Нажмите "Подключить канал"</li>
                </ol>
                <p className="important-note">Важно: бот должен иметь права администратора с возможностью публикации сообщений!</p>
            </div>
        </div>
    );
};

export default TelegramAccountConnect;
