import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // Используем useRef для хранения таймера debounce
    const debounceTimer = useRef(null);

    // Функция для получения URL изображения
    const getImageUrl = (photoPath) => {
        if (!photoPath) return "https://via.placeholder.com/300x200?text=Нет+изображения";
        if (photoPath.startsWith("http")) return photoPath;
        return `https://pets.xn--80ahdri7a.site${photoPath}`;
    };

    // Преобразование данных из формата orders в pets
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

    // Основная функция загрузки животных
    const fetchAnimals = useCallback(async (searchQuery = "", isSuggestion = false) => {
        try {
            if (!isSuggestion) {
                setLoading(true);
            }
            setError(null);
            
            // Формируем URL для запроса
            let url = "https://pets.xn--80ahdri7a.site/api/search";
            
            // Если есть поисковый запрос, добавляем его как query параметр
            if (searchQuery && searchQuery.trim().length >= 3) {
                url += `?q=${encodeURIComponent(searchQuery.trim())}`;
            }
            
            console.log("Запрос к:", url);
            
            // Выполняем запрос без прокси
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                mode: 'cors', // Указываем явно режим CORS
                credentials: 'omit', // Не отправляем куки
            });

            console.log("Статус ответа:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Данные получены:", data);
            
            // Извлекаем данные из структуры ответа
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
                // Для подсказок возвращаем только первые 5 результатов
                return animalsData.slice(0, 5);
            } else {
                // Для основного результата устанавливаем все данные
                setAnimals(animalsData);
                setFilteredAnimals(animalsData);
            }
            
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            
            if (isSuggestion) {
                // Для подсказок возвращаем пустой массив
                return [];
            }
            
            setError(`Ошибка при загрузке данных: ${err.message}`);
            
            // Устанавливаем пустые массивы, чтобы убрать моковые данные
            setAnimals([]);
            setFilteredAnimals([]);
            
        } finally {
            if (!isSuggestion) {
                setLoading(false);
            }
        }
        
        return [];
    }, []);

    // Загрузка всех животных при монтировании компонента
    useEffect(() => {
        fetchAnimals("");
    }, [fetchAnimals]);

    // Функция для получения подсказок с debounce
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

    // Debounce функция для обработки ввода
    const debouncedSearch = useCallback((query) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(query);
        }, 1000); // Задержка 1000ms как указано в задании
    }, [fetchSuggestions]);

    // Обработчик изменения поля поиска
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
            setFilteredAnimals(animals); // Показываем всех животных при пустом поиске
        } else {
            // Сначала делаем локальную фильтрацию
            const filtered = animals.filter(animal => 
                animal.kind?.toLowerCase().includes(value.toLowerCase()) ||
                animal.description?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAnimals(filtered);
            
            // Для подсказок используем debounce
            if (value.length >= 3) {
                setShowSuggestions(true);
                debouncedSearch(value);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    // Обработчик выбора подсказки
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.kind || "");
        setShowSuggestions(false);
        
        // Фильтруем локально по выбранной подсказке
        const filtered = animals.filter(animal => 
            animal.kind?.toLowerCase().includes(suggestion.kind.toLowerCase())
        );
        setFilteredAnimals(filtered);
    };

    // Обработчик кнопки поиска
    const handleSearchClick = () => {
        if (searchTerm.trim().length >= 3) {
            // Выполняем поиск на сервере
            fetchAnimals(searchTerm);
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
        // Показываем всех животных
        fetchAnimals("");
    };

    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <div className="container py-5">
                    <h2 className="text-center mb-4">Поиск животных</h2>
                    
                    {/* Поисковая строка */}
                    <div className="row mb-4">
                        <div className="col-md-8 mx-auto">
                            <div className="input-group position-relative">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Введите описание животного (минимум 3 символа)" 
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
                                
                                {/* Подсказки */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="position-absolute top-100 start-0 end-0 z-3 mt-1">
                                        <div className="list-group shadow">
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={`sug-${suggestion.id}-${index}`}
                                                    type="button"
                                                    className="list-group-item list-group-item-action text-start"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3" style={{width: '40px', height: '40px'}}>
                                                            <img 
                                                                src={getImageUrl(suggestion.image)} 
                                                                alt={suggestion.kind}
                                                                className="img-fluid rounded"
                                                                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                            />
                                                        </div>
                                                        <div>
                                                            <strong>{suggestion.kind}</strong>
                                                            {suggestion.description && (
                                                                <span className="text-muted d-block small">
                                                                    {suggestion.description.substring(0, 50)}...
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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
                                            onClick={() => fetchAnimals("")}
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
                            {searchTerm && filteredAnimals.length > 0 && (
                                <div className="mb-4">
                                    <h5>
                                        <i className="bi bi-search me-2"></i>
                                        Результаты поиска для "{searchTerm}" 
                                        <span className="badge bg-primary ms-2">{filteredAnimals.length}</span>
                                    </h5>
                                </div>
                            )}
                            
                            <div className="row">
                                {filteredAnimals.length === 0 && !loading && !error ? (
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
                                    filteredAnimals.map((animal) => (
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
                        </>
                    )}

                    {/* Статистика */}
                    {!loading && filteredAnimals.length > 0 && (
                        <div className="mt-5 pt-4 border-top">
                            <div className="row">
                                <div className="col-md-8 mx-auto">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-muted">
                                            <i className="bi bi-info-circle me-1"></i>
                                            Найдено {filteredAnimals.length} животных
                                            {searchTerm && " по вашему запросу"}
                                        </div>
                                        <div>
                                            <button 
                                                className="btn btn-outline-info btn-sm"
                                                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                                            >
                                                <i className="bi bi-arrow-up me-1"></i>
                                                Наверх
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Search;