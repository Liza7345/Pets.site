import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="site-footer bg-light border-top">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6 mb-4">
                      <br></br>
                        <Link to="/" className="fw-bold fs-4 text-decoration-none text-primary">
                            WebPets
                        </Link>
                        <p className="mt-3 mb-4">
                            Сервис для поиска надежных ситтеров, выгульщиков и ветеринаров для ваших питомцев.
                        </p>
                    </div>
                    
                    <div className="col-lg-2 col-md-6 mb-4">
                    <br></br>
                        <h5 className="mb-3">Компания</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/about" className="text-muted text-decoration-none">О нас</Link>
                            </li>
                            <li className="mb-2">
                                <a href="#contacts" className="text-muted text-decoration-none">Контакты</a>
                            </li>
                            <li className="mb-2">
                                <a href="#vacancies" className="text-muted text-decoration-none">Вакансии</a>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="col-lg-3 col-md-6 mb-4">
                    <br></br>
                        <h5 className="mb-3">Услуги</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="#walking" className="text-muted text-decoration-none">Выгул собак</a>
                            </li>
                            <li className="mb-2">
                                <a href="#sitting" className="text-muted text-decoration-none">Передержка</a>
                            </li>
                            <li className="mb-2">
                                <a href="#veterinary" className="text-muted text-decoration-none">Ветеринарная помощь</a>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="col-lg-3 col-md-6 mb-4">
                    <br></br>
                        <h5 className="mb-3">Помощь</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a href="#faq" className="text-muted text-decoration-none">Частые вопросы</a>
                            </li>
                            <li className="mb-2">
                                <a href="#privacy" className="text-muted text-decoration-none">Политика конфиденциальности</a>
                            </li>
                            <li className="mb-2">
                                <Link to="/search" className="text-muted text-decoration-none">Поиск животных</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="row pt-4 border-top">
                    <div className="col-12">
                        <div className="text-center text-muted">
                            <p className="mb-1">© 2023 WebPets. Все права защищены.</p>
                            <p className="small mb-0">
                                Сайт создан для проекта по веб-разработке.
                                Изображения животных используются в учебных целях.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;