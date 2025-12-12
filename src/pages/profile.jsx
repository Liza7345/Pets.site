import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
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

            if (response.status === 401) {
                localStorage.removeItem("auth_token");
                navigate("/");
                return;
            }

            const data = await response.json();
            console.log("API Response:", data);

            // Проверяем структуру
            if (data && typeof data === 'object') {
                // Если есть поле id, name и т.д. - это наш объект пользователя
                if (data.id && data.name) {
                    console.log("Нашли объект пользователя");
                    setUserData(data);
                } 
                // Если данные внутри data.user[0]
                else if (data.data?.user?.[0]) {
                    console.log("Нашли в data.user[0]");
                    setUserData(data.data.user[0]);
                }
                // Если данные внутри data.user (массив)
                else if (data.user?.[0]) {
                    console.log("Нашли в user[0]");
                    setUserData(data.user[0]);
                }
                // Если сам data - это объект пользователя
                else if (data.data) {
                    console.log("Нашли в data");
                    setUserData(data.data);
                }
                else {
                    console.error("Неизвестная структура:", data);
                }
            }
        } catch (err) {
            console.error("Ошибка запроса:", err);
        } finally {
            setLoading(false);
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

            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h4>{userData.name}</h4>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Телефон:</strong> {userData.phone}</p>
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