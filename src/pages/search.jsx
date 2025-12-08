import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allAnimals, setAllAnimals] = useState([]);
    const [displayedAnimals, setDisplayedAnimals] = useState([]); 
    const [setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [ setShowSuggestions] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 6; 
  
    const debounceTimer = useRef(null);

    const getImageUrl = (photoPath) => {
        if (!photoPath) return "https://via.placeholder.com/300x200?text=Нет+изображения";
        if (photoPath.startsWith("http")) return photoPath;
        return `https://pets.xn--80ahdri7a.site${photoPath}`;
    };

    const transformOrderToAnimal = (order) => {
        return {
            id: order.id,
            kind: order.kind,
            description: order.description,
            image: order.photos || order.image,
            mark: order.mark,
            district: order.district,
            date: order.date
        };
    };

    const fetchAnimals = useCallback(async (searchQuery = "", isSuggestion = false, reset = false) => {
        try {
            if (!isSuggestion && !reset) {
                setLoading(true);
            }
            if (reset) {
                setPage(1);
            }
            
            setError(null);
            
            let url = "https://pets.xn--80ahdri7a.site/api/search";
            
            if (searchQuery && searchQuery.trim().length >= 3) {
                url += `?q=${encodeURIComponent(searchQuery.trim())}`;
            }
            
            console.log("Запрос к:", url);
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                mode: 'cors',
                credentials: 'omit',
            });

            console.log("Статус ответа:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Данные получены:", data);
            
            let ordersData = [];
            if (data.data && data.data.orders && Array.isArray(data.data.orders)) {
                ordersData = data.data.orders;
            } else if (Array.isArray(data)) {
                ordersData = data;
            } else if (data.orders && Array.isArray(data.orders)) {
                ordersData = data.orders;
            } else {
                console.warn("Неизвестный формат ответа:", data);
                throw new Error("Неверный формат данных от сервера");
            }
            
            const animalsData = ordersData.map(transformOrderToAnimal);
            
            if (isSuggestion) {
                return animalsData.slice(0, 5);
            } else {
                setAllAnimals(animalsData);

                if (reset) {
                    setPage(1);
                }
                const startIndex = 0;
                const endIndex = itemsPerPage;
                setDisplayedAnimals(animalsData.slice(startIndex, endIndex));
                setHasMore(animalsData.length > endIndex);
            }
            
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            
            if (isSuggestion) {
                return [];
            }
            
            setError(`Ошибка при загрузке данных: ${err.message}`);
            
            setAllAnimals([]);
            setDisplayedAnimals([]);
            setHasMore(false);
            
        } finally {
            if (!isSuggestion && !reset) {
                setLoading(false);
            }
        }
        
        return [];
    }, [itemsPerPage]);

    useEffect(() => {
        fetchAnimals("", false, true);
    }, [fetchAnimals]);

    const loadMoreAnimals = () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        
        const nextPage = page + 1;
        const startIndex = page * itemsPerPage;
        const endIndex = nextPage * itemsPerPage;
        
        const moreAnimals = allAnimals.slice(startIndex, endIndex);
        
        setDisplayedAnimals(prev => [...prev, ...moreAnimals]);
        setPage(nextPage);
        
        setHasMore(allAnimals.length > endIndex);
        
        setLoadingMore(false);
    };

    const fetchSuggestions = useCallback(async (query) => {
        if (query.trim().length >= 3) {
            try {
                const suggestionsData = await fetchAnimals(query, true);
                setSuggestions(suggestionsData);
            } catch (err) {
                console.error("Ошибка загрузки подсказок:", err);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    }, [fetchAnimals]);

    const debouncedSearch = useCallback((query) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(query);
        }, 1000);
    }, [fetchSuggestions]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);

            if (allAnimals.length > 0) {
                setDisplayedAnimals(allAnimals.slice(0, itemsPerPage));
                setHasMore(allAnimals.length > itemsPerPage);
            }
        } else {

            const filtered = allAnimals.filter(animal => 
                animal.kind?.toLowerCase().includes(value.toLowerCase()) ||
                animal.description?.toLowerCase().includes(value.toLowerCase())
            );
            setDisplayedAnimals(filtered.slice(0, itemsPerPage));
            setHasMore(filtered.length > itemsPerPage);
            

            if (value.length >= 3) {
                setShowSuggestions(true);
                debouncedSearch(value);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.kind || "");
        setShowSuggestions(false);

        const filtered = allAnimals.filter(animal => 
            animal.kind?.toLowerCase().includes(suggestion.kind.toLowerCase())
        );
        setDisplayedAnimals(filtered.slice(0, itemsPerPage));
        setHasMore(filtered.length > itemsPerPage);
    };

    const handleSearchClick = () => {
        if (searchTerm.trim().length >= 3) {
            fetchAnimals(searchTerm, false, true);
        }
        setShowSuggestions(false);
    };

    // Обработчик нажатия Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    // Сброс поиска
    const handleResetSearch = () => {
        setSearchTerm("");
        setSuggestions([]);
        setShowSuggestions(false);

        fetchAnimals("", false, true);
    };

    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <div className="container py-5">
                    <h2 className="text-center mb-4">Поиск животных</h2>
                    
                    <div className="row mb-4">
                        <div className="col-md-8 mx-auto">
                            <div className="input-group position-relative">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Введите описание животного" 
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyPress={handleKeyPress}
                                    onFocus={() => searchTerm.length >= 3 && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                />
                                <button 
                                    className="btn btn-primary" 
                                    type="button"
                                    onClick={handleSearchClick}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Поиск...
                                        </>
                                    ) : "Найти"}
                                </button>
                                {searchTerm && (
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={handleResetSearch}
                                    >
                                        Сбросить
                                    </button>
                                )}
                            </div>
                            
                            {/* Подсказки для пользователя */}
                            <div className="mt-2">
                                {searchTerm.length > 0 && searchTerm.length < 3 && (
                                    <div className="text-muted small">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Введите минимум 3 символа для поиска по API
                                    </div>
                                )}
                                {searchTerm.length >= 3 && (
                                    <div className="text-info small">
                                        <i className="bi bi-search me-1"></i>
                                        Идет поиск по описанию животных...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Сообщение об ошибке */}
                    <div className="row mb-4">
                        <div className="col-md-8 mx-auto">
                            {error && (
                                <div className="alert alert-warning d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        <span>{error}</span>
                                    </div>
                                    <div>
                                        <button 
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => fetchAnimals("", false, true)}
                                        >
                                            Повторить
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Индикатор загрузки */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p className="mt-3">Загружаем животных с сервера...</p>
                        </div>
                    )}

                    {/* Результаты поиска */}
                    {!loading && (
                        <>
                            {searchTerm && displayedAnimals.length > 0 && (
                                <div className="mb-4">
                                    <h5>
                                        <i className="bi bi-search me-2"></i>
                                        Результаты поиска для "{searchTerm}" 
                                        <span className="badge bg-primary ms-2">{displayedAnimals.length}</span>
                                    </h5>
                                </div>
                            )}
                            
                            <div className="row">
                                {displayedAnimals.length === 0 && !loading && !error ? (
                                    <div className="col-12">
                                        <div className="alert alert-info text-center">
                                            <i className="bi bi-info-circle me-2"></i>
                                            {searchTerm 
                                                ? `Животные по запросу "${searchTerm}" не найдены`
                                                : "Начните вводить описание животного для поиска"
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    displayedAnimals.map((animal) => (
                                        <div className="col-lg-4 col-md-6 mb-4" key={`animal-${animal.id}`}>
                                            <div 
                                                className="card animal-card h-100 shadow-sm" 
                                                style={{
                                                    transition: 'all 0.3s',
                                                    border: '1px solid #e9ecef'
                                                }} 
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                                }} 
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                                                }}
                                            >
                                                <div style={{height: '250px', overflow: 'hidden'}}>
                                                    <img 
                                                        src={getImageUrl(animal.image)} 
                                                        className="card-img-top h-100 w-100" 
                                                        alt={animal.kind}
                                                        style={{
                                                            objectFit: 'cover',
                                                            transition: 'transform 0.3s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/400x250?text=Нет+изображения";
                                                        }}
                                                    />
                                                </div>
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title text-primary">
                                                        <i className="bi bi-heart-fill me-2"></i>
                                                        {animal.kind || "Без названия"}
                                                    </h5>
                                                    <p className="card-text flex-grow-1">
                                                        {animal.description && animal.description.length > 100 
                                                            ? animal.description.substring(0, 100) + '...' 
                                                            : animal.description || "Описание отсутствует"
                                                        }
                                                    </p>
                                                    <div className="small text-muted mb-3">
                                                        {animal.district && (
                                                            <div className="mb-1">
                                                                <i className="bi bi-geo-alt me-1"></i>
                                                                <strong>Район:</strong> {animal.district}
                                                            </div>
                                                        )}
                                                        {animal.date && (
                                                            <div className="mb-1">
                                                                <i className="bi bi-calendar me-1"></i>
                                                                <strong>Дата:</strong> {animal.date}
                                                            </div>
                                                        )}
                                                        {animal.mark && (
                                                            <div>
                                                                <i className="bi bi-tag me-1"></i>
                                                                <strong>Метка:</strong> {animal.mark}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-auto">
                                                        <Link 
                                                            to={`/animal/${animal.id}`} 
                                                            state={{ animal }}
                                                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                                                        >
                                                            <i className="bi bi-eye me-2"></i>
                                                            Подробнее
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Кнопка "Загрузить еще" */}
                            {hasMore && displayedAnimals.length > 0 && (
                                <div className="text-center mt-4">
                                    <button 
                                        className="btn btn-outline-primary btn-lg px-5"
                                        onClick={loadMoreAnimals}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Загрузка...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-arrow-down-circle me-2"></i>
                                                Загрузить еще животных
                                            </>
                                        )}
                                    </button>
                                    <p className="text-muted mt-2 small">
                                        Показано {displayedAnimals.length} из {allAnimals.length} животных
                                    </p>
                                </div>
                            )}

                            {/* Сообщение, если все загружено */}
                            {!hasMore && displayedAnimals.length > 0 && (
                                <div className="text-center mt-4 pt-3 border-top">
                                    <p className="text-success">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Все животные загружены ({allAnimals.length} шт.)
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Search;