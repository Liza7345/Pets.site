import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginModal = () => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    const auth = (e) => {
        e.preventDefault();
        
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
                if ('data' in result) {
                    localStorage.setItem("auth_token", result.data.token);
                    setToken(result.data.token);
                    
                    const modalElement = document.getElementById('loginModal');
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                    
                    navigate('/profile');
                    window.location.reload();
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="modal fade" id="loginModal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Вход</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;