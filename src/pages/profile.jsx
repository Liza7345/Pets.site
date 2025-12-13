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
    const [userId, setUserId] = useState(null); // Добавили отдельное состояние для ID
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
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("Profile response status:", response.status);
            
            if (response.status === 401) {
                localStorage.removeItem("auth_token");
                navigate("/");
                return;
            }

            const data = await response.json();
            console.log("Profile API Response:", data);
            
            // Проверяем структуру
            let user = null;
            if (data && typeof data === 'object') {
                if (data.id && data.name) {
                    user = data;
                } else if (data.data?.user?.[0]) {
                    user = data.data.user[0];
                } else if (data.user?.[0]) {
                    user = data.user[0];
                } else if (data.data) {
                    user = data.data;
                }
            }
            
            if (user) {
                setUserData(user);
                // Извлекаем ID из объекта пользователя
                setUserId(user.id || user.user_id || user.userId);
            }
        } catch (err) {
            console.error("Ошибка запроса:", err);
            setEditError("Ошибка соединения с сервером");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePhone = async () => {
        if (!newPhone.trim() || !userId) {
            setEditError("ID пользователя не найден или телефон пустой");
            return;
        }
        
        setLoadingEdit(true);
        setEditError("");
        setEditSuccess("");
        
        try {
            const token = localStorage.getItem("auth_token");
            console.log("Updating phone for user ID:", userId);
            console.log("Token exists:", !!token);
            
            const response = await fetch(`https://pets.xn--80ahdri7a.site/api/users/${userId}/phone`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ phone: newPhone })
            });
            
            console.log("Phone update response status:", response.status);
            
            const responseText = await response.text();
            console.log("Phone update response text:", responseText);
            
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
            
            if (response.status === 200) {
                setEditSuccess("Телефон успешно обновлен");
                setUserData(prev => ({ ...prev, phone: newPhone }));
                setEditingPhone(false);
            } else if (response.status === 422) {
                setEditError(data.error?.message || "Ошибка валидации телефона");
            } else if (response.status === 401) {
                setEditError("Неавторизован. Пожалуйста, войдите снова.");
                localStorage.removeItem("auth_token");
                navigate("/");
            } else {
                setEditError(`Ошибка сервера: ${response.status}`);
            }
        } catch (err) {
            console.error("Ошибка соединения:", err);
            setEditError("Ошибка соединения с сервером. Проверьте интернет-соединение.");
        } finally {
            setLoadingEdit(false);
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail.trim() || !userId) {
            setEditError("ID пользователя не найден или email пустой");
            return;
        }
        
        setLoadingEdit(true);
        setEditError("");
        setEditSuccess("");
        
        try {
            const token = localStorage.getItem("auth_token");
            console.log("Updating email for user ID:", userId);
            
            const response = await fetch(`https://pets.xn--80ahdri7a.site/api/users/${userId}/email`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email: newEmail })
            });
            
            console.log("Email update response status:", response.status);
            
            const responseText = await response.text();
            console.log("Email update response text:", responseText);
            
            let data = {};
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error("Error parsing JSON:", e);
            }
            
            if (response.status === 200) {
                setEditSuccess("Email успешно обновлен");
                setUserData(prev => ({ ...prev, email: newEmail }));
                setEditingEmail(false);
            } else if (response.status === 422) {
                setEditError(data.error?.message || "Ошибка валидации email");
            } else if (response.status === 401) {
                setEditError("Неавторизован. Пожалуйста, войдите снова.");
                localStorage.removeItem("auth_token");
                navigate("/");
            } else {
                setEditError(`Ошибка сервера: ${response.status}`);
            }
        } catch (err) {
            console.error("Ошибка соединения:", err);
            setEditError("Ошибка соединения с сервером. Проверьте интернет-соединение.");
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

            {/* Отладочная информация */}
            <div className="alert alert-info mb-3">
                <small>User ID: {userId || "Не найден"}</small>
            </div>

            {/* Сообщения об ошибках/успехе */}
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
                            
                            {/* Редактирование телефона */}
                            <p className="d-flex align-items-center">
                                <strong className="me-2">Телефон:</strong> 
                                {editingPhone ? (
                                    <div className="d-flex align-items-center flex-wrap">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm me-2 mb-1"
                                            style={{minWidth: '200px'}}
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            placeholder={userData.phone}
                                            disabled={loadingEdit}
                                        />
                                        <div>
                                            <button 
                                                className="btn btn-sm btn-success me-1 mb-1" 
                                                onClick={handleUpdatePhone}
                                                disabled={loadingEdit}
                                            >
                                                {loadingEdit ? "Сохранение..." : "Сохранить"}
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-secondary mb-1" 
                                                onClick={() => setEditingPhone(false)}
                                                disabled={loadingEdit}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="me-3">{userData.phone}</span>
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                                setEditingPhone(true);
                                                setNewPhone(userData.phone || "");
                                                setEditingEmail(false);
                                            }}
                                        >
                                            Изменить
                                        </button>
                                    </>
                                )}
                            </p>
                            
                            {/* Редактирование email */}
                            <p className="d-flex align-items-center">
                                <strong className="me-2">Email:</strong> 
                                {editingEmail ? (
                                    <div className="d-flex align-items-center flex-wrap">
                                        <input 
                                            type="email" 
                                            className="form-control form-control-sm me-2 mb-1"
                                            style={{minWidth: '250px'}}
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder={userData.email}
                                            disabled={loadingEdit}
                                        />
                                        <div>
                                            <button 
                                                className="btn btn-sm btn-success me-1 mb-1" 
                                                onClick={handleUpdateEmail}
                                                disabled={loadingEdit}
                                            >
                                                {loadingEdit ? "Сохранение..." : "Сохранить"}
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-secondary mb-1" 
                                                onClick={() => setEditingEmail(false)}
                                                disabled={loadingEdit}
                                            >
                                                Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="me-3">{userData.email}</span>
                                        <button 
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => {
                                                setEditingEmail(true);
                                                setNewEmail(userData.email || "");
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
                            <p><strong>Найденные животные:</strong> {userData.ordersCount || 0}</p>
                            <p><strong>Питомцы:</strong> {userData.petsCount || 0}</p>
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