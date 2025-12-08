import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import AnimalCard from "../components/card";

const AnimalCardPage = () => {
    const { animalType } = useParams();
    const location = useLocation();
    
    // Если данные переданы через state (из поиска)
    if (location.state?.animalData) {
        return (
            <div>
                <main style={{'minHeight':'70vh'}}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-6">
                                <img 
                                    src={`https://pets.xn--80ahdri7a.site${location.state.animalData.image}`} 
                                    className="animal-detail-img" 
                                    alt={location.state.animalData.kind} 
                                    style={{width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px'}} 
                                />
                            </div>
                            <div className="col-md-6">
                                <h2>{location.state.animalData.kind}</h2>
                                <p>{location.state.animalData.description}</p>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary">Связаться с нашедшим</button>
                                    <Link to="/search" className="btn btn-outline-secondary">Вернуться к поиску</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                {/* Основная карточка животного */}
                <AnimalCard animal={animalType || 'rabbit'} />
                
                {/* Дополнительная информация, если есть */}
                <div className="container">
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="mt-4 pt-3 border-top">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Если это ваше животное или у вас есть дополнительная информация, 
                                    свяжитесь с нами для обновления данных.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Дополнительная секция с контактами */}
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header bg-light">
                                    <h5 className="mb-0">Контактная информация</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6>Телефон горячей линии:</h6>
                                            <p className="fs-5">
                                                <i className="bi bi-telephone-fill text-primary me-2"></i>
                                                +7 (999) 123-45-67
                                            </p>
                                            <small className="text-muted">Работаем круглосуточно</small>
                                        </div>
                                        <div className="col-md-6">
                                            <h6>Электронная почта:</h6>
                                            <p className="fs-5">
                                                <i className="bi bi-envelope-fill text-success me-2"></i>
                                                help@webpets.ru
                                            </p>
                                            <small className="text-muted">Отвечаем в течение 24 часов</small>
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

export default AnimalCardPage;