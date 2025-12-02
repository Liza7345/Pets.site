import React from "react";

const Register = () => {
  return (
    <div>
      <main style={{'minHeight':'70vh'}}>
<div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebPets - Регистрация</title>
  <link rel="stylesheet" href="css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
  <style dangerouslySetInnerHTML={{__html: "\n        .form-container {\n            max-width: 500px;\n            margin: 0 auto;\n            padding: 30px;\n            border-radius: 10px;\n            box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n        }\n        .nav-link {\n            font-weight: 500;\n        }\n    " }} />

  {/* Страница регистрации */}
  <div className="container py-5">
    <div className="form-container">
      <h2 className="text-center mb-4">Регистрация в личном кабинете</h2>
      <form>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="firstName" className="form-label">Имя</label>
            <input type="text" className="form-control" id="firstName" placeholder="Введите имя" />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="lastName" className="form-label">Фамилия</label>
            <input type="text" className="form-control" id="lastName" placeholder="Введите фамилию" />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="regEmail" className="form-label">Email</label>
          <input type="email" className="form-control" id="regEmail" placeholder="Введите email" />
        </div>
        <div className="mb-3">
          <label htmlFor="regPassword" className="form-label">Пароль</label>
          <input type="password" className="form-control" id="regPassword" placeholder="Введите пароль" />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
          <input type="password" className="form-control" id="confirmPassword" placeholder="Повторите пароль" />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="agreeTerms" />
          <label className="form-check-label" htmlFor="agreeTerms">Я согласен с условиями использования</label>
        </div>
        <div className="d-grid">
          <a href="profile.html" className="btn btn-primary">Зарегистрироваться</a>
        </div>
        <div className="text-center mt-3">
          <a href="login.html">Уже есть аккаунт? Войдите</a>
        </div>
      </form>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}

export default Register;
