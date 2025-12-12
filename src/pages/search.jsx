import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const Search = () => {
    const [district, setDistrict] = useState("");
    const [kind, setKind] = useState("");
    const [allAnimals, setAllAnimals] = useState([]);
    const [currentPageAnimals, setCurrentPageAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const animalsPerPage = 10;

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

    const fetchAllAnimals = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            let url = "https://pets.xn--80ahdri7a.site/api/search/order";
            
            console.log("Запрос всех животных:", url);
            
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

            if (response.status === 204) {
                setAllAnimals([]);
                setCurrentPageAnimals([]);
                setLoading(false);
                return;
            }

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
                throw new Error("Неверный формат данных от сервера");
            }
            
            const animalsData = ordersData.map(transformOrderToAnimal);
            
            setAllAnimals(animalsData);
            setCurrentPage(1);
            
            // Показываем первую страницу (первые 10 животных)
            const startIndex = 0;
            const endIndex = animalsPerPage;
            setCurrentPageAnimals(animalsData.slice(startIndex, endIndex));
            
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            setError(`Ошибка при загрузке данных: ${err.message}`);
            setAllAnimals([]);
            setCurrentPageAnimals([]);
        } finally {
            setLoading(false);
        }
    }, [animalsPerPage]);

    const fetchAnimalsWithFilters = useCallback(async (searchDistrict = "", searchKind = "") => {
        try {
            setLoading(true);
            setError(null);
            
            let url = "https://pets.xn--80ahdri7a.site/api/search/order";
            const params = new URLSearchParams();
            
            if (searchDistrict.trim()) {
                params.append("district", searchDistrict.trim());
            }
            
            if (searchKind.trim()) {
                params.append("kind", searchKind.trim());
            }
            
            if (!params.toString()) {
                fetchAllAnimals();
                return;
            }
            
            url += `?${params.toString()}`;
            
            console.log("Запрос с фильтрами:", url);
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                mode: 'cors',
                credentials: 'omit',
            });

            if (response.status === 204) {
                setAllAnimals([]);
                setCurrentPageAnimals([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            let ordersData = [];
            if (data.data && data.data.orders && Array.isArray(data.data.orders)) {
                ordersData = data.data.orders;
            } else if (Array.isArray(data)) {
                ordersData = data;
            } else if (data.orders && Array.isArray(data.orders)) {
                ordersData = data.orders;
            } else {
                throw new Error("Неверный формат данных от сервера");
            }
            
            const animalsData = ordersData.map(transformOrderToAnimal);
            
            setAllAnimals(animalsData);
            setCurrentPage(1);
            
            const startIndex = 0;
            const endIndex = animalsPerPage;
            setCurrentPageAnimals(animalsData.slice(startIndex, endIndex));
            
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            setError(`Ошибка при загрузке данных: ${err.message}`);
            setAllAnimals([]);
            setCurrentPageAnimals([]);
        } finally {
            setLoading(false);
        }
    }, [fetchAllAnimals, animalsPerPage]);

    useEffect(() => {
        fetchAllAnimals();
    }, [fetchAllAnimals]);

    // Генерация номеров страниц для пагинации
    const generatePaginationLinks = () => {
        const totalPages = Math.ceil(allAnimals.length / animalsPerPage);
        const paginationItems = [];
        
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li 
                    className={`page-item ${currentPage === i ? 'active' : ''}`} 
                    key={i}
                >
                    <button 
                        className="page-link" 
                        onClick={() => handlePageClick(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        
        return paginationItems;
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        const startIndex = (pageNumber - 1) * animalsPerPage;
        const endIndex = startIndex + animalsPerPage;
        setCurrentPageAnimals(allAnimals.slice(startIndex, endIndex));
        
        // Прокрутка вверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDistrictChange = (e) => {
        setDistrict(e.target.value);
    };

    const handleKindChange = (e) => {
        setKind(e.target.value);
    };

    const handleSearchClick = () => {
        fetchAnimalsWithFilters(district, kind);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleResetSearch = () => {
        setDistrict("");
        setKind("");
        fetchAllAnimals();
        setError(null);
    };

    const handleClearFilters = () => {
        setDistrict("");
        setKind("");
        if (!district && !kind) {
            fetchAllAnimals();
        }
    };

    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <div className="container py-5">
                    <h2 className="text-center mb-4">Поиск животных</h2>
                    
                    <div className="row mb-4">
                        <div className="col-md-8 mx-auto">
                            <div className="mb-3">
                                <label className="form-label">Район (строгий поиск)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Например: Центральный" 
                                    value={district}
                                    onChange={handleDistrictChange}
                                    onKeyPress={handleKeyPress}
                                />
                                <div className="form-text">
                                    Поиск по полному соответствию. Оставьте пустым для поиска по всем районам.
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Вид животного (нестрогий поиск)</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Например: ко" 
                                    value={kind}
                                    onChange={handleKindChange}
                                    onKeyPress={handleKeyPress}
                                />
                                <div className="form-text">
                                    Поиск по частичному совпадению (ко → кошка, кот, котик и т.д.)
                                </div>
                            </div>
                            
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-primary flex-grow-1" 
                                    type="button"
                                    onClick={handleSearchClick}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Поиск...
                                        </>
                                    ) : "Поиск"}
                                </button>
                                {(district || kind) && (
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={handleClearFilters}
                                    >
                                        Очистить фильтры
                                    </button>
                                )}
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={handleResetSearch}
                                >
                                    Сбросить всё
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="row mb-4">
                            <div className="col-md-8 mx-auto">
                                <div className="alert alert-warning d-flex justify-content-between align-items-center">
                                    <div>
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        <span>{error}</span>
                                    </div>
                                    <div>
                                        <button 
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={fetchAllAnimals}
                                        >
                                            Повторить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p className="mt-3">Загрузка животных...</p>
                        </div>
                    )}

                    {!loading && (
                        <>
                            <div className="mb-4">
                                <h5>
                                    {district || kind ? (
                                        <>
                                            <i className="bi bi-filter me-2"></i>
                                            Результаты поиска:
                                            {district && ` Район: "${district}"`}
                                            {kind && ` Вид: "${kind}"`}
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-list-ul me-2"></i>
                                            Все животные
                                        </>
                                    )}
                                    <span className={`badge ${district || kind ? 'bg-primary' : 'bg-success'} ms-2`}>
                                        {allAnimals.length} всего
                                    </span>
                                </h5>
                                <p className="text-muted small">
                                    Страница {currentPage} из {Math.ceil(allAnimals.length / animalsPerPage)}
                                </p>
                            </div>
                            
                            {currentPageAnimals.length === 0 ? (
                                <div className="col-12">
                                    <div className="alert alert-info text-center">
                                        <i className="bi bi-info-circle me-2"></i>
                                        {district || kind 
                                            ? `Животные по запросу "${district}${district && kind ? ', ' : ''}${kind}" не найдены`
                                            : "Животные не найдены"
                                        }
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="row">
                                        {currentPageAnimals.map((animal) => (
                                            <div className="col-lg-4 col-md-6 mb-4" key={`animal-${animal.id}`}>
                                                <div className="card animal-card h-100 shadow-sm">
                                                    <div style={{height: '250px', overflow: 'hidden'}}>
                                                        <img 
                                                            src={getImageUrl(animal.image)} 
                                                            className="card-img-top h-100 w-100" 
                                                            alt={animal.kind}
                                                            style={{objectFit: 'cover'}}
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
                                                                className="btn btn-primary w-100"
                                                            >
                                                                <i className="bi bi-eye me-2"></i>
                                                                Подробнее
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Пагинация */}
                                    {allAnimals.length > animalsPerPage && (
                                        <nav aria-label="Page navigation example" className="mt-4">
                                            <ul className="pagination justify-content-center">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => handlePageClick(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Назад
                                                    </button>
                                                </li>
                                                
                                                {generatePaginationLinks()}
                                                
                                                <li className={`page-item ${currentPage === Math.ceil(allAnimals.length / animalsPerPage) ? 'disabled' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => handlePageClick(currentPage + 1)}
                                                        disabled={currentPage === Math.ceil(allAnimals.length / animalsPerPage)}
                                                    >
                                                        Вперед
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}

                                    <div className="text-center mt-3 text-muted small">
                                        <p>
                                            Показано животных: {currentPageAnimals.length} из {allAnimals.length}
                                            {currentPage > 1 && ` (страница ${currentPage})`}
                                        </p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Search;