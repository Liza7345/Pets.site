// src/pages/search.jsx - полностью исправленный код
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Функция debounce
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const Search = () => {
    const [filters, setFilters] = useState({ 
        district: "", 
        kind: "", 
        quickSearch: "" 
    });
    const [animals, setAnimals] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");
    const animalsPerPage = 10;

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/300x200?text=Нет+изображения";
        return photo.startsWith("http") ? photo : `https://pets.xn--80ahdri7a.site${photo}`;
    };

    // Debounce функция для поиска подсказок
    const fetchSuggestionsDebounced = debounce(async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setSuggestionsLoading(true);
        try {
            const response = await fetch(
                `https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`
            );
            
            if (response.status === 204) {
                setSuggestions([]);
            } else if (response.ok) {
                const data = await response.json();
                const orders = data.data?.orders || [];
                setSuggestions(orders.slice(0, 5));
            }
        } catch (error) {
            console.error("Ошибка загрузки подсказок:", error);
            setSuggestions([]);
        } finally {
            setSuggestionsLoading(false);
        }
    }, 1000);

    // Быстрый поиск по описанию
    const handleQuickSearch = async (query) => {
        if (!query.trim()) {
            // Если запрос пустой, показываем все животные
            fetchAnimals();
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`
            );
            
            if (response.status === 204) {
                setAnimals([]);
            } else if (response.ok) {
                const data = await response.json();
                const orders = data.data?.orders || [];
                setAnimals(orders);
            } else {
                throw new Error(`Ошибка ${response.status}`);
            }
        } catch (error) {
            console.error("Ошибка быстрого поиска:", error);
            setError("Ошибка при быстром поиске");
            setAnimals([]);
        } finally {
            setLoading(false);
            setCurrentPage(1);
        }
    };

    // Оригинальный поиск по фильтрам
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

    // Обработчик изменения быстрого поиска
    const handleQuickSearchChange = (e) => {
        const value = e.target.value;
        setFilters(prev => ({ ...prev, quickSearch: value }));
        setShowSuggestions(true);
        fetchSuggestionsDebounced(value);
    };

    // Выбор подсказки
    const handleSuggestionClick = (suggestion) => {
        const searchText = suggestion.description || suggestion.kind || "";
        setFilters(prev => ({ ...prev, quickSearch: searchText }));
        setShowSuggestions(false);
        handleQuickSearch(searchText);
    };

    // Обработчики оригинального поиска
    const handleSearch = () => {
        const params = {};
        if (filters.district.trim()) params.district = filters.district.trim();
        if (filters.kind.trim()) params.kind = filters.kind.trim();
        fetchAnimals(params);
        setFilters(prev => ({ ...prev, quickSearch: "" })); // Сбрасываем быстрый поиск
    };

    const handleReset = () => {
        setFilters({ district: "", kind: "", quickSearch: "" });
        setSuggestions([]);
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

    // Закрытие подсказок при клике вне
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.quick-search-container')) {
                setShowSuggestions(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Поиск животных</h2>
            
            {/* БЫСТРЫЙ ПОИСК */}
            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <div className="mb-3 quick-search-container">
                        <label>Быстрый поиск по описанию</label>
                        <div className="position-relative">
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Введите минимум 3 символа для подсказок..."
                                value={filters.quickSearch}
                                onChange={handleQuickSearchChange}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (suggestions.length > 0 && filters.quickSearch.length >= 3) {
                                        setShowSuggestions(true);
                                    }
                                }}
                            />
                            
                            {/* Индикатор загрузки подсказок */}
                            {suggestionsLoading && (
                                <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                </div>
                            )}
                            
                            {/* Выпадающие подсказки */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div 
                                    className="dropdown-menu show w-100 mt-1" 
                                    style={{maxHeight: '300px', overflowY: 'auto'}}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            className="dropdown-item text-truncate"
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <small className="text-muted">{suggestion.kind}: </small>
                                            <small>{suggestion.description?.substring(0, 80)}...</small>
                                        </button>
                                    ))}
                                </div>
                            )}
                            
                            {/* Сообщение если нет подсказок */}
                            {showSuggestions && 
                             filters.quickSearch.length >= 3 && 
                             !suggestionsLoading && 
                             suggestions.length === 0 && (
                                <div className="dropdown-menu show w-100 mt-1">
                                    <div className="dropdown-item text-muted">
                                        <small>Подсказки не найдены</small>
                                    </div>
                                </div>
                            )}
                        </div>
                        <small className="form-text text-muted">
                            Поиск по описанию объявления. Подсказки появятся после 3-х символов.
                        </small>
                        
                        <div className="d-flex gap-2 mt-2">
                            <button 
                                className="btn btn-info flex-grow-1" 
                                onClick={() => handleQuickSearch(filters.quickSearch)}
                                disabled={loading || !filters.quickSearch.trim()}
                            >
                                {loading ? "Поиск..." : "Найти по описанию"}
                            </button>
                            {filters.quickSearch && (
                                <button 
                                    className="btn btn-outline-secondary" 
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, quickSearch: "" }));
                                        fetchAnimals();
                                        setSuggestions([]);
                                    }}
                                >
                                    Очистить
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ОРИГИНАЛЬНЫЕ ФИЛЬТРЫ */}
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
                            {loading ? "Поиск..." : "Поиск по фильтрам"}
                        </button>
                        <button className="btn btn-outline-secondary" onClick={handleReset}>
                            Сбросить всё
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-warning">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2">Загружаем данные...</p>
                </div>
            ) : (
                <>
                    <div className="mb-4">
                        <h5>
                            {filters.quickSearch 
                                ? `Результаты поиска по: "${filters.quickSearch}"`
                                : filters.district || filters.kind 
                                    ? "Результаты поиска по фильтрам" 
                                    : "Все животные"
                            }
                            <span className="badge bg-primary ms-2">{animals.length}</span>
                        </h5>
                        
                        {totalPages > 1 && (
                            <p className="text-muted small">
                                Страница {currentPage} из {totalPages}
                            </p>
                        )}
                    </div>
                    
                    {currentAnimals.length === 0 ? (
                        <div className="alert alert-info">
                            {filters.quickSearch || filters.district || filters.kind 
                                ? "По вашему запросу ничего не найдено" 
                                : "Животные не найдены"
                            }
                        </div>
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
                                                {animal.mark && (
                                                    <div className="badge bg-secondary mb-2">
                                                        Метка: {animal.mark}
                                                    </div>
                                                )}
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