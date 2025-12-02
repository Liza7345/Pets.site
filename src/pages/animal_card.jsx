import React from "react";
import { useParams } from "react-router-dom";
import AnimalCard from "../components/AnimalCard";

const AnimalCardPage = () => {
    // Получаем параметр animal из URL
    const { animalType } = useParams();
    
    return (
        <div>
            <main style={{'minHeight':'70vh'}}>
                <AnimalCard animal={animalType || 'rabbit'} />
            </main>
        </div>
    );
}

export default AnimalCardPage;