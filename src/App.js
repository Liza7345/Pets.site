import {Routes, Route} from "react-router-dom";
import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./pages/main";
import About from "./pages/about";
import Register from "./pages/register";
function App() {
  return (
    <div className="App">
      <Header/>
        <Routes>
        <Route path={'/'} element={<Main/>}/>
        <Route path={'/about'} element={<About/>}/>
        <Route path={'/register'} element={<Register/>}/>
        </Routes>
      <Footer/>
    </div>
  );
}

export default App;