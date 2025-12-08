// src/components/card.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const AnimalCard = () => {
    const location = useLocation();
    const { animal } = location.state || {};

    // Если нет данных из state, используем данные по умолчанию
    if (!animal) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    Информация о животном не найдена
                </div>
                <Link to="/search" className="btn btn-outline-secondary">Вернуться к поиску</Link>
            </div>
        );
    }

    // Функция для получения полного URL изображения
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/400x300?text=Нет+изображения";
        if (imagePath.startsWith("http")) return imagePath;
        return `https://pets.xn--80ahdri7a.site${imagePath}`;
    };

    // Функция для форматирования даты (если нужно)
    const formatDate = (dateString) => {
        if (!dateString) return "Не указана";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Функция для получения пола животного из описания (если есть)
    const getGenderFromDescription = (description) => {
        if (!description) return null;
        const desc = description.toLowerCase();
        if (desc.includes('самец') || desc.includes('мальчик') || desc.includes('кот') || desc.includes('пёс')) {
            return "Самец";
        }
        if (desc.includes('самка') || desc.includes('девочка') || desc.includes('кошка') || desc.includes('сука')) {
            return "Самка";
        }
        return null;
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6">
                    <img 
                        src={getImageUrl(animal.image)} 
                        className="animal-detail-img" 
                        alt={animal.kind} 
                        style={{
                            width: '100%', 
                            maxHeight: '400px', 
                            objectFit: 'cover', 
                            borderRadius: '10px'
                        }} 
                    />
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2 className="mb-0">{animal.kind}</h2>
                        {animal.mark && (
                            <span className="badge bg-secondary fs-6">
                                Метка: {animal.mark}
                            </span>
                        )}
                    </div>
                    
                    {animal.description && (
                        <div className="alert alert-light border mb-4">
                            <h5 className="alert-heading">Описание:</h5>
                            <p className="mb-0">{animal.description}</p>
                        </div>
                    )}
                    
                    <div className="card mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Информация о животном</h5>
                        </div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Вид животного:</span>
                                <span>{animal.kind}</span>
                            </li>
                            
                            {animal.district && (
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                        <span className="fw-bold">Район находки:</span>
                                    </div>
                                    <span className="text-end">{animal.district}</span>
                                </li>
                            )}
                            
                            {animal.date && (
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-calendar-event-fill text-success me-2"></i>
                                        <span className="fw-bold">Дата находки:</span>
                                    </div>
                                    <span>{formatDate(animal.date)}</span>
                                </li>
                            )}
                            
                            {animal.age && (
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-clock-fill text-warning me-2"></i>
                                        <span className="fw-bold">Возраст:</span>
                                    </div>
                                    <span>{animal.age}</span>
                                </li>
                            )}
                            
                            {animal.gender ? (
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-gender-ambiguous text-info me-2"></i>
                                        <span className="fw-bold">Пол:</span>
                                    </div>
                                    <span>{animal.gender}</span>
                                </li>
                            ) : (
                                getGenderFromDescription(animal.description) && (
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <i className="bi bi-gender-ambiguous text-info me-2"></i>
                                            <span className="fw-bold">Пол (определено):</span>
                                        </div>
                                        <span>{getGenderFromDescription(animal.description)}</span>
                                    </li>
                                )
                            )}
                            
                            {animal.location && (
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-pin-map-fill text-secondary me-2"></i>
                                        <span className="fw-bold">Точное место:</span>
                                    </div>
                                    <span className="text-end">{animal.location}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary btn-lg">
                            <i className="bi bi-telephone me-2"></i>
                            Связаться с нашедшим
                        </button>
                        
                        <Link to="/search" className="btn btn-outline-secondary">
                            <i className="bi bi-arrow-left me-2"></i>
                            Вернуться к поиску
                        </Link>
                        
                    </div>
                </div>
            </div>
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
    );
}

export default AnimalCard;