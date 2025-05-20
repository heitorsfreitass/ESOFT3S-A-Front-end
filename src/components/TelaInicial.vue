<template>
  <div class="app">
    <!-- Título principal da tela inicial -->
    <h1 class="titulo">FINAL CODE: A Jornada dos</h1>

    <!-- Container com os botões principais -->
    <div class="botoes">
      <!-- Botão que emite o evento 'trocarTela' com o valor 'TelaJogo' -->
      <button @click="$emit('trocarTela', 'TelaJogo')">Jogar</button>

      <!-- Botão que emite o evento 'trocarTela' com o valor 'TelaCustomizar' -->
      <button @click="$emit('trocarTela', 'TelaCustomizar')">Customizar</button>

      <!-- Botão que emite o evento 'trocarTela' com o valor 'TelaCreditos' -->
      <button @click="$emit('trocarTela', 'TelaCreditos')">Créditos</button>
    </div>
  </div>
</template>

<style scoped>
/* Importa a fonte 'Minecraftia' para dar estilo retrô */
@import url('https://fonts.cdnfonts.com/css/minecraftia');

/* Estilo geral do container principal da tela */
.app {
  width: 100vw; /* Ocupa toda a largura da tela */
  height: 100vh; /* Ocupa toda a altura da tela */
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); /* Fundo com gradiente estilizado */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Minecraftia', sans-serif; /* Fonte estilo pixel art */
  color: #00ffff; /* Cor do texto */
  text-shadow: 0 0 8px #00ffff; /* Brilho no texto */
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

/* Estilo do título */
.titulo {
  font-size: 2rem;
  margin-bottom: 30px;
}

/* Estilo dos botões */
.botoes button {
  background-color: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  font-family: 'Minecraftia', sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  margin: 10px;
  cursor: pointer;
  transition: 0.3s; /* Suaviza as mudanças de estilo no hover */
}

/* Efeito quando o mouse passa sobre o botão */
button:hover {
  background-color: #00ffff;
  color: #000;
  box-shadow: 0 0 12px #00ffff; /* Brilho ao redor do botão */
}
</style>
