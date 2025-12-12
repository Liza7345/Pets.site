import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddAnimal = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        kind: "",
        mark: "",
        description: "",
        district: "",
        password: "",
        password_confirmation: "",
        confirm: 0,
        register: 0
    });
    
    const [photos, setPhotos] = useState({ photo1: null, photo2: null, photo3: null });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            fetch("https://pets.xn--80ahdri7a.site/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                const user = data.data?.user?.[0] || data.data || data;
                if (user.name && user.email && user.phone) {
                    setFormData(prev => ({
                        ...prev,
                        name: user.name,
                        email: user.email,
                        phone: user.phone.replace(/\D/g, "")
                    }));
                }
            })
            .catch(() => {});
        }
    }, []);

    const validateField = (name, value) => {
        switch (name) {
            case "name": return !/^[А-Яа-яёЁ\s-]+$/.test(value) ? "Только кириллица, пробелы и дефисы" : "";
            case "phone": return !/^\+?[0-9]+$/.test(value) ? "Только цифры и знак +" : "";
            case "email": return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Некорректный email" : "";
            case "kind": return !value.trim() ? "Обязательное поле" : "";
            case "password": 
                if (!/(?=.*[a-z])/.test(value)) return "Нужна строчная буква";
                if (!/(?=.*[A-Z])/.test(value)) return "Нужна заглавная буква";
                if (!/(?=.*\d)/.test(value)) return "Нужна цифра";
                return value.length < 7 ? "Минимум 7 символов" : "";
            case "password_confirmation": 
                return value !== formData.password ? "Пароли не совпадают" : "";
            case "confirm": return !value ? "Необходимо согласие" : "";
            default: return "";
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handlePhoto = (e, num) => {
        setPhotos(prev => ({ ...prev, [`photo${num}`]: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (["name", "phone", "email", "kind"].includes(key) || 
                (formData.register && ["password", "password_confirmation"].includes(key)) ||
                key === "confirm") {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        
        if (!photos.photo1) newErrors.photo1 = "Обязательное фото";
        if (Object.keys(newErrors).length) return setErrors(newErrors);

        setLoading(true);
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (formData[key] || key === "confirm") {
                formDataToSend.append(key, formData[key]);
            }
        });
        
        Object.keys(photos).forEach(key => {
            if (photos[key]) formDataToSend.append(key, photos[key]);
        });

        try {
            const res = await fetch("https://pets.xn--80ahdri7a.site/api/pets", {
                method: "POST",
                body: formDataToSend
            });
            
            const data = await res.json();
            
            if (res.status === 200) {
                setMessage({ type: "success", text: "Объявление успешно добавлено!" });
                setTimeout(() => navigate("/profile"), 1500);
            } else if (res.status === 422) {
                setErrors(data.error?.errors || {});
                setMessage({ type: "error", text: "Ошибка валидации" });
            } else {
                throw new Error(data.error?.message || "Ошибка сервера");
            }
        } catch (err) {
            setMessage({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="form-container mx-auto" style={{ maxWidth: '500px' }}>
                <h2 className="text-center mb-4">Добавить найденное животное</h2>
                
                {message.text && (
                    <div className={`alert alert-${message.type === "success" ? "success" : "danger"}`}>
                        {message.text}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Имя *</label>
                        <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`}
                               name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Телефон *</label>
                        <input type="tel" className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                               name="phone" value={formData.phone} onChange={handleChange} />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Email *</label>
                        <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`}
                               name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Вид животного *</label>
                        <input type="text" className={`form-control ${errors.kind ? "is-invalid" : ""}`}
                               name="kind" value={formData.kind} onChange={handleChange} />
                        {errors.kind && <div className="invalid-feedback">{errors.kind}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Район</label>
                        <input type="text" className="form-control"
                               name="district" value={formData.district} onChange={handleChange} />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Клеймо</label>
                        <input type="text" className="form-control"
                               name="mark" value={formData.mark} onChange={handleChange} />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Описание</label>
                        <textarea className="form-control" rows="3"
                                  name="description" value={formData.description} onChange={handleChange} />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Фото 1 *</label>
                        <input type="file" className={`form-control ${errors.photo1 ? "is-invalid" : ""}`}
                               accept="image/*" onChange={(e) => handlePhoto(e, 1)} />
                        {errors.photo1 && <div className="invalid-feedback">{errors.photo1}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Фото 2</label>
                        <input type="file" className="form-control"
                               accept="image/*" onChange={(e) => handlePhoto(e, 2)} />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Фото 3</label>
                        <input type="file" className="form-control"
                               accept="image/*" onChange={(e) => handlePhoto(e, 3)} />
                    </div>
                    
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input"
                               name="register" checked={formData.register} onChange={handleChange} />
                        <label className="form-check-label">Зарегистрировать меня</label>
                    </div>
                    
                    {formData.register === 1 && (
                        <>
                            <div className="mb-3">
                                <label className="form-label">Пароль *</label>
                                <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                       name="password" value={formData.password} onChange={handleChange} />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label">Подтверждение пароля *</label>
                                <input type="password" className={`form-control ${errors.password_confirmation ? "is-invalid" : ""}`}
                                       name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />
                                {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                            </div>
                        </>
                    )}
                    
                    <div className="mb-3 form-check">
                        <input type="checkbox" className={`form-check-input ${errors.confirm ? "is-invalid" : ""}`}
                               name="confirm" checked={formData.confirm} onChange={handleChange} />
                        <label className="form-check-label">Согласен на обработку данных *</label>
                        {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Отправка..." : "Добавить объявление"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAnimal;