// scr/pages/search.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Search = () => {
    const [filters, setFilters] = useState({ district: "", kind: "" });
    const [animals, setAnimals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const animalsPerPage = 10;

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/300x200?text=Нет+изображения";
        return photo.startsWith("http") ? photo : `https://pets.xn--80ahdri7a.site${photo}`;
    };

    const fetchAnimals = async (searchParams = {}) => {
        setLoading(true);
        setError("");
        try {
            const params = new URLSearchParams(searchParams);
            const url = `https://pets.xn--80ahdri7a.site/api/search/order${params.toString() ? `?${params}` : ""}`;
            
            const response = await fetch(url);
            
            if (response.status === 204) {
                setAnimals([]);
                return;
            }
            
            if (!response.ok) throw new Error(`Ошибка ${response.status}`);
            
            const data = await response.json();
            const orders = data.data?.orders || data.orders || data || [];
            
            const transformed = orders.map(order => ({
                id: order.id,
                kind: order.kind,
                description: order.description,
                image: order.photos || order.image,
                district: order.district,
                date: order.date,
                mark: order.mark
            }));
            
            setAnimals(transformed);
            setCurrentPage(1);
        } catch (err) {
            setError("Ошибка загрузки");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    const handleSearch = () => {
        const params = {};
        if (filters.district.trim()) params.district = filters.district.trim();
        if (filters.kind.trim()) params.kind = filters.kind.trim();
        fetchAnimals(params);
    };

    const handleReset = () => {
        setFilters({ district: "", kind: "" });
        fetchAnimals();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(animals.length / animalsPerPage);
    const startIndex = (currentPage - 1) * animalsPerPage;
    const currentAnimals = animals.slice(startIndex, startIndex + animalsPerPage);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Поиск животных</h2>
            
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <div className="mb-3">
                        <label>Район (строгий поиск)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Например: Центральный"
                            value={filters.district}
                            onChange={e => setFilters({...filters, district: e.target.value})}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label>Вид животного (нестрогий поиск)</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Например: ко" 
                            value={filters.kind}
                            onChange={e => setFilters({...filters, kind: e.target.value})}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary flex-grow-1" onClick={handleSearch} disabled={loading}>
                            {loading ? "Поиск..." : "Поиск"}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={handleReset}>
                            Сбросить
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-warning">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <h5>
                            {filters.district || filters.kind ? "Результаты поиска" : "Все животные"}
                            <span className="badge bg-primary ms-2">{animals.length}</span>
                        </h5>
                        
                        {/* Добавленная строчка */}
                        <p className="text-muted small">
                            Страница {currentPage} из {totalPages}
                        </p>
                    </div>
                    
                    {currentAnimals.length === 0 ? (
                        <div className="alert alert-info">Животные не найдены</div>
                    ) : (
                        <>
                            <div className="row">
                                {currentAnimals.map(animal => (
                                    <div className="col-lg-4 col-md-6 mb-4" key={animal.id}>
                                        <div className="card h-100 shadow-sm">
                                            <div style={{height: '250px', overflow: 'hidden'}}>
                                                <img 
                                                    src={getImageUrl(animal.image)} 
                                                    className="card-img-top h-100 w-100" 
                                                    alt={animal.kind}
                                                    style={{objectFit: 'cover'}}
                                                    onError={e => e.target.src = "https://via.placeholder.com/400x250"}
                                                />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">{animal.kind}</h5>
                                                <p className="card-text small">
                                                    {animal.description?.substring(0, 100)}...
                                                </p>
                                                <div className="small text-muted">
                                                    {animal.district && <div>Район: {animal.district}</div>}
                                                    {animal.date && <div>Дата: {animal.date}</div>}
                                                </div>
                                                <Link 
                                                    to={`/animal/${animal.id}`} 
                                                    className="btn btn-primary w-100 mt-3"
                                                >
                                                    Подробнее
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageClick(currentPage - 1)}>
                                                Назад
                                            </button>
                                        </li>
                                        
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i} className={`page-item ${currentPage === i+1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => handlePageClick(i+1)}>
                                                    {i+1}
                                                </button>
                                            </li>
                                        ))}
                                        
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
                                                Вперед
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;