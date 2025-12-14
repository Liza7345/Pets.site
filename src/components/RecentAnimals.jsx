import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RecentAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://pets.xn--80ahdri7a.site/api/pets")
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                if (data.data?.orders) {
                    const sorted = [...data.data.orders]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 6);
                    setAnimals(sorted);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <section className="py-5">
            <div className="container text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        </section>
    );

    if (animals.length === 0) return null;

    return (
        <section className="py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-5">Недавно найденные животные</h2>
                <div className="row g-4">
                    {animals.map(animal => (
                        <div className="col-lg-4 col-md-6" key={animal.id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div style={{ height: '200px', overflow: 'hidden' }}>
                                    <img 
                                        src={animal.photo?.startsWith('http') ? animal.photo : `https://pets.xn--80ahdri7a.site${animal.photo}`}
                                        className="card-img-top h-100 w-100"
                                        alt={animal.kind}
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=Нет+фото"}
                                    />
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{animal.kind}</h5>
                                    <p className="card-text text-muted small flex-grow-1">
                                        {animal.description?.length > 100 
                                            ? `${animal.description.substring(0, 100)}...`
                                            : animal.description || "Нет описания"}
                                    </p>
                                    <div className="small mb-3">
                                        {animal.district && (
                                            <div className="d-flex align-items-center mb-1">
                                                <i className="bi bi-geo-alt text-primary me-2"></i>
                                                <span>{animal.district}</span>
                                            </div>
                                        )}
                                        {animal.date && (
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-calendar text-success me-2"></i>
                                                <span>{animal.date}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Link 
                                        to={`/animal/${animal.id}`}
                                        state={{ animal }}
                                        className="btn btn-outline-primary mt-auto"
                                    >
                                        Подробнее
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <Link to="/search" className="btn btn-primary">
                        Все найденные животные
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentAnimals;