import React from "react";
import { Link } from "react-router-dom";

const AnimalCard = ({ animal }) => {
    // Данные о животных
    const animalsData = {
        rabbit: {
            name: "Банни",
            type: "Кролик",
            foundDate: "15.05.2023",
            description: "Милый и пушистый кролик был найден в парке 'Сокольники'. Он очень дружелюбный и любит внимание. Идеально подойдет для семьи с детьми.",
            gender: "Самец",
            age: "Примерно 2 года",
            size: "Средний",
            location: "Парк 'Сокольники'",
            image: "/image/Кролик.jpg"
        },
        hedgehog: {
            name: "Ёжик",
            type: "Ёж",
            foundDate: "10.06.2023",
            description: "Колючий, но очень дружелюбный ёжик. Найден в районе Отрадное. Любит яблоки и молоко, хорошо ладит с другими животными.",
            gender: "Самец",
            age: "Примерно 1 год",
            size: "Маленький",
            location: "Район Отрадное",
            image: "/image/Ёжик.jpg"
        },
        snake: {
            name: "Зоя",
            type: "Змея",
            foundDate: "22.04.2023",
            description: "Экзотическая змея для любителей необычных питомцев. Найдена в Битцевском парке. Спокойная и неагрессивная.",
            gender: "Самка",
            age: "Примерно 3 года",
            size: "Средний",
            location: "Битцевский парк",
            image: "/image/Змея.jpg"
        },
        raccoon: {
            name: "Рокки",
            type: "Енот",
            foundDate: "05.07.2023",
            description: "Любознательный и активный енот-полоскун. Найден в районе Кунцево. Очень умный и легко обучается.",
            gender: "Самец",
            age: "Примерно 1.5 года",
            size: "Средний",
            location: "Район Кунцево",
            image: "/image/Енот.jpg"
        }
    };

    // Получаем данные о животном
    const animalData = animalsData[animal] || animalsData.rabbit;

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6">
                    <img src={animalData.image} className="animal-detail-img" alt={animalData.name} style={{width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px'}} />
                </div>
                <div className="col-md-6">
                    <h2>{animalData.name}</h2>
                    <p className="text-muted">{animalData.type} • Найден {animalData.foundDate}</p>
                    <p>{animalData.description}</p>
                    <ul className="list-group mb-4">
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Пол:</span>
                            <span>{animalData.gender}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Возраст:</span>
                            <span>{animalData.age}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Размер:</span>
                            <span>{animalData.size}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Место находки:</span>
                            <span>{animalData.location}</span>
                        </li>
                    </ul>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary">Связаться с нашедшим</button>
                        <Link to="/search" className="btn btn-outline-secondary">Вернуться к поиску</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimalCard;