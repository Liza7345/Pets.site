import React from "react";
import { Link } from "react-router-dom";

const AddAnimal = () => {
    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <div className="container py-5">
                    <div className="form-container" style={{maxWidth: '500px', margin: '0 auto', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
                        <h2 className="text-center mb-4">Добавление информации о найденном животном</h2>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="animalType" className="form-label">Тип животного</label>
                                <select className="form-select" id="animalType">
                                    <option selected>Выберите тип животного</option>
                                    <option value="dog">Собака</option>
                                    <option value="cat">Кошка</option>
                                    <option value="rabbit">Кролик</option>
                                    <option value="other">Другое</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="animalName" className="form-label">Кличка (если известна)</label>
                                <input type="text" className="form-control" id="animalName" placeholder="Введите кличку животного" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="animalDescription" className="form-label">Описание</label>
                                <textarea className="form-control" id="animalDescription" rows="3" placeholder="Опишите животное, его особенности"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="foundLocation" className="form-label">Место, где было найдено животное</label>
                                <input type="text" className="form-control" id="foundLocation" placeholder="Введите адрес или район" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="foundDate" className="form-label">Дата находки</label>
                                <input type="date" className="form-control" id="foundDate" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="animalPhoto" className="form-label">Фотография животного</label>
                                <input className="form-control" type="file" id="animalPhoto" />
                            </div>
                            <div className="d-grid">
                                <Link to="/profile" className="btn btn-primary">Добавить животное</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AddAnimal;