import React from "react";
import { Link } from "react-router-dom";

const Search = () => {
    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <div className="container py-5">
                    <h2 className="text-center mb-4">Поиск животных</h2>
                    <div className="row mb-4">
                        <div className="col-md-8 mx-auto">
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Введите тип животного, район или другие параметры" />
                                <button className="btn btn-primary" type="button">Найти</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card animal-card" style={{transition: 'transform 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img src="image/Кролик.jpg" className="card-img-top" alt="Кролик" />
                                <div className="card-body">
                                    <h5 className="card-title">Банни</h5>
                                    <p className="card-text">Кролик, найден в парке "Сокольники"</p>
                                    <Link to="/animal/rabbit" className="btn btn-primary">Подробнее</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card animal-card" style={{transition: 'transform 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img src="image/Ёжик.jpg" className="card-img-top" alt="Ёжик" />
                                <div className="card-body">
                                    <h5 className="card-title">Ёжик</h5>
                                    <p className="card-text">Ёж, найден в районе Отрадное</p>
                                    <Link to="/animal/hedgehog" className="btn btn-primary">Подробнее</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card animal-card" style={{transition: 'transform 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img src="image/Змея.jpg" className="card-img-top" alt="Змея" />
                                <div className="card-body">
                                    <h5 className="card-title">Зоя</h5>
                                    <p className="card-text">Змея, найдена в Битцевском парке</p>
                                    <Link to="/animal/snake" className="btn btn-primary">Подробнее</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card animal-card" style={{transition: 'transform 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <img src="image/Енот.jpg" className="card-img-top" alt="Енот" />
                                <div className="card-body">
                                    <h5 className="card-title">Рокки</h5>
                                    <p className="card-text">Енот, найден в районе Кунцево</p>
                                    <Link to="/animal/raccoon" className="btn btn-primary">Подробнее</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Search;