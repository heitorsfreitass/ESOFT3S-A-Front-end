<template>
  <div class="app-screen">
    <!-- Tela de seleção de personagem antes do jogo começar -->
    <div v-if="!jogoIniciado" class="tela-selecao">
      <h2>Escolha seu personagem</h2>

      <!-- Lista de personagens clicáveis -->
      <div class="personagens">
        <div
          v-for="(p, index) in personagens"
          :key="index"
          class="personagem"
          :class="{ selecionado: personagemSelecionado === index }"
          @click="selecionarPersonagem(index)"
        >
          <img v-if="p.image" :src="p.image" class="avatar" />
          <div>{{ p.name }}</div>
        </div>
      </div>

      <!-- Botões de ação -->
      <div class="botoes-acao">
        <button class="game-button" @click="iniciarJogo" :disabled="personagemSelecionado === null">
          Iniciar Jogo
        </button>
        <button class="game-button" @click="$emit('voltar')">Voltar</button>
      </div>
    </div>

    <!-- Tela do jogo ativo -->
    <div v-if="jogoIniciado" class="tela-jogo-ativo">
      <!-- Avatar e nome do personagem -->
      <div class="display-jogador">
        <img :src="personagens[personagemSelecionado].image" class="avatar-jogador">
        {{ personagens[personagemSelecionado].name }}
      </div>

      <!-- Palavras caindo -->
      <div class="area-jogo">
        <div class="palavras-caindo">
          <!-- Renderiza palavras caindo -->
          <div
            v-for="(palavra, index) in palavrasAtivas"
            :key="index"
            class="palavra"
            :style="{ top: palavra.y + 'px', left: palavra.x + '%' }"
          >
            {{ palavra.texto }}
          </div>
        </div>
      </div>

      <!-- Input para digitar -->
      <input
        type="text"
        v-model="palavraDigitada"
        @keyup.enter="verificarPalavra"
        placeholder="Digite a palavra aqui"
        class="input-palavra"
      />

      <!-- Estatísticas do jogo -->
      <div class="estatisticas-jogo">
        <div>Pontuação: {{ pontuacao }}</div>
        <div>Vidas: {{ vidas }}</div>
        <div>Fase: {{ faseAtual }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa imagens dos personagens
import perinImg from '@/assets/characters/perin.jpg'
import marcosImg from '@/assets/characters/marcos.jpg'

// Importa o JSON com palavras por fase
import palavrasPorFase from '@/assets/palavras.json'

export default {
  data() {
    return {
      personagemSelecionado: null, // Índice do personagem escolhido
      jogoIniciado: false, // Se o jogo já começou
      pontuacao: 0, // Pontuação do jogador
      vidas: 3, // Vidas restantes
      palavraDigitada: '', // Palavra digitada pelo jogador
      palavrasAtivas: [], // Palavras caindo na tela
      velocidadeQueda: 100, // Intervalo de atualização da queda
      faseAtual: 1, // Número da fase atual
      palavrasPorFase, // Objeto contendo as palavras por fase
      listaPalavras: [], // Lista de palavras da fase carregada
      intervaloPalavras: null, // Intervalo do setInterval
      venceu: false, // Indicador de vitória da fase
      // Lista de personagens disponíveis
      personagens: [
        { name: 'Perin', type: 'dev', image: perinImg },
        { name: 'Marcos', type: 'dev', image: marcosImg },
        { name: 'Andrezão', type: 'dev' },
        { name: 'Gabe', type: 'dev' },
        { name: 'Dig', type: 'dev' },
        { name: 'Bernardo', type: 'dev' }
      ]
    }
  },

  methods: {
    // Define o personagem escolhido
    selecionarPersonagem(index) {
      this.personagemSelecionado = index
    },

    // Inicia o jogo e reseta variáveis
    iniciarJogo() {
      if (this.personagemSelecionado === null) return

      this.jogoIniciado = true
      this.pontuacao = 0
      this.vidas = 3
      this.faseAtual = 1
      this.venceu = false
      this.palavraDigitada = ''
      this.palavrasAtivas = []

      this.carregarFase(this.faseAtual)
      this.iniciarAnimacaoPalavras()
    },

    // Carrega palavras da fase atual
    carregarFase(fase) {
      const palavras = this.palavrasPorFase['fase' + fase]
      this.listaPalavras = palavras ? [...palavras] : []
    },

    // Inicia a queda das palavras na tela
    iniciarAnimacaoPalavras() {
      this.intervaloPalavras = setInterval(() => {
        if (this.listaPalavras.length === 0) return

        const texto = this.listaPalavras[Math.floor(Math.random() * this.listaPalavras.length)]
        const novaPalavra = {
          texto,
          y: 0,
          x: Math.random() * 90
        }
        this.palavrasAtivas.push(novaPalavra)

        // Atualiza a posição de cada palavra
        this.palavrasAtivas.forEach((p, index) => {
          p.y += 45
          if (p.y > 500) {
            this.vidas--
            this.palavrasAtivas.splice(index, 1)
            if (this.vidas <= 0) {
              clearInterval(this.intervaloPalavras)
              alert('Você perdeu!')
              this.jogoIniciado = false
            }
          }
        })
      }, 500) // MUDA O DELAY Q DEMORA P CAIR AS PALAVRAS
    },

    // Verifica se o jogador digitou uma palavra correta
    verificarPalavra() {
      const index = this.palavrasAtivas.findIndex(p => p.texto.toLowerCase() === this.palavraDigitada.toLowerCase())

      if (index !== -1) {
        this.pontuacao++
        this.palavrasAtivas.splice(index, 1)

        // Ao alcançar 20 pontos, avança a fase
        if (this.pontuacao >= 20) {
          clearInterval(this.intervaloPalavras)
          this.venceu = true
          alert(`Você venceu a fase ${this.faseAtual}!`)

          // Vai para próxima fase se existir
          this.faseAtual++
          if (this.palavrasPorFase['fase' + this.faseAtual]) {
            this.carregarFase(this.faseAtual)
            this.pontuacao = 0
            this.vidas = 3
            this.palavrasAtivas = []
            this.palavraDigitada = ''
            this.iniciarAnimacaoPalavras()
          } else {
            alert('Parabéns! Você completou todas as fases.')
            this.jogoIniciado = false
          }
        }
      }

      this.palavraDigitada = ''
    }
  }
}
</script>

<style scoped>
/* Palavras caindo */
.palavra {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 8px #00ffff;
}

/* Campo de input para digitar palavras */
.input-palavra {
  display: block;
  margin: 20px auto;
  font-size: 1.2rem;
  padding: 10px;
  border: 2px solid #00ffff;
  background: #000;
  color: #00ffff;
  border-radius: 8px;
  text-align: center;
}

/* Estilo dos personagens na seleção */
.personagens {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.personagem {
  cursor: pointer;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 10px;
  text-align: center;
  transition: border 0.2s ease;
}

.personagem img.avatar {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
}

.personagem.selecionado {
  border-color: #00ffff;
}

.display-jogador {
  text-align: center;
  margin: 10px;
}

.display-jogador img.avatar-jogador {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
