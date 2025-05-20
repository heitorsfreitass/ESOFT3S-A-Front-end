<template>
  <div class="app">
    <!-- Título da tela dos créditos -->
    <h1 class="titulo">Final Code: A Jornada dos Devs</h1>

    <!-- Lista com os nomes do grupo -->
    <ul class="lista-creditos">
      <li>André Augusto Silva Domingues</li>
      <li>André Perin Geraldo</li>
      <li>Bernardo Fiorese Perly</li>
      <li>Gabriel de Souza Carvalho</li>
      <li>Heitor Henrique Scramim de Freitas</li>
      <li>Marcos Vinicius de Azevedo Batista</li>
    </ul>

    <!-- Botão que faz o evento 'voltar' para retornar à tela anterior -->
    <button @click="$emit('voltar')">Voltar</button>
  </div>
</template>

<style scoped>
/* Importa a fonte com estilo estilo retrô */
@import url('https://fonts.cdnfonts.com/css/minecraftia');

/* css principal da tela de créditos */
.app {
  width: 100vw; /* Largura total da janela */
  height: 100vh; /* Altura total da janela */
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); /* Gradiente escuro de fundo */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Minecraftia', sans-serif; /* Fonte retrô */
  color: #00ffff; /* Cor do texto */
  text-shadow: 0 0 8px #00ffff; /* Efeito de brilho no texto */
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
}

/* Estilização do título */
.titulo {
  font-size: 2rem;
  margin-bottom: 30px;
}

/* Estilização da lista de créditos */
.lista-creditos {
  list-style: none; /* Remove os marcadores padrão da lista */
  padding: 0;
  margin: 20px 0;
}

/* Estilização de cada item da lista */
.lista-creditos li {
  margin: 8px 0; /* Espaçamento entre nomes */
}

/* Estilo do botão 'Voltar' */
button {
  background-color: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  font-family: 'Minecraftia', sans-serif;
  font-size: 1rem;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
  transition: 0.3s; /* Suaviza o hover */
}

/* Efeito quando passar o mouse no botão */
button:hover {
  background-color: #00ffff;
  color: #000;
  box-shadow: 0 0 12px #00ffff; /* Brilho no botão */
}
</style>
