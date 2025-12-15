import React, { useState, useEffect } from "react";

const Slider = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch("https://pets.xn--80ahdri7a.site/api/pets/slider", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.data && data.data.pets) {
                    setPets(data.data.pets);
                } else {
                    throw new Error("Некорректная структура данных");
                }
            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        return `https://pets.xn--80ahdri7a.site${imagePath}`;
    };

    // Добавляем стили для черных стрелок
    const carouselControlStyle = {
        filter: "invert(1) brightness(0)",
        width: "40px",
        height: "40px",
    };

    if (loading) {
        return (
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Наши подопечные</h2>
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Загрузка...</span>
                        </div>
                        <p className="mt-2">Загружаем животных...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Наши подопечные</h2>
                    <div className="alert alert-danger text-center">
                        Ошибка при загрузке данных: {error}
                    </div>
                </div>
            </section>
        );
    }

    if (pets.length === 0) {
        return (
            <section className="py-5">
                <div className="container">
                    <h2 className="text-center mb-5">Наши подопечные</h2>
                    <div className="alert alert-info text-center">
                        Нет данных для отображения
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="text-center mb-5">Наши подопечные</h2>
                <div id="animalsCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {pets.map((pet, index) => (
                            <button 
                                key={pet.id} 
                                type="button" 
                                data-bs-target="#animalsCarousel" 
                                data-bs-slide-to={index} 
                                className={index === 0 ? "active" : ""} 
                                aria-current={index === 0 ? "true" : undefined}
                                aria-label={`Slide ${index + 1}`}
                                style={{ backgroundColor: '#000' }}
                            />
                        ))}
                    </div>
                    <div className="carousel-inner rounded" style={{backgroundColor: '#f8f9fa'}}>
                        {pets.map((pet, index) => (
                            <div 
                                key={pet.id} 
                                className={`carousel-item ${index === 0 ? "active" : ""}`} 
                                data-bs-interval={2500}
                            >
                                <div className="d-flex justify-content-center align-items-center" style={{height: '400px'}}>
                                    <img 
                                        src={getImageUrl(pet.image)} 
                                        className="d-block" 
                                        alt={pet.kind || "Животное"}
                                        style={{ 
                                            maxHeight: '350px',
                                            maxWidth: '80%',
                                            objectFit: 'contain',
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/600x350?text=Изображение+не+найдено";
                                        }}
                                    />
                                </div>
                                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3 mt-3">
                                    <h5>{pet.kind || "Неизвестный вид"}</h5>
                                    <p>{pet.description || "Описание отсутствует"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#animalsCarousel" data-bs-slide="prev">
                        <span 
                            className="carousel-control-prev-icon" 
                            aria-hidden="true"
                            style={carouselControlStyle}
                        />
                        <span className="visually-hidden">Предыдущий</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#animalsCarousel" data-bs-slide="next">
                        <span 
                            className="carousel-control-next-icon" 
                            aria-hidden="true"
                            style={carouselControlStyle}
                        />
                        <span className="visually-hidden">Следующий</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Slider;