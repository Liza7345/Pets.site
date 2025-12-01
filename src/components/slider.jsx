import React from "react";
const Slider = () => {
    return (
        <div>
              {/* Слайдер с животными */}
  <section className="py-5">
    <div className="container">
      <h2 className="text-center mb-5">Наши подопечные</h2>
      <div id="animalsCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#animalsCarousel" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
          <button type="button" data-bs-target="#animalsCarousel" data-bs-slide-to={1} aria-label="Slide 2" />
          <button type="button" data-bs-target="#animalsCarousel" data-bs-slide-to={2} aria-label="Slide 3" />
          <button type="button" data-bs-target="#animalsCarousel" data-bs-slide-to={3} aria-label="Slide 4" />
        </div>
        <div className="carousel-inner rounded">
          <div className="carousel-item active" data-bs-interval={2500}>
            <img src="image/Кролик.jpg" className="d-block w-100" alt="Кролик" />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
              <h5>Кролик</h5>
              <p>Милый и пушистый кролик ищет заботливого хозяина</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval={2500}>
            <img src="image/Ёжик.jpg" className="d-block w-100" alt="Ёжик" />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
              <h5>Ёжик</h5>
              <p>Колючий, но очень дружелюбный ёжик</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval={2500}>
            <img src="image/Змея.jpg" className="d-block w-100" alt="Змея" />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
              <h5>Змея</h5>
              <p>Экзотическая змея для любителей необычных питомцев</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval={2500}>
            <img src="image/Енот.jpg" className="d-block w-100" alt="Енот" />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
              <h5>Енот</h5>
              <p>Любознательный и активный енот-полоскун</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#animalsCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Предыдущий</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#animalsCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Следующий</span>
        </button>
      </div>
    </div>
  </section>
        </div>
    )
}
export default Slider;