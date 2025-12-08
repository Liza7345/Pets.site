import React from "react";
import { useParams, useLocation, Link } from "react-router-dom"; // Добавлен Link
import AnimalCard from "../components/card";

const AnimalCardPage = () => {
    const { animalType } = useParams();
    const location = useLocation();
    
    // Если данные переданы через state (из поиска)
    if (location.state?.animalData) {
        return (
            <div>
                <main style={{'minHeight':'70vh'}}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-md-6">
                                <img 
                                    src={`https://pets.xn--80ahdri7a.site${location.state.animalData.image}`} 
                                    className="animal-detail-img" 
                                    alt={location.state.animalData.kind} 
                                    style={{width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px'}} 
                                />
                            </div>
                            <div className="col-md-6">
                                <h2>{location.state.animalData.kind}</h2>
                                <p>{location.state.animalData.description}</p>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary">Связаться с нашедшим</button>
                                    <Link to="/search" className="btn btn-outline-secondary">Вернуться к поиску</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
    

    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <AnimalCard animal={animalType || 'rabbit'} />
            </main>
        </div>
    );
}

export default AnimalCardPage;