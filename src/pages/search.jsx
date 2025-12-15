import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [district, setDistrict] = useState("");
    const [kind, setKind] = useState("");
    const [query, setQuery] = useState(searchParams.get("query") || "");
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const debounceTimer = useRef(null);
    const perPage = 9;
    const isFirstRender = useRef(true);

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/300x200";
        if (typeof photo === 'string') {
            return photo.startsWith("http") ? photo : `https://pets.xn--80ahdri7a.site${photo}`;
        }
        if (Array.isArray(photo) && photo[0]) {
            const firstPhoto = photo[0];
            return firstPhoto.startsWith("http") ? firstPhoto : `https://pets.xn--80ahdri7a.site${firstPhoto}`;
        }
        return "https://via.placeholder.com/300x200";
    };

    const search = async (url) => {
        setLoading(true);
        try {
            const res = await fetch(url);
            setAnimals(res.ok && res.status !== 204 ? await res.json().then(d => d.data?.orders || []) : []);
        } catch (e) {
            setAnimals([]);
        } finally {
            setLoading(false);
            setPage(1);
        }
    };

    const quickSearch = (value) => {
        setQuery(value);
        if (!value.trim()) return fetchAll();
        
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setSearchParams({ query: value });
            search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(value)}`);
        }, 500);
    };

    const fetchAll = () => {
        search("https://pets.xn--80ahdri7a.site/api/search/order");
    };

    useEffect(() => {
        const urlQuery = searchParams.get("query");
        const urlDistrict = searchParams.get("district");
        const urlKind = searchParams.get("kind");
        
        if (urlQuery !== query) setQuery(urlQuery || "");
        if (urlDistrict !== district) setDistrict(urlDistrict || "");
        if (urlKind !== kind) setKind(urlKind || "");
        
        if (isFirstRender.current) {
            if (urlQuery || urlDistrict || urlKind) {
                const params = new URLSearchParams();
                if (urlQuery) params.append("query", urlQuery);
                if (urlDistrict) params.append("district", urlDistrict);
                if (urlKind) params.append("kind", urlKind);
                
                const searchUrl = urlQuery 
                    ? `https://pets.xn--80ahdri7a.site/api/search?${params}`
                    : `https://pets.xn--80ahdri7a.site/api/search/order?${params}`;
                search(searchUrl);
            } else {
                fetchAll();
            }
            isFirstRender.current = false;
        } else {
            if (urlQuery && urlQuery !== query) {
                search(`https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(urlQuery)}`);
            }
        }
    }, [searchParams]);

    const handleFilterSearch = () => {
        const params = new URLSearchParams();
        if (district) params.append("district", district);
        if (kind) params.append("kind", kind);
        if (query) params.append("query", query);
        
        setSearchParams(params);
        const url = query 
            ? `https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}&district=${district}&kind=${kind}`
            : `https://pets.xn--80ahdri7a.site/api/search/order?${params}`;
        search(url);
    };

    const resetAll = () => {
        setDistrict("");
        setKind("");
        setQuery("");
        setSearchParams({});
        fetchAll();
    };

    const currentAnimals = animals.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.ceil(animals.length / perPage);

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Поиск животных</h2>

            <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Поиск по описанию..."
                        value={query}
                        onChange={e => quickSearch(e.target.value)}
                    />
                    
                    <div className="row g-2 mb-3">
                        <div className="col">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Район"
                                value={district} 
                                onChange={e => setDistrict(e.target.value)} 
                            />
                        </div>
                        <div className="col">
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Вид животного"
                                value={kind} 
                                onChange={e => setKind(e.target.value)} 
                            />
                        </div>
                    </div>
                    
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

            {loading ? (
                <div className="text-center"><div className="spinner-border"></div></div>
            ) : animals.length === 0 ? (
                <div className="alert alert-info text-center">
                    {searchParams.toString() ? "Ничего не найдено" : "Нет животных"}
                </div>
            ) : (
                <>
                    <h5>Найдено: {animals.length}</h5>
                    
                    <div className="row">
                        {currentAnimals.map(a => (
                            <div className="col-lg-4 col-md-6 mb-4" key={a.id}>
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={getImageUrl(a.photos)} 
                                        className="card-img-top" 
                                        alt={a.kind}
                                        style={{height: '200px', objectFit: 'cover'}} 
                                        onError={(e) => e.target.src = "https://via.placeholder.com/300x200"}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h6>{a.kind}</h6>
                                        {/* ОТОБРАЖЕНИЕ РАЙОНА */}
                                        {a.district && (
                                            <p className="text-muted small mb-2">
                                                <i className="bi bi-geo-alt me-1"></i>
                                                {a.district}
                                            </p>
                                        )}
                                        <p className="small text-muted flex-grow-1">
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
                        <nav>
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