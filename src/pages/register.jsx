import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", password: "",
    password_confirmation: "", confirm: 0
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (name === "name") {
      if (!value.trim()) return "Имя обязательно для заполнения";
      if (!/^[А-Яа-яёЁ\s-]+$/.test(value)) return "Имя может содержать только кириллицу, пробелы и дефисы";
    }
    if (name === "phone") {
      if (!value.trim()) return "Телефон обязателен для заполнения";
      if (!/^\+?[0-9]+$/.test(value.replace(/\s/g, ""))) return "Телефон может содержать только цифры и знак +";
      if (value.replace(/\s/g, "").length < 10) return "Телефон должен содержать минимум 10 цифр";
    }
    if (name === "email") {
      if (!value.trim()) return "Email обязателен для заполнения";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Введите корректный email адрес";
    }
    if (name === "password") {
      if (!value) return "Пароль обязателен для заполнения";
      if (value.length < 7) return "Пароль должен содержать минимум 7 символов";
      if (!/(?=.*[a-z])/.test(value)) return "Пароль должен содержать хотя бы одну строчную букву";
      if (!/(?=.*[A-Z])/.test(value)) return "Пароль должен содержать хотя бы одну заглавную букву";
      if (!/(?=.*\d)/.test(value)) return "Пароль должен содержать хотя бы одну цифру";
    }
    if (name === "password_confirmation") {
      if (!value) return "Подтверждение пароля обязательно";
      if (value !== formData.password) return "Пароли не совпадают";
    }
    if (name === "confirm" && !value) return "Необходимо согласие на обработку персональных данных";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? (checked ? 1 : 0) : value;

    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (!touched[name]) setTouched(prev => ({ ...prev, [name]: true }));

    setServerError("");
    setSuccessMessage("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!touched[name]) setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    if (error) setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true, phone: true, email: true,
      password: true, password_confirmation: true, confirm: true
    });
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch("https://pets.xn--80ahdri7a.site/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 204) {
        setSuccessMessage("Регистрация успешно завершена! Теперь вы можете войти в систему.");
        setFormData({ name: "", phone: "", email: "", password: "", password_confirmation: "", confirm: 0 });
        setTouched({});
      } else if (response.status === 422) {
        const errorData = await response.json();
        if (errorData.error?.errors) {
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

  const getInputClassName = (fieldName) => {
    if (!touched[fieldName]) return "form-control";
    return errors[fieldName] ? "form-control is-invalid" : "form-control is-valid";
  };

  const fields = [
    { id: "name", label: "Имя *", type: "text", placeholder: "Введите имя", col: "col-md-6" },
    { id: "phone", label: "Телефон *", type: "tel", placeholder: "+79001234567", col: "col-md-6", 
      note: "Только цифры и знак +" },
    { id: "email", label: "Email *", type: "email", placeholder: "Введите email", col: "mb-3" },
    { id: "password", label: "Пароль *", type: "password", placeholder: "Введите пароль", col: "mb-3",
      note: "Минимум 7 символов, 1 цифра, 1 строчная и 1 заглавная буква" },
    { id: "password_confirmation", label: "Подтверждение пароля *", type: "password", 
      placeholder: "Повторите пароль", col: "mb-3" }
  ];

  return (
    <main style={{ minHeight: "70vh" }}>
      <div className="container py-5">
        <div className="form-container" style={{ maxWidth: "500px", margin: "0 auto", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <h2 className="text-center mb-4">Регистрация в личном кабинете</h2>

          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage("")} aria-label="Close"></button>
            </div>
          )}

          {serverError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {serverError}
              <button type="button" className="btn-close" onClick={() => setServerError("")} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              {fields.map(({ id, label, type, placeholder, col, note }) => (
                <div className={col} key={id}>
                  <label htmlFor={id} className="form-label">{label}</label>
                  <input
                    type={type}
                    className={getInputClassName(id)}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {touched[id] && errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
                  {touched[id] && !errors[id] && (
                    <div className="valid-feedback">
                      {id === "name" ? "Корректное имя" : 
                       id === "phone" ? "Корректный телефон" : 
                       id === "email" ? "Корректный email" : 
                       id === "password" ? "Надежный пароль" : 
                       "Пароли совпадают"}
                    </div>
                  )}
                  {note && <small className="form-text text-muted">{note}</small>}
                </div>
              ))}
            </div>

            <div className="mb-3">
              <div className="form-check">
                <input
                  className={`form-check-input ${touched.confirm && errors.confirm ? "is-invalid" : ""} ${touched.confirm && !errors.confirm ? "is-valid" : ""}`}
                  type="checkbox"
                  id="confirm"
                  name="confirm"
                  checked={formData.confirm === 1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <label className="form-check-label" htmlFor="confirm">Я согласен на обработку персональных данных *</label>
                {touched.confirm && errors.confirm && <div className="invalid-feedback d-block">{errors.confirm}</div>}
                {touched.confirm && !errors.confirm && <div className="valid-feedback d-block">Согласие получено</div>}
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Регистрация...
                  </>
                ) : "Зарегистрироваться"}
              </button>
            </div>

            <div className="text-center mt-3"><Link to="/login">Уже есть аккаунт? Войдите</Link></div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;