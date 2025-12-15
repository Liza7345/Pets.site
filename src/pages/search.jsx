import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [districtFilter, setDistrictFilter] = useState("");
    const [kindFilter, setKindFilter] = useState("");
    const [quickFilter, setQuickFilter] = useState(searchParams.get("query") || "");
    const [animals, setAnimals] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const debounceTimer = useRef(null);
    const perPage = 10;

    // Используем ref для хранения актуальных значений фильтров
    const filtersRef = useRef({
        district: districtFilter,
        kind: kindFilter,
        quick: quickFilter
    });

    // Обновляем ref при изменении фильтров
    useEffect(() => {
        filtersRef.current = {
            district: districtFilter,
            kind: kindFilter,
            quick: quickFilter
        };
    }, [districtFilter, kindFilter, quickFilter]);

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/300x200";
        if (typeof photo === 'string') {
            return photo.startsWith("http") ? photo : `https://pets.xn--80ahdri7a.site${photo}`;
        }
        // Если photo это массив, берем первый элемент
        if (Array.isArray(photo) && photo.length > 0) {
            const firstPhoto = photo[0];
            return firstPhoto.startsWith("http") ? firstPhoto : `https://pets.xn--80ahdri7a.site${firstPhoto}`;
        }
        return "https://via.placeholder.com/300x200";
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
            console.error("Ошибка поиска:", e);
            setAnimals([]);
        } finally {
            setLoading(false);
            setPage(1);
        }
    };

    // Быстрый поиск с подсказками
    const quickSearch = (query) => {
        if (!query.trim()) {
            fetchAll();
            return;
        }
        
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(async () => {
            // Подсказки
            if (query.length >= 3) {
                try {
                    const res = await fetch(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setSuggestions((data.data?.orders || []).slice(0, 5));
                } catch (e) {
                    console.error("Ошибка подсказок:", e);
                }
            }
            
            setSearchParams({ query });
            search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`);
        }, 500);
    };

    const fetchAll = () => {
        const queryFromURL = searchParams.get("query");
        if (queryFromURL) {
            search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(queryFromURL)}`);
            setQuickFilter(queryFromURL);
        } else {
            search("https://pets.xn--80ahdri7a.site/api/search/order");
        }
    };

    // Загрузка данных при монтировании
    useEffect(() => {
        fetchAll();
    }, []);

    // Обновляем фильтр при изменении параметров URL
    useEffect(() => {
        const queryFromURL = searchParams.get("query");
        if (queryFromURL && queryFromURL !== quickFilter) {
            setQuickFilter(queryFromURL);
        }
    }, [searchParams]);

    const handleFilterSearch = () => {
        // Используем актуальные значения из ref
        const currentFilters = filtersRef.current;
        const params = new URLSearchParams();
        
        if (currentFilters.district) params.append("district", currentFilters.district);
        if (currentFilters.kind) params.append("kind", currentFilters.kind);
        if (currentFilters.quick) params.append("query", currentFilters.quick);
        
        setSearchParams(params);
        
        // Если есть быстрый поиск, используем его эндпоинт
        if (currentFilters.quick) {
            search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(currentFilters.quick)}&district=${currentFilters.district}&kind=${currentFilters.kind}`);
        } else {
            search(`https://pets.xn--80ahdri7a.site/api/search/order?${params}`);
        }
    };

    const resetAll = () => {
        setDistrictFilter("");
        setKindFilter("");
        setQuickFilter("");
        setSearchParams({});
        setSuggestions([]);
        search("https://pets.xn--80ahdri7a.site/api/search/order");
    };

    const handleQuickChange = (value) => {
        setQuickFilter(value);
        quickSearch(value);
    };

    // Обработка выбора подсказки
    const handleSuggestionClick = (description) => {
        setQuickFilter(description);
        setSearchParams({ query: description });
        search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(description)}`);
        setSuggestions([]);
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
                    <label className="form-label">Быстрый поиск по описанию</label>
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Введите минимум 3 символа..."
                            value={quickFilter}
                            onChange={e => handleQuickChange(e.target.value)}
                        />
                        {suggestions.length > 0 && quickFilter.length >= 3 && (
                            <div className="dropdown-menu show w-100 mt-1" style={{display: 'block'}}>
                                {suggestions.map((s, i) => (
                                    <button 
                                        key={i} 
                                        className="dropdown-item small text-truncate"
                                        type="button"
                                        onClick={() => handleSuggestionClick(s.description)}
                                    >
                                        {s.description?.substring(0, 80) || "Без описания"}...
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <small className="form-text text-muted">
                        Поиск по описанию животного (работает после ввода 3+ символов)
                    </small>
                </div>
            </div>

            {/* Фильтры */}
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Фильтры поиска</h5>
                            <input 
                                type="text" 
                                className="form-control mb-3" 
                                placeholder="Район (например: Центральный)"
                                value={districtFilter} 
                                onChange={e => setDistrictFilter(e.target.value)} 
                            />
                            <input 
                                type="text" 
                                className="form-control mb-3" 
                                placeholder="Вид животного (например: Собака, Кошка)"
                                value={kindFilter} 
                                onChange={e => setKindFilter(e.target.value)} 
                            />
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-primary flex-grow-1" 
                                    onClick={handleFilterSearch}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Поиск...
                                        </>
                                    ) : (
                                        "Применить фильтры"
                                    )}
                                </button>
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={resetAll}
                                    disabled={loading}
                                >
                                    Сбросить всё
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Результаты */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-2">Ищем животных...</p>
                </div>
            ) : animals.length === 0 ? (
                <div className="alert alert-info text-center">
                    <i className="bi bi-info-circle me-2"></i>
                    {searchParams.toString() 
                        ? "По вашему запросу ничего не найдено. Попробуйте изменить фильтры." 
                        : "Нет доступных животных для отображения. Зайдите позже."}
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5>Найдено животных: {animals.length}</h5>
                        <div className="text-muted small">
                            Страница {page} из {totalPages}
                        </div>
                    </div>
                    
                    <div className="row">
                        {currentAnimals.map(a => (
                            <div className="col-lg-4 col-md-6 mb-4" key={a.id}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <img 
                                            src={getImageUrl(a.photos || a.photo || a.image)} 
                                            className="card-img-top h-100 w-100"
                                            alt={a.kind}
                                            style={{ objectFit: 'cover' }} 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300x200?text=Нет+фото";
                                            }}
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title">{a.kind || "Неизвестный вид"}</h6>
                                        <p className="card-text small text-muted flex-grow-1">
                                            {a.description?.substring(0, 100) || "Нет описания"}...
                                        </p>
                                        <div className="small mb-3">
                                            {a.district && (
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className="bi bi-geo-alt text-primary me-2"></i>
                                                    <span>{a.district}</span>
                                                </div>
                                            )}
                                            {a.date && (
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-calendar text-success me-2"></i>
                                                    <span>{a.date}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Link 
                                            to={`/animal/${a.id}`} 
                                            className="btn btn-outline-primary w-100 mt-auto"
                                        >
                                            <i className="bi bi-eye me-2"></i>
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
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPage(p => p-1)}
                                        disabled={page === 1}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${page === i+1 ? 'active' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => setPage(i+1)}
                                        >
                                            {i+1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setPage(p => p+1)}
                                        disabled={page === totalPages}
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
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