import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

const AnimalCardPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                setLoading(true);
                
                if (id) {
                    const response = await fetch(`https://pets.xn--80ahdri7a.site/api/pets/${id}`);
                    if(!response.ok) {
                        console.log(response.status)
                        return
                    }
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setAnimal(data.data.pet);
                    }
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAnimal();
    }, [id, location.state]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        );
    }

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
                        src={getImageUrl(animal.photos[0])} 
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
                        {animal.mark && <span className="badge bg-secondary fs-6">Метка: {animal.mark}</span>}
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
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="fw-bold">Вид животного:</span>
                                <span>{animal.kind}</span>
                            </li>
                            
                            {animal.district && (
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="fw-bold">Район находки:</span>
                                    <span>{animal.district}</span>
                                </li>
                            )}
                            
                            {animal.date && (
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="fw-bold">Дата находки:</span>
                                    <span>{animal.date}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    
                    <div className="card mb-4">
                        <div className="card-header bg-light">
                            <h5 className="mb-0">Связаться с нашедшим</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="fw-bold">Имя:</span>
                                        <span className="ms-2">{animal.name}</span>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="fw-bold">Телефон:</span>
                                        <span className="ms-2">{animal.phone}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="fw-bold">Email:</span>
                                        <span className="ms-2">{animal.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <Link to="/search" className="btn btn-outline-secondary w-100">
                        <i className="bi bi-arrow-left me-2"></i>
                        Вернуться к поиску
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AnimalCardPage;
