// scr/components/UserOrders.jsx
import React, { useState, useEffect } from "react";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingOrder, setEditingOrder] = useState(null);
    const [editForm, setEditForm] = useState({
        description: "",
        mark: "",
        photo1: null,
        photo2: null,
        photo3: null
    });

    const statusColors = {
        active: "success",
        wasFound: "info",
        onModeration: "warning",
        archive: "secondary"
    };

    const statusLabels = {
        active: "Активное",
        wasFound: "Хозяин найден",
        onModeration: "На модерации",
        archive: "В архиве"
    };

    const fetchOrders = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch("https://pets.xn--80ahdri7a.site/api/users/orders", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 204) {
                setOrders([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }

            const data = await response.json();
            if (data.data?.orders) {
                setOrders(data.data.orders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            setError("Ошибка загрузки объявлений");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить это объявление?")) return;

        const token = localStorage.getItem("auth_token");
        try {
            const response = await fetch(`https://pets.xn--80ahdri7a.site/api/users/orders/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                setOrders(orders.filter(order => order.id !== id));
            } else if (response.status === 403) {
                alert("Нельзя удалить объявление с текущим статусом");
            } else {
                const data = await response.json();
                alert(data.error?.message || "Ошибка удаления");
            }
        } catch (err) {
            console.error("Ошибка:", err);
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order.id);
        setEditForm({
            description: order.description || "",
            mark: order.mark || "",
            photo1: null,
            photo2: null,
            photo3: null
        });
    };

    const handleEditSubmit = async (id) => {
        const token = localStorage.getItem("auth_token");
        const formData = new FormData();
        
        formData.append("description", editForm.description);
        formData.append("mark", editForm.mark);
        if (editForm.photo1) formData.append("photo1", editForm.photo1);
        if (editForm.photo2) formData.append("photo2", editForm.photo2);
        if (editForm.photo3) formData.append("photo3", editForm.photo3);

        try {
            const response = await fetch(`https://pets.xn--80ahdri7a.site/api/pets/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setEditingOrder(null);
                fetchOrders(); // Обновляем список
            } else if (response.status === 403) {
                alert("Нельзя редактировать объявление с текущим статусом");
            } else {
                const data = await response.json();
                alert(data.error?.message || "Ошибка редактирования");
            }
        } catch (err) {
            console.error("Ошибка:", err);
        }
    };

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/150x150?text=Нет+фото";
        if (photo.startsWith("http")) return photo;
        return `https://pets.xn--80ahdri7a.site${photo}`;
    };

    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="mb-0">Мои объявления</h4>
            </div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
                {orders.length === 0 ? (
                    <div className="alert alert-info">
                        У вас пока нет добавленных объявлений
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>Вид</th>
                                    <th>Описание</th>
                                    <th>Район</th>
                                    <th>Дата</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <img 
                                                src={getImageUrl(order.photos)} 
                                                alt={order.kind} 
                                                style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                            />
                                        </td>
                                        <td>{order.kind}</td>
                                        <td>
                                            {editingOrder === order.id ? (
                                                <textarea 
                                                    className="form-control form-control-sm"
                                                    value={editForm.description}
                                                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                                                    rows="3"
                                                />
                                            ) : (
                                                <div style={{maxWidth: '200px'}}>
                                                    {order.description || "Нет описания"}
                                                </div>
                                            )}
                                        </td>
                                        <td>{order.district}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
                                                {statusLabels[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {editingOrder === order.id ? (
                                                <div className="btn-group btn-group-sm">
                                                    <button 
                                                        className="btn btn-success"
                                                        onClick={() => handleEditSubmit(order.id)}
                                                    >
                                                        Сохранить
                                                    </button>
                                                    <button 
                                                        className="btn btn-secondary"
                                                        onClick={() => setEditingOrder(null)}
                                                    >
                                                        Отмена
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="btn-group btn-group-sm">
                                                    {["active", "onModeration"].includes(order.status) && (
                                                        <>
                                                            <button 
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEdit(order)}
                                                            >
                                                                Редактировать
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDelete(order.id)}
                                                            >
                                                                Удалить
                                                            </button>
                                                        </>
                                                    )}
                                                    {!["active", "onModeration"].includes(order.status) && (
                                                        <span className="text-muted small">
                                                            Редактирование недоступно
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;