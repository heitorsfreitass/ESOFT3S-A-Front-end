<template>
  <div>
    <!-- Exibe o componente TelaInicial se a tela atual for 'inicio' -->
    <!-- Quando o componente fazer o evento 'trocarTela', chama o método mudarTela -->
    <TelaInicial v-if="telaAtual === 'inicio'" @trocarTela="mudarTela" />

    <!-- Exibe o componente da Tela de Creditos se a tela atual for 'creditos' -->
    <!-- Quando o componente emitir o evento 'voltar', volta para a tela 'inicio' -->
    <TelaCreditos v-if="telaAtual === 'creditos'" @voltar="mudarTela('inicio')" />
  </div>
</template>

<script>
// Importa os componentes que vão ser usados na interface
import TelaInicial from './components/TelaInicial.vue'
import TelaCreditos from './components/TelaCreditos.vue'

export default {
  // Registra os componentes para uso dentro do template
  components: {
    TelaInicial,
    TelaCreditos,
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
      this.telaAtual = novaTela
    }
  }
}
</script>
