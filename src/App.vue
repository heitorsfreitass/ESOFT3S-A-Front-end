<template>
  <div>
    <!-- Exibe o componente TelaInicial se a tela atual for 'inicio' -->
    <!-- Quando o componente fazer o evento 'trocarTela', chama o método mudarTela -->
    <TelaInicial v-if="telaAtual === 'inicio'" @trocarTela="mudarTela"/>

    <!-- Exibe o componente da Tela de Creditos se a tela atual for 'creditos' -->
    <!-- Quando o componente emitir o evento 'voltar', volta para a tela 'inicio' -->
    <TelaCreditos v-if="telaAtual === 'creditos'" @voltar="mudarTela('inicio')"/>

    <!-- Exibe o componente da Tela de Jogo se a tela atual for 'jogo' -->
    <!-- Quando o componente emitir o evento 'voltar', volta para a tela 'inicio' -->
    <TelaJogo v-if="telaAtual === 'jogo'" @voltar="mudarTela('inicio')"/>

    <!-- SE FOR TER MAIS TELAS, CRIA O COMPONENTE, MAS COLOCA ELE AQUI E NO IMPORT ABAIXO, SE NÃO NÃO FUNFA -->
  </div>
</template>

<script>
// Importa os componentes que vão ser usados na interface
import TelaInicial from './components/TelaInicial.vue'
import TelaCreditos from './components/TelaCreditos.vue'
import TelaJogo from './components/Telajogo.vue'

export default {
  // Registra os componentes para uso dentro do template
  components: {
    TelaInicial,
    TelaCreditos,
    TelaJogo
  },
  data() {
    return {
      // Define qual a tela atual, começando pela tela inicial
      telaAtual: 'inicio',
    }
  },
  methods: {
    // Método para mudar a tela atual
    mudarTela(novaTela) {
      this.telaAtual = novaTela.toLowerCase() // converte para minúscula pra ter consistência
    }
  }
}
</script>
