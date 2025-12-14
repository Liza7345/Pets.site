import React, { useState } from "react";

const NewsletterSubscription = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState("");

    const validateEmail = (email) => {
        if (!email.trim()) return "Email обязателен";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Некорректный email";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setValidationError("");
        setSuccess(false);
        
        const emailError = validateEmail(email);
        if (emailError) return setValidationError(emailError);

        setLoading(true);
        try {
            const response = await fetch("https://pets.xn--80ahdri7a.site/api/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.status === 200 || response.status === 204) {
                setSuccess(true);
                setEmail("");
            } else if (response.status === 422) {
                const data = await response.json();
                setError(data.error?.message || "Ошибка валидации");
            } else {
                setError(`Ошибка сервера: ${response.status}`);
            }
        } catch {
            setError("Ошибка соединения");
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div className="alert alert-success shadow-sm text-center">
            <i className="bi bi-check-circle-fill fs-4 d-block mb-2"></i>
            <h5>Спасибо за подписку!</h5>
            <p>Вы успешно подписались на новости WebPets.</p>
            <button className="btn btn-outline-success btn-sm" onClick={() => setSuccess(false)}>
                Подписаться снова
            </button>
        </div>
    );

    return (
        <div>
            {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="row g-2 justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                            type="email"
                            className={`form-control ${validationError ? "is-invalid" : email ? "is-valid" : ""}`}
                            placeholder="Ваш email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setValidationError("");
                                setError("");
                            }}
                            disabled={loading}
                            required
                        />
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send me-2"></i>
                                    Подписаться
                                </>
                            )}
                        </button>
                    </div>
                    
                    {validationError && (
                        <div className="invalid-feedback d-block mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {validationError}
                        </div>
                    )}
                    
                    {email && !validationError && !loading && (
                        <div className="valid-feedback d-block mt-1">
                            <i className="bi bi-check-circle me-1"></i>
                            Корректный email
                        </div>
                    )}
                    
                    <div className="form-text mt-2 text-center">
                        <small>Подписываясь, вы соглашаетесь с нашей политикой конфиденциальности</small>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewsletterSubscription;