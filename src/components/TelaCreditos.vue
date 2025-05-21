<template>
  <div class="app-screen"  style="flex-direction: column !important;">
    <!-- Título da tela dos créditos -->
    <h1 class="game-title">Final Code: A Jornada dos Devs</h1>

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
    <button class="game-button" @click="$emit('voltar')">Voltar</button>
  </div>
</template>

<style scoped>
/* Estilização da lista de créditos */
.lista-creditos {
  list-style: none; /* Remove os marcadores padrão da lista */
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Estilização de cada item da lista */
.lista-creditos li {
  color: #00ffff;
  font-size: 1.2rem;
  margin: 0.8rem 0;
  padding: 0.5rem 1rem;
  opacity: 0; /* começa invisível para animação */
  transform: translateY(20px); /* começa 20px pra baixo para animação */
  animation: fadeInUp 0.5s forwards; /* animação de fade pra cima */
  border-bottom: 1px solid rgba(0, 255, 255, 0.2); /* bordinha embaixo */
  width: 100%;
  text-align: center;
}

@keyframes fadeInUp {
  to { /* estado final da animação */
    opacity: 1; /* visível */
    transform: translateY(0); /* posição final, normal */
  }
}

</style>
