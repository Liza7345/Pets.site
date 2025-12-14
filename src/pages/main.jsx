import React from "react";
import Slider from "../components/slider";
import { Link } from "react-router-dom";
import NewsletterSubscription from "../components/NewsletterSubscription";
import RecentAnimals from "../components/RecentAnimals";
import LoginModal from "../components/LoginModal";
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
  <RecentAnimals />
  <LoginModal />
</div>

      </main>
    </div>
  );
}

export default Main;
