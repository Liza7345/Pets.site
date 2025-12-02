import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <div className="container py-5">
                    <h2 className="text-center mb-4">Личный кабинет</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <img src="https://via.placeholder.com/150" className="rounded-circle mb-3" alt="Аватар" />
                                    <h5 className="card-title">Иван Иванов</h5>
                                    <p className="card-text">Пользователь с 2023 года</p>
                                    <button className="btn btn-outline-primary btn-sm">Редактировать профиль</button>
                                </div>
                            </div>
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">Меню</h5>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Мои животные
                                            <span className="badge bg-primary rounded-pill">2</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center">
                                            Мои заказы
                                            <span className="badge bg-primary rounded-pill">1</span>
                                        </li>
                                        <li className="list-group-item">Настройки</li>
                                        <li className="list-group-item">Помощь</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Мои животные</h5>
                                    <Link to="/add-animal" className="btn btn-primary btn-sm">Добавить животное</Link>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="card animal-card">
                                                <img src="image/Кролик.jpg" className="card-img-top" alt="Кролик" />
                                                <div className="card-body">
                                                    <h5 className="card-title">Банни</h5>
                                                    <p className="card-text">Кролик, 2 года</p>
                                                    <Link to="/animal/rabbit" className="btn btn-outline-primary btn-sm">Подробнее</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="card animal-card">
                                                <img src="image/Ёжик.jpg" className="card-img-top" alt="Ёжик" />
                                                <div className="card-body">
                                                    <h5 className="card-title">Ёжик</h5>
                                                    <p className="card-text">Ёж, 1 год</p>
                                                    <Link to="/animal/hedgehog" className="btn btn-outline-primary btn-sm">Подробнее</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;