import React from "react";
const Footer = () => {
    return (
        <div>
<div>
  <style dangerouslySetInnerHTML={{__html: "\n            /* Стили для прижатия футера к низу */\nhtml, body {\n    height: 100%;\n}\n\nbody {\n    display: flex;\n    flex-direction: column;\n    min-height: 100vh;\n}\n\n/* Основной контент растягивается */\n.container:not(.site-footer .container) {\n    flex: 1 0 auto;\n}\n\n/* Стили для футера */\n.site-footer {\n    background-color: #f8f9fa;\n    border-top: 1px solid #e9ecef;\n    padding: 40px 0 20px;\n    margin-top: auto; \n    flex-shrink: 0;\n}\n.footer-logo {\n    font-weight: bold;\n    font-size: 24px;\n    color: #0d6efd;\n    text-decoration: none;\n}\n.footer-links h5 {\n    font-size: 18px;\n    margin-bottom: 20px;\n    color: #333;\n}\n.footer-links ul {\n    list-style: none;\n    padding-left: 0;\n}\n.footer-links li {\n    margin-bottom: 10px;\n}\n.footer-links a {\n    color: #666;\n    text-decoration: none;\n    transition: color 0.3s;\n}\n.footer-links a:hover {\n    color: #0d6efd;\n}\n.social-links a {\n    display: inline-block;\n    width: 36px;\n    height: 36px;\n    background-color: #e9ecef;\n    border-radius: 50%;\n    text-align: center;\n    line-height: 36px;\n    margin-right: 10px;\n    color: #666;\n    transition: all 0.3s;\n}\n.social-links a:hover {\n    background-color: #0d6efd;\n    color: white;\n}\n.copyright {\n    border-top: 1px solid #dee2e6;\n    padding-top: 20px;\n    margin-top: 30px;\n    color: #666;\n    font-size: 14px;\n}\n            " }} />
  {/* Футер */}
  <footer className="site-footer">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4">
          <a href="index.html" className="footer-logo">WebPets</a>
          <p className="mt-3">Сервис для поиска надежных ситтеров, выгульщиков и ветеринаров для ваших питомцев. Мы заботимся о животных с 2023 года.</p>
          <div className="social-links mt-4">
            <a href="#"><i className="bi bi-facebook" /></a>
            <a href="#"><i className="bi bi-instagram" /></a>
            <a href="#"><i className="bi bi-twitter" /></a>
            <a href="#"><i className="bi bi-youtube" /></a>
            <a href="#"><i className="bi bi-telegram" /></a>
          </div>
        </div>
        <div className="col-lg-2 col-md-6 mb-4 footer-links">
          <h5>Компания</h5>
          <ul>
            <li><a href="about.html">О нас</a></li>
            <li><a href="#">Контакты</a></li>
            <li><a href="#">Вакансии</a></li>
            <li><a href="#">Партнерам</a></li>
            <li><a href="#">Блог</a></li>
          </ul>
        </div>
        <div className="col-lg-3 col-md-6 mb-4 footer-links">
          <h5>Услуги</h5>
          <ul>
            <li><a href="#">Выгул собак</a></li>
            <li><a href="#">Передержка</a></li>
            <li><a href="#">Ветеринарная помощь</a></li>
            <li><a href="#">Дрессировка</a></li>
            <li><a href="#">Груминг</a></li>
          </ul>
        </div>
        <div className="col-lg-3 col-md-6 mb-4 footer-links">
          <h5>Помощь</h5>
          <ul>
            <li><a href="#">Частые вопросы</a></li>
            <li><a href="#">Политика конфиденциальности</a></li>
            <li><a href="#">Условия использования</a></li>
            <li><a href="#">Поддержка</a></li>
            <li><a href="#">Служба заботы о животных</a></li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="copyright text-center">
            <p>© 2023 WebPets. Все права защищены. 
              <br />Сайт создан для проекта по веб-разработке. 
              <br />Изображения животных используются в учебных целях.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>



        </div>
    )
}
export default Footer;