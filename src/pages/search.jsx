import React from "react";

const Search = () => {
  return (
    <div>
      <main style={{'minHeight':'70vh'}}>
      <div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebPets - Поиск животных</title>
  <link rel="stylesheet" href="css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
  <style dangerouslySetInnerHTML={{__html: "\n        .nav-link {\n            font-weight: 500;\n        }\n        .animal-card {\n            transition: transform 0.3s;\n        }\n        .animal-card:hover {\n            transform: translateY(-5px);\n        }\n    " }} />
  {/* Страница поиска животных */}
  <div className="container py-5">
    <h2 className="text-center mb-4">Поиск животных</h2>
    <div className="row mb-4">
      <div className="col-md-8 mx-auto">
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Введите тип животного, район или другие параметры" />
          <button className="btn btn-primary" type="button">Найти</button>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card animal-card">
          <img src="image/Кролик.jpg" className="card-img-top" alt="Кролик" />
          <div className="card-body">
            <h5 className="card-title">Банни</h5>
            <p className="card-text">Кролик, найден в парке "Сокольники"</p>
            <a href="animal-card.html?animal=rabbit" className="btn btn-primary">Подробнее</a>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card animal-card">
          <img src="image/Ёжик.jpg" className="card-img-top" alt="Ёжик" />
          <div className="card-body">
            <h5 className="card-title">Ёжик</h5>
            <p className="card-text">Ёж, найден в районе Отрадное</p>
            <a href="animal-card.html?animal=hedgehog" className="btn btn-primary">Подробнее</a>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card animal-card">
          <img src="image/Змея.jpg" className="card-img-top" alt="Змея" />
          <div className="card-body">
            <h5 className="card-title">Зоя</h5>
            <p className="card-text">Змея, найдена в Битцевском парке</p>
            <a href="animal-card.html?animal=snake" className="btn btn-primary">Подробнее</a>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card animal-card">
          <img src="image/Енот.jpg" className="card-img-top" alt="Енот" />
          <div className="card-body">
            <h5 className="card-title">Рокки</h5>
            <p className="card-text">Енот, найден в районе Кунцево</p>
            <a href="animal-card.html?animal=raccoon" className="btn btn-primary">Подробнее</a>
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

export default Search;
