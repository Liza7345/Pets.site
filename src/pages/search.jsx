import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [useProxy, setUseProxy] = useState(false);

    // Функция для получения URL с возможным прокси
    const getApiUrl = (endpoint, query = "") => {
        const baseUrl = "https://pets.xn--80ahdri7a.site/api";
        let url = `${baseUrl}/${endpoint}`;
        
        if (query) {
            url += `?q=${encodeURIComponent(query)}`;
        }
        
        // Используем CORS proxy если обычный запрос не работает
        if (useProxy) {
            return `https://cors-anywhere.herokuapp.com/${url}`;
        }
        
        return url;
    };

    // Функция debounce для задержки запросов
    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Функция для получения полного URL изображения
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

    // Тестовые данные
    const getMockData = () => {
        return [
            {
                id: 1,
                kind: "Кошка",
                description: "Кошка рыжая",
                photos: "/storage/images/fXk6cXXxtggt6BDMa4y48WPheXTjwX5MengoQ5s3.png",
                mark: "vc-001-spb",
                district: "Василеостровский",
                date: "2023-03-05"
            },
            {
                id: 3,
                kind: "Собака",
                description: "Собака большая, грустная",
                photos: "/storage/images/uad6sYByxqWWPbxRoq1n2zNcIV7lsaZZVnv2FatL.png",
                mark: "vd-002-spb",
                district: "Курортный",
                date: "2023-03-05"
            },
            {
                id: 4,
                kind: "Зебра",
                description: "Зебра полосатая, высокая",
                photos: "/storage/images/symr3O4IscuApnUGf3Ckwv8o4iQeoMypKW66Afol.png",
                mark: "vz-003-spb",
                district: "Центральный",
                date: "2023-03-06"
            },
            {
                id: 5,
                kind: "Крокодил",
                description: "Крокодил зеленый, любит людей",
                photos: "/storage/images/A1d6l2dwPHHVk8hQmbONGUOa8XCNXlCQLyCrqq9U.png",
                mark: "vk-004-spb",
                district: "Приморский",
                date: "2023-03-07"
            },
            {
                id: 6,
                kind: "Кенгуру",
                description: "Кенгуру из Бразилии, любит прыгать, ласковая",
                photos: "/storage/images/06vZ5JD5SiY9scNCLx6NRku8f7t85CvBbSmbGObu.png",
                mark: "vk-005-spb",
                district: "Невский",
                date: "2023-03-08"
            }
        ];
    };

    // Загрузка животных
    const fetchAnimals = useCallback(async (searchQuery = "", isSuggestion = false) => {
        try {
            if (!isSuggestion) {
                setLoading(true);
            }
            setError(null);
            
            const useProxyForRequest = useProxy || searchQuery.length >= 3;
            const url = getApiUrl("search", searchQuery);
            
            console.log("Запрос к:", url);
            
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
            };
            
            // Добавляем Origin только если не используем прокси
            if (!useProxyForRequest) {
                headers["Origin"] = window.location.origin;
            }
            
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
                mode: useProxyForRequest ? 'cors' : 'no-cors',
                credentials: 'omit',
            });

            console.log("Статус ответа:", response.status, "OK:", response.ok);

            if (response.ok) {
                try {
                    const data = await response.json();
                    console.log("Данные получены:", data);
                    
                    let ordersData = [];
                    if (Array.isArray(data)) {
                        ordersData = data;
                    } else if (data.data && data.data.orders && Array.isArray(data.data.orders)) {
                        ordersData = data.data.orders;
                    } else if (data.orders && Array.isArray(data.orders)) {
                        ordersData = data.orders;
                    } else if (data.data && Array.isArray(data.data)) {
                        ordersData = data.data;
                    } else {
                        console.warn("Неизвестный формат ответа:", data);
                        throw new Error("Неверный формат данных");
                    }
                    
                    const animalsData = ordersData.map(transformOrderToAnimal);
                    
                    if (isSuggestion) {
                        return animalsData.slice(0, 5);
                    } else {
                        setAnimals(animalsData);
                        setFilteredAnimals(animalsData);
                    }
                    
                } catch (parseError) {
                    console.error("Ошибка парсинга JSON:", parseError);
                    throw new Error("Ошибка обработки данных");
                }
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
            
        } catch (err) {
            console.error("Ошибка запроса:", err);
            
            // Для подсказок возвращаем пустой массив
            if (isSuggestion) {
                return [];
            }
            
            // Для основного запроса используем тестовые данные
            if (!searchQuery || searchQuery.length < 3) {
                const mockData = getMockData();
                const animalsData = mockData.map(transformOrderToAnimal);
                setAnimals(animalsData);
                setFilteredAnimals(animalsData);
            } else {
                setError(`Поиск не доступен. Используйте локальную фильтрацию.`);
                // Фильтруем существующие данные
                const filtered = animals.filter(animal => 
                    animal.kind?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    animal.description?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredAnimals(filtered);
            }
            
            // Пробуем включить прокси для следующих запросов
            if (!useProxy) {
                setUseProxy(true);
            }
            
        } finally {
            if (!isSuggestion) {
                setLoading(false);
            }
        }
        
        return [];
    }, [animals, useProxy]);

    // Загрузка при монтировании
    useEffect(() => {
        fetchAnimals("");
    }, []);

    // Функция для получения подсказок с debounce
    const fetchSuggestionsWithDebounce = useCallback(
        debounce(async (query) => {
            if (query.length >= 3) {
                try {
                    const suggestionsData = await fetchAnimals(query, true);
                    setSuggestions(suggestionsData);
                } catch (err) {
                    console.error("Ошибка загрузки подсказок:", err);
                    setSuggestions([]);
                }
            }
        }, 1000),
        [fetchAnimals]
    );

    // Обработчик изменения поля поиска
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.trim() === "") {
            setSuggestions([]);
            setShowSuggestions(false);
            setFilteredAnimals(animals);
        } else {
            // Локальная фильтрация
            const filtered = animals.filter(animal => 
                animal.kind?.toLowerCase().includes(value.toLowerCase()) ||
                animal.description?.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredAnimals(filtered);
            
            if (value.length >= 3) {
                fetchSuggestionsWithDebounce(value);
                setShowSuggestions(true);
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
        
        const filtered = animals.filter(animal => 
            animal.kind?.toLowerCase().includes(suggestion.kind.toLowerCase())
        );
        setFilteredAnimals(filtered);
    };

    // Обработчик кнопки поиска
    const handleSearchClick = () => {
        if (searchTerm.length >= 3) {
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
        setFilteredAnimals(animals);
    };

    // Загрузка тестовых данных
    const handleLoadMockData = () => {
        const mockData = getMockData();
        const animalsData = mockData.map(transformOrderToAnimal);
        setAnimals(animalsData);
        setFilteredAnimals(animalsData);
        setError(null);
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
                                    placeholder="Введите тип животного или описание (минимум 3 символа)" 
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
                                                    key={`sug-${index}`}
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

                    {/* Сообщение об ошибке и кнопка загрузки тестовых данных */}
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
                                            className="btn btn-sm btn-outline-warning me-2"
                                            onClick={() => fetchAnimals("")}
                                        >
                                            Повторить
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={handleLoadMockData}
                                        >
                                            Использовать тестовые данные
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Индикатор загрузки */}
                    {loading && !error && (
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
                                {filteredAnimals.length === 0 && !loading ? (
                                    <div className="col-12">
                                        <div className="alert alert-info text-center">
                                            <i className="bi bi-info-circle me-2"></i>
                                            {searchTerm 
                                                ? `Животные по запросу "${searchTerm}" не найдены`
                                                : "Введите запрос для поиска животных"
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
                                            Показано {filteredAnimals.length} животных
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