import React from "react";
import Slider from "../components/slider";
import { Link } from "react-router-dom";
import NewsletterSubscription from "../components/NewsletterSubscription";
const Main = () => {
  return (
    <div>
      <main style={{'minHeight':'70vh'}}>
<div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebPets - Главная</title>
  <link rel="stylesheet" href="css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
  <style dangerouslySetInnerHTML={{__html: "\n        .custom-modal .modal-content {\n            border-radius: 10px;\n            overflow: hidden;\n        }\n        .input-group-text {\n            background-color: #f8f9fa;\n            border-right: none;\n        }\n        .form-control {\n            border-left: none;\n        }\n        .form-control:focus {\n            box-shadow: none;\n            border-color: #ced4da;\n        }\n        .btn-login {\n            background-color: #0d6efd;\n            border-radius: 8px;\n            padding: 10px 0;\n            font-weight: 500;\n        }\n        .remember-me {\n            font-size: 14px;\n        }\n        .form-check-input:checked {\n            background-color: #198754;\n            border-color: #198754;\n        }\n        .registration-link, .forgot-link {\n            font-size: 14px;\n            text-decoration: none;\n        }\n        .registration-link:hover, .forgot-link:hover {\n            text-decoration: underline;\n        }\n        .nav-link {\n            font-weight: 500;\n        }\n        .hero-section {\n            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);\n            color: white;\n            padding: 100px 0;\n            text-align: center;\n        }\n        .feature-card {\n            border: none;\n            border-radius: 10px;\n            box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n            transition: transform 0.3s;\n        }\n        .feature-card:hover {\n            transform: translateY(-5px);\n        }\n        .carousel-item img {\n            height: 400px;\n            object-fit: cover;\n        }\n        .animal-card {\n            transition: transform 0.3s;\n        }\n        .animal-card:hover {\n            transform: translateY(-5px);\n        }\n    " }} />
  <section className="hero-section">
    <div className="container">
      <h1 className="display-4 fw-bold mb-4">Забота о ваших питомцах</h1>
      <p className="lead mb-4">Найдите надежных ситтеров, выгульщиков и ветеринаров для ваших любимцев</p>
      <Link className="btn btn-light btn-lg px-4" to="/register">Начать сейчас</Link>
    </div>
  </section>
  <Slider/>
  {/* Секция с карточками */}
  <section className="py-5">
    <div className="container">
      <h2 className="text-center mb-5">Наши услуги</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card feature-card h-100">
            <div className="card-body text-center p-4">
              <i className="bi bi-house-door-fill text-primary display-4 mb-3" />
              <h5 className="card-title">Передержка</h5>
              <p className="card-text">Надежные ситтеры позаботятся о вашем питомце, пока вас нет дома.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card feature-card h-100">
            <div className="card-body text-center p-4">
              <i className="bi bi-bicycle text-success display-4 mb-3" />
              <h5 className="card-title">Выгул собак</h5>
              <p className="card-text">Активные прогулки для вашего питомца в удобное для вас время.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card feature-card h-100">
            <div className="card-body text-center p-4">
              <i className="bi bi-heart-pulse text-danger display-4 mb-3" />
              <h5 className="card-title">Ветеринарная помощь</h5>
              <p className="card-text">Квалифицированные ветеринары окажут помощь вашему питомцу.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section className="newsletter-section">
    <div className="container">
      <div className="newsletter-content">
        <div className="newsletter-icon">
        </div>
        <h2 className="mb-3">Подпишитесь на новости</h2>
        <p className="lead mb-4">
          Будьте в курсе последних новостей о животных.
          Получайте полезные советы по уходу за питомцами.
        </p>
        <NewsletterSubscription />
      </div>
    </div>
  </section>
  {/* Модальное окно входа */}
  <div className="modal fade custom-modal" id="loginModal" tabIndex={-1} aria-labelledby="loginModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title w-100 text-center fw-bold" id="loginModalLabel">Вход в аккаунт</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body px-4 pt-0">
          {/* Поле логина */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person" />
              </span>
              <input type="text" className="form-control border-start-0" placeholder="Логин или email" />
            </div>
          </div>
          {/* Поле пароля */}
          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-lock" />
              </span>
              <input type="password" className="form-control border-start-0" placeholder="Пароль" />
            </div>
          </div>
          {/* Запомнить меня */}
          <div className="mb-3 d-flex justify-content-between align-items-center remember-me">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Запомнить меня
              </label>
            </div>
          </div>
          {/* Кнопка входа */}
          <div className="d-grid mb-3">
            <a href="profile.html" className="btn btn-primary btn-login">Войти</a>
          </div>
          {/* Регистрация */}
          <div className="text-center mb-3">
            <a href="register.html" className="registration-link d-flex align-items-center justify-content-center text-decoration-none">
              Регистрация
              <i className="bi bi-arrow-right ms-1" />
            </a>
          </div>
          {/* Забыли логин/пароль */}
          <div className="text-center">
            <a href="#" className="forgot-link d-block text-decoration-none mb-1">Забыли логин?</a>
            <a href="#" className="forgot-link d-block text-decoration-none">Забыли пароль?</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}

export default Main;
