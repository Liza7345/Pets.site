import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserOrders from "../components/UserOrders";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState({ phone: false, email: false });
    const [newValues, setNewValues] = useState({ phone: "", email: "" });
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [messages, setMessages] = useState({ error: "", success: "" });
    const navigate = useNavigate();

    useEffect(() => { fetchUserProfile(); }, []);

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return navigate("/");

        try {
            const response = await fetch("https://pets.xn--80ahdri7a.site/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.status === 401) {
                localStorage.removeItem("auth_token");
                return navigate("/");
            }

            const data = await response.json();
            const user = extractUserData(data);
            if (user) setUserData(user);
        } catch (err) {
            console.error("Ошибка запроса:", err);
        } finally {
            setLoading(false);
        }
    };

    const extractUserData = (data) => {
        if (data?.id && data?.name) return data;
        if (data?.data?.user?.[0]) return data.data.user[0];
        if (data?.user?.[0]) return data.user[0];
        return data?.data || null;
    };

    const handleUpdate = async (field) => {
        const value = newValues[field]?.trim();
        if (!value) {
            setMessages({ error: `Введите ${field === "phone" ? "номер телефона" : "email"}`, success: "" });
            return;
        }

        if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
            setMessages({ error: "Введите корректный email", success: "" });
            return;
        }

        setLoadingEdit(true);
        setMessages({ error: "", success: "" });

        try {
            const token = localStorage.getItem("auth_token");
            const url = `https://pets.xn--80ahdri7a.site/api/users/${field}`;
            
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });

            const responseText = await response.text();
            if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
                setMessages({ error: "Ошибка сервера: неверный формат ответа", success: "" });
                return;
            }

            const data = responseText ? JSON.parse(responseText) : {};

            if (response.ok) {
                setMessages({ error: "", success: `${field === "phone" ? "Телефон" : "Email"} успешно обновлен` });
                setUserData(prev => ({ ...prev, [field]: value }));
                setEditing(prev => ({ ...prev, [field]: false }));
            } else if (response.status === 401) {
                localStorage.removeItem("auth_token");
                navigate("/");
            } else {
                setMessages({ 
                    error: data.error?.message || `Ошибка: ${response.status}`, 
                    success: "" 
                });
            }
        } catch (err) {
            setMessages({ error: `Ошибка сети: ${err.message}`, success: "" });
        } finally {
            setLoadingEdit(false);
        }
    };

    const calculateDays = (dateStr) => {
        if (!dateStr) return 0;
        return Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    };

    const startEditing = (field) => {
        setEditing({ phone: field === "phone", email: field === "email" });
        setNewValues({ ...newValues, [field]: userData[field] });
    };

    const cancelEditing = () => {
        setEditing({ phone: false, email: false });
    };

    if (loading) return <div className="container py-5 text-center"><div className="spinner-border"></div></div>;
    if (!userData) return <div className="container py-5"><div className="alert alert-danger">Нет данных</div></div>;

    const renderEditableField = (field, label) => (
        <p className="d-flex align-items-center">
            <strong className="me-2">{label}:</strong> 
            {editing[field] ? (
                <div className="d-flex align-items-center">
                    <input 
                        type={field === "email" ? "email" : "text"}
                        className="form-control form-control-sm me-2"
                        style={{width: field === "phone" ? "200px" : "250px"}}
                        value={newValues[field]}
                        onChange={(e) => setNewValues(prev => ({ ...prev, [field]: e.target.value }))}
                        placeholder={userData[field]}
                        disabled={loadingEdit}
                    />
                    <button 
                        className="btn btn-sm btn-success me-1" 
                        onClick={() => handleUpdate(field)}
                        disabled={loadingEdit}
                    >
                        {loadingEdit ? "..." : "✓"}
                    </button>
                    <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={cancelEditing}
                        disabled={loadingEdit}
                    >
                        ✗
                    </button>
                </div>
            ) : (
                <>
                    <span className="me-3">{userData[field]}</span>
                    <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => startEditing(field)}
                    >
                        Изменить
                    </button>
                </>
            )}
        </p>
    );

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

            {messages.error && (
                <div className="alert alert-danger alert-dismissible fade show mb-3">
                    {messages.error}
                    <button type="button" className="btn-close" onClick={() => setMessages(prev => ({ ...prev, error: "" }))}></button>
                </div>
            )}
            
            {messages.success && (
                <div className="alert alert-success alert-dismissible fade show mb-3">
                    {messages.success}
                    <button type="button" className="btn-close" onClick={() => setMessages(prev => ({ ...prev, success: "" }))}></button>
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h4>{userData.name}</h4>
                            {renderEditableField("phone", "Телефон")}
                            {renderEditableField("email", "Email")}
                            <p><strong>Дата регистрации:</strong> {userData.registrationDate}</p>
                            <p><strong>Дней с регистрации:</strong> {calculateDays(userData.registrationDate)}</p>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                 style={{width: '150px', height: '150px'}}>
                                <span className="text-white h2">{userData.name.charAt(0)}</span>
                            </div>
                            <button className="btn btn-primary w-100 mb-2" onClick={() => navigate("/add-animal")}>
                                Добавить животное
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <UserOrders />
        </div>
    );
};

export default Profile;