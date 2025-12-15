// src/pages/search.jsx - Сокращенная версия
import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({ 
        district: "", 
        kind: "", 
        quick: searchParams.get("query") || "" 
    });
    const [animals, setAnimals] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const debounceTimer = useRef(null);
    const perPage = 10;

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/300x200";
        return photo.startsWith("http") ? photo : `https://pets.xn--80ahdri7a.site${photo}`;
    };

    // Основной поиск
    const search = async (url) => {
        setLoading(true);
        try {
            const res = await fetch(url);
            if (res.status === 204) {
                setAnimals([]);
            } else if (res.ok) {
                const data = await res.json();
                setAnimals(data.data?.orders || data.orders || data || []);
            }
        } catch (e) {
            setAnimals([]);
        } finally {
            setLoading(false);
            setPage(1);
        }
    };

    // Быстрый поиск с подсказками
    const quickSearch = (query) => {
        if (!query.trim()) return fetchAll();
        
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            // Подсказки
            if (query.length >= 3) {
                try {
                    const res = await fetch(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setSuggestions((data.data?.orders || []).slice(0, 5));
                } catch (e) {}
            }
            
            setSearchParams({ query });
            search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`);
        }, 1000);
    };

    const fetchAll = () => {
        const queryFromURL = searchParams.get("query");
        if (queryFromURL) {
            search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(queryFromURL)}`);
            setFilters(prev => ({ ...prev, quick: queryFromURL }));
        } else {
            search("https://pets.xn--80ahdri7a.site/api/search/order");
        }
    };

    useEffect(() => {
        fetchAll();
    }, [searchParams]);

    const handleFilterSearch = () => {
        const params = new URLSearchParams();
        if (filters.district) params.append("district", filters.district);
        if (filters.kind) params.append("kind", filters.kind);
        if (filters.quick) params.append("query", filters.quick);
        
        setSearchParams(params);
        search(`https://pets.xn--80ahdri7a.site/api/search/order?${params}`);
    };

    const resetAll = () => {
        setFilters({ district: "", kind: "", quick: "" });
        setSearchParams({});
        setSuggestions([]);
        search("https://pets.xn--80ahdri7a.site/api/search/order");
    };

    const handleQuickChange = (value) => {
        setFilters(prev => ({ ...prev, quick: value }));
        quickSearch(value);
    };

    // Рендер
    const totalPages = Math.ceil(animals.length / perPage);
    const currentAnimals = animals.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Поиск животных</h2>

            {/* Быстрый поиск */}
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <label>Быстрый поиск по описанию</label>
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Введите минимум 3 символа..."
                            value={filters.quick}
                            onChange={e => handleQuickChange(e.target.value)}
                        />
                        {suggestions.length > 0 && filters.quick.length >= 3 && (
                            <div className="dropdown-menu show w-100">
                                {suggestions.map((s, i) => (
                                    <button 
                                        key={i} 
                                        className="dropdown-item small"
                                        type="button"
                                        onClick={() => handleQuickChange(s.description)}
                                    >
                                        {s.description?.substring(0, 80)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Фильтры */}
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        placeholder="Район"
                        value={filters.district} 
                        onChange={e => setFilters(prev => ({ ...prev, district: e.target.value }))} 
                    />
                    <input 
                        type="text" 
                        className="form-control mb-2" 
                        placeholder="Вид животного"
                        value={filters.kind} 
                        onChange={e => setFilters(prev => ({ ...prev, kind: e.target.value }))} 
                    />
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-primary flex-grow-1" 
                            onClick={handleFilterSearch}
                            disabled={loading}
                        >
                            {loading ? "..." : "Поиск"}
                        </button>
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={resetAll}
                        >
                            Сбросить
                        </button>
                    </div>
                </div>
            </div>

            {/* Результаты */}
            {loading ? (
                <div className="text-center"><div className="spinner-border"></div></div>
            ) : animals.length === 0 ? (
                <div className="alert alert-info text-center">
                    {filters.quick || filters.district || filters.kind 
                        ? "Ничего не найдено" 
                        : "Нет доступных животных"}
                </div>
            ) : (
                <>
                    <h5>Найдено: {animals.length}</h5>
                    
                    <div className="row">
                        {currentAnimals.map(a => (
                            <div className="col-lg-4 col-md-6 mb-4" key={a.id}>
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={getImageUrl(a.photos || a.image)} 
                                        className="card-img-top" 
                                        alt={a.kind}
                                        style={{height: '200px', objectFit: 'cover'}} 
                                        onError={(e) => e.target.src = "https://via.placeholder.com/300x200"}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title">{a.kind}</h6>
                                        <p className="card-text small">
                                            {a.description?.substring(0, 100) || "Нет описания"}
                                        </p>
                                        <Link 
                                            to={`/animal/${a.id}`} 
                                            className="btn btn-sm btn-primary w-100 mt-auto"
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
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => p-1)}>←</button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i+1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setPage(i+1)}>{i+1}</button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setPage(p => p+1)}>→</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;