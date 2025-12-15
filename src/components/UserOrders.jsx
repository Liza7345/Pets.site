// scr/components/UserOrders.jsx - компактная версия
import React, { useState, useEffect } from "react";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editForm, setEditForm] = useState({ description: "", mark: "", photos: [null, null, null] });
    const [imagePreviews, setImagePreviews] = useState([null, null, null]);

    const fetchOrders = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch("https://pets.xn--80ahdri7a.site/api/users/orders", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok && res.status !== 204) {
                const data = await res.json();
                setOrders(data.data?.orders || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleEdit = (order) => {
        if (!["active", "onModeration"].includes(order.status)) {
            alert("Редактирование недоступно для текущего статуса");
            return;
        }
        setEditingOrder(order.id);
        setEditForm({ 
            description: order.description || "", 
            mark: order.mark || "", 
            photos: [null, null, null] 
        });
        
        const previews = [];
        if (Array.isArray(order.photos)) {
            order.photos.slice(0, 3).forEach(photo => previews.push(getImageUrl(photo)));
        } else if (order.photos) {
            previews[0] = getImageUrl(order.photos);
        }
        setImagePreviews(previews);
    };

    const handleEditSubmit = async (id) => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        
        const formData = new FormData();
        formData.append("description", editForm.description);
        formData.append("mark", editForm.mark);
        editForm.photos.forEach((photo, i) => photo && formData.append(`photo${i+1}`, photo));

        try {
            const res = await fetch(`https://pets.xn--80ahdri7a.site/api/pets/${id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });
            
            if (res.ok) {
                setEditingOrder(null);
                fetchOrders();
                alert("Объявление обновлено");
            } else if (res.status === 403) {
                alert("Нельзя редактировать с текущим статусом");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Удалить объявление?")) return;
        const token = localStorage.getItem("auth_token");
        try {
            const res = await fetch(`https://pets.xn--80ahdri7a.site/api/users/orders/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setOrders(orders.filter(o => o.id !== id));
                alert("Удалено");
            } else if (res.status === 403) {
                alert("Нельзя удалить с текущим статусом");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        const newPhotos = [...editForm.photos];
        newPhotos[index] = file;
        setEditForm({ ...editForm, photos: newPhotos });
        
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...imagePreviews];
            newPreviews[index] = reader.result;
            setImagePreviews(newPreviews);
        };
        reader.readAsDataURL(file);
    };

    const getImageUrl = (photo) => {
        if (!photo) return "https://via.placeholder.com/150x150?text=Нет+фото";
        return photo.startsWith("http") ? photo : `https://pets.xn--80ahdri7a.site${photo}`;
    };

    const statusBadge = (status) => {
        const colors = { active: "success", wasFound: "info", onModeration: "warning", archive: "secondary" };
        const labels = { active: "Активное", wasFound: "Найдено", onModeration: "На модерации", archive: "В архиве" };
        return <span className={`badge bg-${colors[status] || 'secondary'}`}>{labels[status] || status}</span>;
    };

    if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

    return (
        <div className="card">
            <div className="card-header"><h4 className="mb-0">Мои объявления</h4></div>
            <div className="card-body">
                {orders.length === 0 ? (
                    <div className="alert alert-info">Нет объявлений</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr><th>Фото</th><th>Вид</th><th>Описание</th><th>Статус</th><th>Действия</th></tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <img src={getImageUrl(order.photos)} alt={order.kind} 
                                                 style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                                        </td>
                                        <td>{order.kind}</td>
                                        <td style={{ minWidth: '200px' }}>
                                            {editingOrder === order.id ? (
                                                <textarea className="form-control form-control-sm" rows="3"
                                                          value={editForm.description}
                                                          onChange={e => setEditForm({...editForm, description: e.target.value})} />
                                            ) : (order.description || <span className="text-muted">Нет описания</span>)}
                                        </td>
                                        <td>{statusBadge(order.status)}</td>
                                        <td style={{ minWidth: '150px' }}>
                                            {editingOrder === order.id ? (
                                                <div>
                                                    <div className="mb-2">
                                                        <label className="form-label small">Фотографии:</label>
                                                        <div className="d-flex gap-1">
                                                            {[0,1,2].map(i => (
                                                                <div key={i} className="position-relative">
                                                                    <img src={imagePreviews[i] || "https://via.placeholder.com/50x50"}
                                                                         className="img-thumbnail" style={{width: '50px', height: '50px'}} />
                                                                    <input type="file" accept="image/*" className="form-control form-control-sm"
                                                                           onChange={(e) => handleFileChange(e, i)} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <input type="text" className="form-control form-control-sm"
                                                               placeholder="Клеймо" value={editForm.mark}
                                                               onChange={e => setEditForm({...editForm, mark: e.target.value})} />
                                                    </div>
                                                    <div className="btn-group btn-group-sm w-100">
                                                        <button className="btn btn-success" onClick={() => handleEditSubmit(order.id)}>
                                                            Сохранить
                                                        </button>
                                                        <button className="btn btn-secondary" onClick={() => setEditingOrder(null)}>
                                                            Отмена
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="btn-group btn-group-sm">
                                                    {["active", "onModeration"].includes(order.status) ? (
                                                        <>
                                                            <button className="btn btn-outline-primary" onClick={() => handleEdit(order)}>
                                                                Редактировать
                                                            </button>
                                                            <button className="btn btn-outline-danger" onClick={() => handleDelete(order.id)}>
                                                                Удалить
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted small">Только просмотр</span>
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