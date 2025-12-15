import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

const Header = () => {
    const [quickSearch, setQuickSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef(null);
    const navigate = useNavigate();

    const handleQuickSearch = (query) => {
        setQuickSearch(query);
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        debounceTimer.current = setTimeout(async () => {
            if (query.length >= 3) {
                try {
                    const res = await fetch(
                        `https://pets.xn--80ahdri7a.site/api/search?query=${encodeURIComponent(query)}`
                    );
                    const data = await res.json();
                    setSuggestions((data.data?.orders || []).slice(0, 5));
                    setShowSuggestions(true);
                } catch (e) {
                    console.error(e);
                }
            }
        }, 500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quickSearch.trim()) {
            navigate(`/search?query=${encodeURIComponent(quickSearch)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (description) => {
        setQuickSearch(description);
        navigate(`/search?query=${encodeURIComponent(description)}`);
        setShowSuggestions(false);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">WebPets</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Главная</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">О нас</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/search">Поиск животных</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">Личный кабинет</Link>
                        </li>
                    </ul>
                    
                    {/* Форма поиска */}
                    <form className="d-flex position-relative" onSubmit={handleSubmit}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Поиск по описанию..."
                            aria-label="Search"
                            value={quickSearch}
                            onChange={(e) => handleQuickSearch(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            onBlur={handleBlur}
                        />
                        <button className="btn btn-outline-primary" type="submit">
                            Найти
                        </button>
                        
                        {/* Выпадающие подсказки */}
                        {showSuggestions && suggestions.length > 0 && quickSearch.length >= 3 && (
                            <div className="dropdown-menu show position-absolute top-100 start-0 w-100 mt-1">
                                {suggestions.map((item, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="dropdown-item small text-truncate"
                                        onClick={() => handleSuggestionClick(item.description)}
                                    >
                                        {item.description?.substring(0, 80)}...
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>
                    
                    <button type="button" className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#loginModal">
                        Вход
                    </button>
                </div>
            </div>
            <LoginModal />
        </nav>
    );
};

export default Header;