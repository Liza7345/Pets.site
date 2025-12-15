// src/pages/login.jsx - Минимальная рабочая версия
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const urlencoded = new URLSearchParams();
            urlencoded.append("email", email);
            urlencoded.append("password", password);

            const response = await fetch("https://pets.xn--80ahdri7a.site/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
                body: urlencoded,
            });

            const data = await response.json();
            console.log("Ответ сервера:", data);

            if (response.ok && data.data?.token) {
                localStorage.setItem("auth_token", data.data.token);
                navigate("/profile");
                window.location.reload();
            } else {
                setError(data.error?.message || data.message || "Ошибка входа");
            }
        } catch (err) {
            setError("Ошибка соединения с сервером");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center mb-0">Вход</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Пароль</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Вход..." : "Войти"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;