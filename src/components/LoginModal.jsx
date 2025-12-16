import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Добавлен Link

const LoginModal = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const auth = (e) => {
        e.preventDefault();
        setError(false);
        setSuccess(false);
        
        const form = document.getElementById('loginModalForm');
        
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify(user);
        
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch("https://pets.xn--80ahdri7a.site/api/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.data && result.data.token) {
                    localStorage.setItem("auth_token", result.data.token);
                    setSuccess(true);
                    
                    // Закрываем модалку через data-bs-dismiss
                    setTimeout(() => {
                        const closeButton = document.querySelector('#loginModal .btn-close[data-bs-dismiss="modal"]');
                        if (closeButton) {
                            closeButton.click();
                        }
                        
                        navigate('/profile');
                        window.location.reload();
                    }, 1500);
                } else {
                    setError(true);
                }
            })
            .catch(error => {
                console.error(error);
                setError(true);
            });
    };

    return (
        <div className="modal fade" id="loginModal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Вход</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show">
                                Неправильный email или пароль
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setError(false)}
                                ></button>
                            </div>
                        )}
                        
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show">
                                Успешный вход! Перенаправляем...
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setSuccess(false)}
                                ></button>
                            </div>
                        )}
                        
                        <form 
                            className="needs-validation" 
                            onSubmit={auth} 
                            noValidate 
                            id="loginModalForm"
                        >
                            <div className="mb-3">
                                <label htmlFor="loginEmail" className="form-label">Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="loginEmail"
                                    required 
                                    onChange={(e) => setUser({...user, email: e.target.value})} 
                                />
                                <div className="invalid-feedback">Введите email</div>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="loginPassword" className="form-label">Пароль</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    id="loginPassword"
                                    required 
                                    onChange={(e) => setUser({...user, password: e.target.value})} 
                                />
                                <div className="invalid-feedback">Введите пароль</div>
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-100">Войти</button>
                            
                            {/* Ссылка на регистрацию */}
                            <div className="text-center mt-3">
                                <small>
                                    Нет аккаунта?{' '}
                                    <Link 
                                        to="/register" 
                                        className="text-decoration-none"
                                    >
                                        Зарегистрироваться
                                    </Link>
                                </small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;