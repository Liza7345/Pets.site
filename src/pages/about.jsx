import React from "react";

const About = () => {
  return (
    <div>
      <main style={{'minHeight':'70vh'}}>
<div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebPets - О нас</title>
  <link rel="stylesheet" href="css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
  <style dangerouslySetInnerHTML={{__html: "\n        .nav-link {\n            font-weight: 500;\n        }\n    " }} />
  {/* Страница "О нас" */}
  <div className="container py-5">
    <h2 className="text-center mb-5">О нас</h2>
    <div className="row">
      <div className="col-md-6">
        <h3>Наша миссия</h3>
        <p>WebPets - это платформа, созданная для помощи животным и их владельцам. Мы стремимся создать сообщество, где каждый питомец сможет найти заботу и внимание, а владельцы - надежных помощников для ухода за своими любимцами.</p>
        <p>Наша команда состоит из ветеринаров, зоопсихологов и просто любителей животных, которые готовы помочь вам в любых вопросах, связанных с уходом за питомцами.</p>
      </div>
      <div className="col-md-6">
        <h3>Наши ценности</h3>
        <ul>
          <li>Забота о благополучии животных</li>
          <li>Ответственное отношение к питомцам</li>
          <li>Профессионализм и надежность</li>
          <li>Поддержка сообщества любителей животных</li>
        </ul>
      </div>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}

export default About;
