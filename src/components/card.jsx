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
                    <h2>{animal.kind}</h2>
                    <p className="text-muted">ID: {animal.id}</p>
                    <p>{animal.description || "Описание отсутствует"}</p>
                    <ul className="list-group mb-4">
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Вид:</span>
                            <span>{animal.kind}</span>
                        </li>
                        {animal.age && (
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Возраст:</span>
                                <span>{animal.age}</span>
                            </li>
                        )}
                        {animal.gender && (
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Пол:</span>
                                <span>{animal.gender}</span>
                            </li>
                        )}
                        {animal.location && (
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Место находки:</span>
                                <span>{animal.location}</span>
                            </li>
                        )}
                    </ul>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary">Связаться с нашедшим</button>
                        <Link to="/search" className="btn btn-outline-secondary">Вернуться к поиску</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimalCard;