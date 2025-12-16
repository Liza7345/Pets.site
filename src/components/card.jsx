import React from 'react';
import { Link } from 'react-router-dom';

const AnimalCard = ({ animal, loading }) => {
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

    // Создаем массив фотографий, фильтруя null значения
    const getPhotosArray = () => {
        if (Array.isArray(animal.photos)) {
            return animal.photos.filter(photo => photo !== null && photo !== undefined && photo !== '');
        } else if (animal.photos) {
            return [animal.photos];
        } else if (animal.photo) {
            return [animal.photo];
        }
        return [];
    };

    const photos = getPhotosArray();
    // Проверяем, нужно ли показывать слайдер
    const hasMultiplePhotos = photos.length > 1;
    const hasPhotos = photos.length > 0;
    // Стиль для черных стрелок
    const blackArrowStyle = {
        filter: "invert(1) brightness(0)",
        width: "40px",
        height: "40px",
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6">
                    {hasMultiplePhotos ? (
                        // слайдер для нескольких фотографий
                        <div id="animalCarousel" className="carousel slide" data-bs-ride="carousel">
                            {/* Индикаторы */}
                            <div className="carousel-indicators">
                                {photos.map((_, index) => (
                                    <button 
                                        key={index}
                                        type="button" 
                                        data-bs-target="#animalCarousel" 
                                        data-bs-slide-to={index} 
                                        className={index === 0 ? "active" : ""} 
                                        aria-current={index === 0}
                                        aria-label={`Slide ${index + 1}`}
                                        style={{ backgroundColor: '#6c757d' }}
                                    />
                                ))}
                            </div>

                            {/* Слайды */}
                            <div className="carousel-inner rounded" style={{ maxHeight: '700px', overflow: 'hidden' }}>
                                {photos.map((photo, index) => (
                                    <div 
                                        key={index} 
                                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                                    >
                                        <img 
                                            src={getImageUrl(photo)} 
                                            className="d-block w-100" 
                                            alt={`${animal.kind} - фото ${index + 1}`}
                                            style={{ 
                                                height: '700px', 
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Кнопки навигации с черными стрелками */}
                            <button 
                                className="carousel-control-prev" 
                                type="button" 
                                data-bs-target="#animalCarousel" 
                                data-bs-slide="prev"
                                style={{ width: '5%' }}
                            >
                                <span 
                                    className="carousel-control-prev-icon" 
                                    aria-hidden="true"
                                    style={blackArrowStyle}
                                ></span>
                                <span className="visually-hidden">Предыдущий</span>
                            </button>
                            <button 
                                className="carousel-control-next" 
                                type="button" 
                                data-bs-target="#animalCarousel" 
                                data-bs-slide="next"
                                style={{ width: '5%' }}
                            >
                                <span 
                                    className="carousel-control-next-icon" 
                                    aria-hidden="true"
                                    style={blackArrowStyle}
                                ></span>
                                <span className="visually-hidden">Следующий</span>
                            </button>
                        </div>
                    ) : (
                        // Одиночное изображение, если фото только одно
                        <img 
                            src={getImageUrl(photos[0])} 
                            className="animal-detail-img" 
                            alt={animal.kind} 
                            style={{
                                height: '400px', 
                                objectFit: 'cover', 
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/400x300?text=Нет+изображения";
                            }}
                        />
                    )}
                    
                    {/* Информация о количестве фото */}
                    {hasPhotos && (
                        <div className="text-center mt-2 text-muted small">
                            <i className="bi bi-camera me-1"></i>
                            Фото: {photos.length}
                        </div>
                    )}
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
                            
                            {hasPhotos && (
                                <li className="list-group-item d-flex justify-content-between">
                                    <span className="fw-bold">Количество фото:</span>
                                    <span>{photos.length}</span>
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

export default AnimalCard;