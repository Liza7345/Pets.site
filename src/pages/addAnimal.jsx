import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddAnimal = () => {
    const [formData, setFormData] = useState({
        name: "", phone: "", email: "", kind: "", mark: "",
        description: "", district: "", password: "", 
        password_confirmation: "", confirm: 0, register: 0
    });
    
    const [photos, setPhotos] = useState({ photo1: null, photo2: null, photo3: null });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        
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
                    phone: user.phone.replace(/\D/g, ""),
                    district: user.district || ""
                }));
            }
        })
        .catch(() => {});
    }, []);

    const validateField = (name, value) => {
        if (name === "name") {
            if (!value.trim()) return "Обязательное поле";
            if (!/^[А-Яа-яёЁ\s-]+$/.test(value)) return "Только кириллица, пробелы и дефисы";
        }
        if (name === "phone") {
            if (!value.trim()) return "Обязательное поле";
            if (!/^\+?[0-9]+$/.test(value)) return "Только цифры и знак +";
        }
        if (name === "email") {
            if (!value.trim()) return "Обязательное поле";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Некорректный email";
        }
        if (name === "kind" || name === "district") {
            if (!value.trim()) return "Обязательное поле";
        }
        if (name === "password" && formData.register) {
            if (!value.trim()) return "Обязательное поле";
            if (value.length < 7) return "Минимум 7 символов";
            if (!/(?=.*[a-z])/.test(value)) return "Нужна строчная буква";
            if (!/(?=.*[A-Z])/.test(value)) return "Нужна заглавная буква";
            if (!/(?=.*\d)/.test(value)) return "Нужна цифра";
        }
        if (name === "password_confirmation" && formData.register) {
            if (!value.trim()) return "Обязательное поле";
            if (value !== formData.password) return "Пароли не совпадают";
        }
        if (name === "confirm" && !value) return "Необходимо согласие";
        return "";
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? (checked ? 1 : 0) : value;
        
        setFormData(prev => ({ ...prev, [name]: fieldValue }));
        if (touched[name]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, fieldValue) }));
        }
        setMessage({ type: "", text: "" });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        const fieldValue = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, fieldValue) }));
    };

    const handlePhoto = (e, num) => {
        const file = e.target.files[0];
        setPhotos(prev => ({ ...prev, [`photo${num}`]: file }));
        
        if (num === 1) {
            const error = !file ? "Обязательное фото" : "";
            setErrors(prev => ({ ...prev, photo1: error }));
            setTouched(prev => ({ ...prev, photo1: true }));
        }
    };

    const getInputClassName = (fieldName) => {
        if (!touched[fieldName]) return "form-control";
        return errors[fieldName] ? "form-control is-invalid" : "form-control is-valid";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        
        const allFields = {
            name: true, phone: true, email: true, kind: true, 
            district: true, photo1: true, confirm: true
        };
        if (formData.register) {
            allFields.password = true;
            allFields.password_confirmation = true;
        }
        setTouched(prev => ({ ...prev, ...allFields }));
        
        const newErrors = {};
        const requiredFields = ["name", "phone", "email", "kind", "district", "confirm"];
        requiredFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });
        
        if (!photos.photo1) newErrors.photo1 = "Обязательное фото";
        
        if (formData.register) {
            const passwordError = validateField("password", formData.password);
            const confirmPasswordError = validateField("password_confirmation", formData.password_confirmation);
            if (passwordError) newErrors.password = passwordError;
            if (confirmPasswordError) newErrors.password_confirmation = confirmPasswordError;
        }
        
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setMessage({ type: "error", text: "Заполните все обязательные поля" });
            return;
        }

        setLoading(true);
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
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
                
                <form onSubmit={handleSubmit} noValidate>
                    {["name", "phone", "email", "kind", "district"].map(field => (
                        <div className="mb-3" key={field}>
                            <label className="form-label">
                                {field === "district" ? "Район *" : 
                                 field === "kind" ? "Вид животного *" : 
                                 field === "phone" ? "Телефон *" :
                                 field === "email" ? "Email *" : "Имя *"}
                            </label>
                            <input 
                                type={field === "email" ? "email" : "text"} 
                                className={getInputClassName(field)}
                                name={field} 
                                value={formData[field]} 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                        </div>
                    ))}
                    
                    <div className="mb-3">
                        <label className="form-label">Клеймо</label>
                        <input 
                            type="text" 
                            className="form-control"
                            name="mark" 
                            value={formData.mark} 
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Описание</label>
                        <textarea 
                            className="form-control" 
                            rows="3"
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange}
                        />
                    </div>
                    
                    {[1,2,3].map(num => (
                        <div className="mb-3" key={num}>
                            <label className="form-label">Фото {num} {num === 1 ? "*" : ""}</label>
                            <input 
                                type="file" 
                                className={`form-control ${errors.photo1 && num === 1 ? "is-invalid" : touched.photo1 && photos.photo1 && num === 1 ? "is-valid" : ""}`}
                                accept="image/*" 
                                onChange={(e) => handlePhoto(e, num)}
                                required={num === 1}
                            />
                            {errors.photo1 && num === 1 && <div className="invalid-feedback">{errors.photo1}</div>}
                        </div>
                    ))}
                    
                    <div className="mb-3 form-check">
                        <input 
                            type="checkbox" 
                            className="form-check-input"
                            name="register" 
                            checked={formData.register === 1} 
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Зарегистрировать меня</label>
                    </div>
                    
                    {formData.register === 1 && (
                        <>
                            {["password", "password_confirmation"].map(field => (
                                <div className="mb-3" key={field}>
                                    <label className="form-label">
                                        {field === "password" ? "Пароль *" : "Подтверждение пароля *"}
                                    </label>
                                    <input 
                                        type="password" 
                                        className={getInputClassName(field)}
                                        name={field} 
                                        value={formData[field]} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                    />
                                    {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                                </div>
                            ))}
                        </>
                    )}
                    
                    <div className="mb-3 form-check">
                        <input 
                            type="checkbox" 
                            className={`form-check-input ${errors.confirm ? "is-invalid" : touched.confirm && formData.confirm === 1 ? "is-valid" : ""}`}
                            name="confirm" 
                            checked={formData.confirm === 1} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
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