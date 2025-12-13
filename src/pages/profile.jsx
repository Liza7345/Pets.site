import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingPhone, setEditingPhone] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
            navigate("/");
            return;
        }

        try {
            const response = await fetch("https://pets.xn--80ahdri7a.site/api/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("auth_token");
                navigate("/");
                return;
            }

            const data = await response.json();
            
            if (data && typeof data === 'object') {
                if (data.id && data.name) {
                    setUserData(data);
                } else if (data.data?.user?.[0]) {
                    setUserData(data.data.user[0]);
                } else if (data.user?.[0]) {
                    setUserData(data.user[0]);
                } else if (data.data) {
                    setUserData(data.data);
                }
            }
        } catch (err) {
            console.error("Ошибка запроса:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePhone = async () => {
        if (!newPhone.trim()) {
            setEditError("Введите номер телефона");
            return;
        }
        
        setLoadingEdit(true);
        setEditError("");
        setEditSuccess("");
        
        try {
            const token = localStorage.getItem("auth_token");
            
            // ВАЖНО: Попробуем разные варианты URL
            const url = `https://pets.xn--80ahdri7a.site/api/users/phone`;
            console.log("Отправка запроса на:", url);
            
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ phone: newPhone })
            });
            
            console.log("Статус ответа:", response.status);
            console.log("Заголовки ответа:", response.headers);
            
            const responseText = await response.text();
            console.log("Полный ответ:", responseText.substring(0, 200)); // Первые 200 символов
            
            // Проверяем, не HTML ли это
            if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
                setEditError("Сервер вернул HTML вместо JSON. Возможно, неверный URL или ошибка сервера.");
                return;
            }
            
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error("Ошибка парсинга JSON:", e);
                setEditError(`Неверный формат ответа: ${responseText.substring(0, 100)}`);
                return;
            }
            
            if (response.ok) {
                setEditSuccess("Телефон успешно обновлен");
                setUserData(prev => ({ ...prev, phone: newPhone }));
                setEditingPhone(false);
            } else if (response.status === 422) {
                setEditError(data.error?.message || "Ошибка валидации телефона");
            } else if (response.status === 401) {
                setEditError("Неавторизован");
                localStorage.removeItem("auth_token");
                navigate("/");
            } else {
                setEditError(`Ошибка сервера: ${response.status} - ${data.message || 'Неизвестная ошибка'}`);
            }
        } catch (err) {
            console.error("Ошибка соединения:", err);
            setEditError(`Ошибка сети: ${err.message}`);
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail.trim()) {
            setEditError("Введите email");
            return;
        }
        
        // Простая валидация email
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setEditError("Введите корректный email");
            return;
        }
        
        setLoadingEdit(true);
        setEditError("");
        setEditSuccess("");
        
        try {
            const token = localStorage.getItem("auth_token");
            
            // ВАЖНО: Попробуем разные варианты URL
            const url = `https://pets.xn--80ahdri7a.site/api/users/email`;
            console.log("Отправка запроса на:", url);
            
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email: newEmail })
            });
            
            console.log("Статус ответа:", response.status);
            
            const responseText = await response.text();
            console.log("Полный ответ:", responseText.substring(0, 200));
            
            // Проверяем, не HTML ли это
            if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
                setEditError("Сервер вернул HTML вместо JSON. Возможно, неверный URL или ошибка сервера.");
                return;
            }
            
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error("Ошибка парсинга JSON:", e);
                setEditError(`Неверный формат ответа: ${responseText.substring(0, 100)}`);
                return;
            }
            
            if (response.ok) {
                setEditSuccess("Email успешно обновлен");
                setUserData(prev => ({ ...prev, email: newEmail }));
                setEditingEmail(false);
            } else if (response.status === 422) {
                setEditError(data.error?.message || "Ошибка валидации email");
            } else if (response.status === 401) {
                setEditError("Неавторизован");
                localStorage.removeItem("auth_token");
                navigate("/");
            } else {
                setEditError(`Ошибка сервера: ${response.status} - ${data.message || 'Неизвестная ошибка'}`);
            }
        } catch (err) {
            console.error("Ошибка соединения:", err);
            setEditError(`Ошибка сети: ${err.message}`);
        } finally {
            setLoadingEdit(false);
        }
    };

    const calculateDays = (dateStr) => {
        if (!dateStr) return 0;
        const date = new Date(dateStr);
        const today = new Date();
        return Math.floor((today - date) / (1000 * 60 * 60 * 24));
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border"></div></div>;
    if (!userData) return <div className="container py-5"><div className="alert alert-danger">Нет данных</div></div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Личный кабинет</h2>
                <button 
                    className="btn btn-outline-danger" 
                    onClick={() => {
                        localStorage.removeItem("auth_token");
                        navigate("/");
                    }}
                >
                    Выйти
                </button>
            </div>

            {editError && (
                <div className="alert alert-danger alert-dismissible fade show mb-3">
                    {editError}
                    <button type="button" className="btn-close" onClick={() => setEditError("")}></button>
                </div>
            )}
            
            {editSuccess && (
                <div className="alert alert-success alert-dismissible fade show mb-3">
                    {editSuccess}
                    <button type="button" className="btn-close" onClick={() => setEditSuccess("")}></button>
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h4>{userData.name}</h4>
                            
                            <p className="d-flex align-items-center">
                                <strong className="me-2">Телефон:</strong> 
                                {editingPhone ? (
                                    <div className="d-flex align-items-center">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm me-2"
                                            style={{width: '200px'}}
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            placeholder={userData.phone}
                                            disabled={loadingEdit}
                                        />
                                        <button 
                                            className="btn btn-sm btn-success me-1" 
                                            onClick={handleUpdatePhone}
                                            disabled={loadingEdit}
                                        >
                                            {loadingEdit ? "..." : "✓"}
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-secondary" 
                                            onClick={() => setEditingPhone(false)}
                                            disabled={loadingEdit}
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="me-3">{userData.phone}</span>
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                                setEditingPhone(true);
                                                setNewPhone(userData.phone);
                                                setEditingEmail(false);
                                            }}
                                        >
                                            Изменить
                                        </button>
                                    </>
                                )}
                            </p>
                            
                            <p className="d-flex align-items-center">
                                <strong className="me-2">Email:</strong> 
                                {editingEmail ? (
                                    <div className="d-flex align-items-center">
                                        <input 
                                            type="email" 
                                            className="form-control form-control-sm me-2"
                                            style={{width: '250px'}}
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder={userData.email}
                                            disabled={loadingEdit}
                                        />
                                        <button 
                                            className="btn btn-sm btn-success me-1" 
                                            onClick={handleUpdateEmail}
                                            disabled={loadingEdit}
                                        >
                                            {loadingEdit ? "..." : "✓"}
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-secondary" 
                                            onClick={() => setEditingEmail(false)}
                                            disabled={loadingEdit}
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="me-3">{userData.email}</span>
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                                setEditingEmail(true);
                                                setNewEmail(userData.email);
                                                setEditingPhone(false);
                                            }}
                                        >
                                            Изменить
                                        </button>
                                    </>
                                )}
                            </p>
                            
                            <p><strong>Дата регистрации:</strong> {userData.registrationDate}</p>
                            <p><strong>Дней с регистрации:</strong> {calculateDays(userData.registrationDate)}</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                 style={{width: '150px', height: '150px'}}>
                                <span className="text-white h2">
                                    {userData.name.charAt(0)}
                                </span>
                            </div>
                            <button className="btn btn-primary w-100 mb-2" onClick={() => navigate("/add-animal")}>
                                Добавить животное
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;