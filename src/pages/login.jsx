import React from "react";

const Login = () => {
  return (
    <div>
      <main style={{'minHeight':'70vh'}}>
<div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebPets - Вход</title>
  <link rel="stylesheet" href="css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
  <style dangerouslySetInnerHTML={{__html: "\n        .form-container {\n            max-width: 500px;\n            margin: 0 auto;\n            padding: 30px;\n            border-radius: 10px;\n            box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n        }\n        .nav-link {\n            font-weight: 500;\n        }\n    " }} />

  {/* Страница входа */}
  <div className="container py-5">
    <div className="form-container">
      <h2 className="text-center mb-4">Вход в личный кабинет</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">Email или логин</label>
          <input type="text" className="form-control" id="loginEmail" placeholder="Введите email или логин" />
        </div>
        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">Пароль</label>
          <input type="password" className="form-control" id="loginPassword" placeholder="Введите пароль" />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="rememberCheck" />
          <label className="form-check-label" htmlFor="rememberCheck">Запомнить меня</label>
        </div>
        <div className="d-grid">
          <a href="profile.html" className="btn btn-primary">Войти</a>
        </div>
        <div className="text-center mt-3">
          <a href="register.html">Нет аккаунта? Зарегистрируйтесь</a>
        </div>
      </form>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}

export default Login;
