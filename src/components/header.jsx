import React from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
const Header = () => {
    return (
        <div>
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
        <li className="nav-item dropdown">
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Выгул собак</a></li>
            <li><a className="dropdown-item" href="#">Передержка</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" href="#">Ветеринарная помощь</a></li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/search">Поиск животных</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">Личный кабинет</Link>
        </li>
      </ul>
      <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Поиск" aria-label="Search" />
        <button className="btn btn-outline-primary" type="submit">Найти</button>
      </form>
      <button type="button" className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#loginModal">
        Вход
      </button>
    </div>
  </div>
  <LoginModal />
</nav>

        </div>
    )
}
export default Header;