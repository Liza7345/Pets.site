import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import AnimalCard from "../components/card";

const AnimalCardPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const [animal, setAnimal] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                setLoading(true);
                
                if (id) {
                    const response = await fetch(`https://pets.xn--80ahdri7a.site/api/pets/${id}`);
                    if(!response.ok) {
                        console.log(response.status)
                        return
                    }
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        setAnimal(data.data.pet);
                    }
                }
            } catch (error) {
                console.error("Ошибка загрузки:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAnimal();
    }, [id, location.state]);

    return <AnimalCard animal={animal} loading={loading} />;
};

export default AnimalCardPage;