import React from "react";
import { Link } from "react-router-dom";

const LoginModal = () => {
    return (
        <div className="modal fade custom-modal" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title w-100 text-center fw-bold" id="loginModalLabel">Вход в аккаунт</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body px-4 pt-0">
                        {/* Поле логина */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-person"></i>
                                </span>
                                <input type="text" className="form-control border-start-0" placeholder="Логин или email" />
                            </div>
                        </div>
                        
                        {/* Поле пароля */}
                        <div className="mb-3">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input type="password" className="form-control border-start-0" placeholder="Пароль" />
                            </div>
                        </div>
                        
                        {/* Запомнить меня */}
                        <div className="mb-3 d-flex justify-content-between align-items-center remember-me">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">
                                    Запомнить меня
                                </label>
                            </div>
                        </div>
                        
                        {/* Кнопка входа */}
                        <div className="d-grid mb-3">
                            <Link to="/profile" className="btn btn-primary btn-login" data-bs-dismiss="modal">Войти</Link>
                        </div>
                        
                        {/* Регистрация */}
                        <div className="text-center mb-3">
                            <Link to="/register" className="registration-link d-flex align-items-center justify-content-center text-decoration-none" data-bs-dismiss="modal">
                                Регистрация
                                <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                        </div>
                        
                        {/* Забыли логин/пароль */}
                        <div className="text-center">
                            <a href="#" className="forgot-link d-block text-decoration-none mb-1">Забыли логин?</a>
                            <a href="#" className="forgot-link d-block text-decoration-none">Забыли пароль?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;