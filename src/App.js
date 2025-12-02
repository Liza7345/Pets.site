import {Routes, Route} from "react-router-dom";
import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./pages/main";
import About from "./pages/about";
import Register from "./pages/register";
import Search from "./pages/search";
import Profile from "./pages/profile";
import AddAnimal from "./pages/addAnimal";
import AnimalCardPage from "./pages/animal_card";
import Login from "./pages/login";
function App() {
  return (
    <div className="App">
      <Header/>
        <Routes>
        <Route path={'/'} element={<Main/>}/>
        <Route path={'/about'} element={<About/>}/>
        <Route path={'/register'} element={<Register/>}/>
        <Route path={'/search'} element={<Search/>}/>
        <Route path={'/login'} element={<Login />} />
        <Route path={'/profile'} element={<Profile />} />
        <Route path={'/add-animal'} element={<AddAnimal />} />
        <Route path={'/animal/:animalType'} element={<AnimalCardPage />} />
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;