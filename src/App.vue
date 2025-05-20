<template>
  <div>
    <TelaInicial v-if="telaAtual === 'inicio'" @trocarTela="mudarTela" />
    <TelaCreditos v-if="telaAtual === 'creditos'" @voltar="mudarTela('inicio')" />
  </div>
</template>

<script>
import TelaInicial from './components/TelaInicial.vue'
import TelaCreditos from './components/TelaCreditos.vue'

export default {
  components: {
    TelaInicial,
    TelaCreditos,
  },
  data() {
    return {
      telaAtual: 'inicio',
    }
  },
  methods: {
    mudarTela(novaTela) {
      this.telaAtual = novaTela
    }
  }
}
</script>
