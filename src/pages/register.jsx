import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    confirm: 0,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Валидация полей
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Имя обязательно для заполнения";
        } else if (!/^[А-Яа-яёЁ\s-]+$/.test(value)) {
          error = "Имя может содержать только кириллицу, пробелы и дефисы";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Телефон обязателен для заполнения";
        } else if (!/^\+?[0-9]+$/.test(value.replace(/\s/g, ""))) {
          error = "Телефон может содержать только цифры и знак +";
        } else if (value.replace(/\s/g, "").length < 10) {
          error = "Телефон должен содержать минимум 10 цифр";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email обязателен для заполнения";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Введите корректный email адрес";
        }
        break;

      case "password":
        if (!value) {
          error = "Пароль обязателен для заполнения";
        } else if (value.length < 7) {
          error = "Пароль должен содержать минимум 7 символов";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Пароль должен содержать хотя бы одну строчную букву";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Пароль должен содержать хотя бы одну заглавную букву";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Пароль должен содержать хотя бы одну цифру";
        }
        break;

      case "password_confirmation":
        if (!value) {
          error = "Подтверждение пароля обязательно";
        } else if (value !== formData.password) {
          error = "Пароли не совпадают";
        }
        break;

      case "confirm":
        if (!value) {
          error = "Необходимо согласие на обработку персональных данных";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Валидация всей формы
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? (checked ? 1 : 0) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Отмечаем поле как "тронутое" для отображения валидации
    if (!touched[name]) {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }

    setServerError("");
    setSuccessMessage("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (!touched[name]) {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    }

    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      email: true,
      password: true,
      password_confirmation: true,
      confirm: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://pets.xn--80ahdri7a.site/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 204) {
        setSuccessMessage("Регистрация успешно завершена! Теперь вы можете войти в систему.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          password: "",
          password_confirmation: "",
          confirm: 0,
        });
        setTouched({});
      } else if (response.status === 422) {
        const errorData = await response.json();
        if (errorData.error && errorData.error.errors) {
          setErrors(errorData.error.errors);
        } else {
          setServerError("Ошибка валидации данных");
        }
      } else {
        setServerError(`Ошибка сервера: ${response.status}`);
      }
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
      setServerError("Не удалось подключиться к серверу. Проверьте подключение к интернету.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция для отображения состояния валидации Bootstrap
  const getInputClassName = (fieldName) => {
    if (!touched[fieldName]) {
      return "form-control";
    }
    
    if (errors[fieldName]) {
      return "form-control is-invalid";
    }
    
    return "form-control is-valid";
  };

  return (
    <div>
      <main style={{ minHeight: "70vh" }}>
        <div className="container py-5">
          <div
            className="form-container"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 className="text-center mb-4">Регистрация в личном кабинете</h2>

            {/* Сообщение об успехе */}
            {successMessage && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessMessage("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Ошибка сервера */}
            {serverError && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {serverError}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setServerError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Имя *
                  </label>
                  <input
                    type="text"
                    className={getInputClassName("name")}
                    id="name"
                    name="name"
                    placeholder="Введите имя"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.name && errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                  {touched.name && !errors.name && (
                    <div className="valid-feedback">Корректное имя</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    className={getInputClassName("phone")}
                    id="phone"
                    name="phone"
                    placeholder="+79001234567"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched.phone && errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                  {touched.phone && !errors.phone && (
                    <div className="valid-feedback">Корректный телефон</div>
                  )}
                  <small className="form-text text-muted">
                    Только цифры и знак +
                  </small>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  className={getInputClassName("email")}
                  id="email"
                  name="email"
                  placeholder="Введите email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.email && errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
                {touched.email && !errors.email && (
                  <div className="valid-feedback">Корректный email</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль *
                </label>
                <input
                  type="password"
                  className={getInputClassName("password")}
                  id="password"
                  name="password"
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.password && errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
                {touched.password && !errors.password && (
                  <div className="valid-feedback">Надежный пароль</div>
                )}
                <small className="form-text text-muted">
                  Минимум 7 символов, 1 цифра, 1 строчная и 1 заглавная буква
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">
                  Подтверждение пароля *
                </label>
                <input
                  type="password"
                  className={getInputClassName("password_confirmation")}
                  id="password_confirmation"
                  name="password_confirmation"
                  placeholder="Повторите пароль"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {touched.password_confirmation && errors.password_confirmation && (
                  <div className="invalid-feedback">{errors.password_confirmation}</div>
                )}
                {touched.password_confirmation && !errors.password_confirmation && (
                  <div className="valid-feedback">Пароли совпадают</div>
                )}
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className={`form-check-input ${touched.confirm && errors.confirm ? "is-invalid" : ""} ${
                      touched.confirm && !errors.confirm ? "is-valid" : ""
                    }`}
                    type="checkbox"
                    id="confirm"
                    name="confirm"
                    checked={formData.confirm === 1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <label className="form-check-label" htmlFor="confirm">
                    Я согласен на обработку персональных данных *
                  </label>
                  {touched.confirm && errors.confirm && (
                    <div className="invalid-feedback d-block">
                      {errors.confirm}
                    </div>
                  )}
                  {touched.confirm && !errors.confirm && (
                    <div className="valid-feedback d-block">
                      Согласие получено
                    </div>
                  )}
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Регистрация...
                    </>
                  ) : (
                    "Зарегистрироваться"
                  )}
                </button>
              </div>

              <div className="text-center mt-3">
                <Link to="/login">Уже есть аккаунт? Войдите</Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;