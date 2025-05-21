<template>
  <div class="app-screen"  style="flex-direction: column !important;">
    <!-- Título principal da tela inicial -->
    <h1 class="game-title">FINAL CODE: A Jornada dos Devs</h1>

    <!-- Container com os botões principais -->
    <div class="game-content"  style="flex-direction: row !important;">
      <!-- Botão que emite o evento 'trocarTela' com o valor 'jogo' do componente 'TelaJogo' -->
      <button class="game-button" @click="$emit('trocarTela', 'jogo')">Jogar</button>

      <!-- Botão que emite o evento 'trocarTela' com o valor 'customizar' do componente 'TelaCustomizar' -->
      <button class="game-button" @click="$emit('trocarTela', 'customizar')">Customizar</button>

      <!-- Botão que emite o evento 'trocarTela' com o valor 'creditos' do componente 'TelaCreditos' -->
      <button class="game-button" @click="$emit('trocarTela', 'creditos')">Créditos</button>
    </div>
  </div>
</template>

<style scoped>

</style>
