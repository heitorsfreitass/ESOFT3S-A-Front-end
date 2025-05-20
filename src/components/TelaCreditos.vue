<template>
  <div class="app">
    <h1 class="titulo">Final Code: A Jornada dos Devs</h1>
    <ul class="lista-creditos">
      <li>André Augusto Silva Domingues</li>
      <li>André Perin Geraldo</li>
      <li>Bernardo Fiorese Perly</li>
      <li>Gabriel de Souza Carvalho</li>
      <li>Heitor Henrique Scramim de Freitas</li>
      <li>Marcos Vinicius de Azevedo Batista</li>
    </ul>
    <button @click="$emit('voltar')">Voltar</button>
  </div>
</template>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/minecraftia');

.app {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Minecraftia', sans-serif;
  color: #00ffff;
  text-shadow: 0 0 8px #00ffff;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

.titulo {
  font-size: 2rem;
  margin-bottom: 30px;
}

.lista-creditos {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.lista-creditos li {
  margin: 8px 0;
}

button {
  background-color: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  font-family: 'Minecraftia', sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background-color: #00ffff;
  color: #000;
  box-shadow: 0 0 12px #00ffff;
}
</style>
