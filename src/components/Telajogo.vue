<template>
  <div class="app-screen">
    <!-- Efeitos de fundo -->
    <div class="bg-effects">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <div v-if="mostrarBotaoAudio" class="audio-permission">
      <button v-if="audioElement" class="game-button" @click="pausarOuRetomarMusica" style="margin-left: 1rem;">
        {{ audioElement.paused ? 'Ligar Música' : 'Desligar Música' }}
      </button>
    </div>

    <!-- Tela de seleção de personagem -->
    <div v-if="!jogoIniciado" class="selection-screen">
      <h1 class="game-title">ESCOLHA SEU PERSONAGEM</h1>
      <div class="characters-grid">
        <div v-for="(p, index) in personagens" :key="index" class="character-card"
          :class="{ selected: personagemSelecionado === index }" @click="selecionarPersonagem(index)">
          <div class="character-image-container">
            <img v-if="p.image" :src="p.image" class="character-image" />
            <div v-else class="character-placeholder">
              <span>?</span>
            </div>
          </div>
          <div class="character-name">{{ p.name }}</div>
          <div class="character-selector"></div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="game-button start-button" @click="iniciarJogo" :disabled="personagemSelecionado === null">
          <span>INICIAR JOGO</span>
          <div class="button-glow"></div>
        </button>
        <button class="game-button back-button" @click="$emit('voltar')">
          <span>VOLTAR</span>
        </button>
      </div>
    </div>

    <!--Botao como jogar no canto da tela-->
    <div class="how-to-play-container">
      <button class="game-button how-to-play-button" @click="mostrarComoJogar = true" aria-label="Como Jogar">
        <span>?</span>
      </button>
    </div>

    <!-- Tela do jogo ativo -->
    <div v-if="jogoIniciado" class="game-screen">
      <!-- Header do jogo -->
      <div class="game-header">
        <div class="player-info">
          <div class="player-avatar-container">
            <img :src="personagens[personagemSelecionado].image" class="player-avatar">
            <div class="player-level">1</div>
          </div>
          <div class="player-details">
            <div class="player-name">{{ personagens[personagemSelecionado].name }}</div>
            <div class="health-bar">
              <div class="health-fill" :style="{ width: (vidas / 3) * 100 + '%' }"></div>
              <div class="health-text">{{ vidas }} ❤️</div>
            </div>
          </div>
        </div>

        <div class="game-stats">
          <div class="stat">
            <div class="stat-label">PONTOS</div>
            <div class="stat-value">{{ pontuacao }}</div>
          </div>
          <div class="stat">
            <div class="stat-label">FASE</div>
            <div class="stat-value">{{ faseAtual }}</div>
          </div>
        </div>

        <div class="villain-container" v-if="vilaoAtual">
          <div class="villain-avatar-container">
            <img :src="vilaoAtual.image" class="villain-avatar">
            <div class="villain-level">{{ vilaoAtual.fase }}</div>
          </div>
          <div class="villain-name">{{ vilaoAtual.name }}</div>
        </div>
      </div>

      <!-- Área do jogo -->
      <div class="game-area" ref="areaJogo">
        <div class="falling-words-container">
          <div v-for="(palavra, index) in palavrasAtivas" :key="index" class="falling-word" :style="{
            top: palavra.y + 'px',
            left: palavra.x + 'px',
            color: palavra.cor || getRandomColor(),
            filter: `drop-shadow(0 0 5px ${palavra.cor || getRandomColor()})`
          }">
            {{ palavra.texto }}
          </div>
        </div>
      </div>

      <!-- Controles -->
      <div class="game-controls">
        <div class="input-container">
          <input type="text" v-model="palavraDigitada" @input="verificarPalavra" @keydown.enter="limparInput"
            placeholder="Digite a palavra aqui..." class="game-input" ref="inputPalavra" autofocus />
          <div class="input-border"></div>
        </div>
      </div>
    </div>

    <!-- Popup de Como Jogar-->
    <transition name="popup">
      <div v-if="mostrarComoJogar" class="popup-overlay" @click.self="mostrarComoJogar = false">
        <div class="popup-content">
          <div class="popup-message" style="margin-bottom: 1rem;">
            <strong>Como Jogar</strong>
          </div>
          <div class="how-to-play-text" style="color: #fff; text-align:left;">
            <ul>
              <li>Escolha seu personagem e clique em "Iniciar Jogo".</li>
              <li>As palavras irão cair na tela. Digite-as corretamente para ganhar pontos.</li>
              <li>Cada erro ou palavra perdida tira uma vida.</li>
              <li>Avance de fase ao atingir a pontuação necessária.</li>
              <li>O jogo termina quando suas vidas acabam.</li>
            </ul>
          </div>
          <button class="game-button" style="margin-top:1rem;" @click="mostrarComoJogar = false">Fechar</button>
        </div>
      </div>
    </transition>

    <!-- Popup de mensagem -->
    <transition name="popup">
      <div v-if="mostrarPopup" class="popup-overlay" @click="mostrarPopup = false">
        <div class="popup-content">
          <div class="popup-message">{{ mensagemPopup }}</div>
          <div class="popup-progress"></div>
        </div>
      </div>
    </transition>
  </div>

  <transition name="popup">
    <div v-if="mostrarTransicaoFase" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-message">{{ mensagemTransicaoFase }}</div>
      </div>
    </div>
  </transition>

  <!--Popup de GameOver (melhorado)-->
  <transition name="popup">
    <div v-if="mostrarTelaGameOver" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-message" style="margin-bottom: 1rem;">
          <strong>{{ resultadoFinal.venceu ? 'Parabéns! Você venceu!' : 'Game Over!' }}</strong>
        </div>
        <div style="color: #fff; text-align:left; margin-bottom: 1rem;">
          <ul>
            <li><strong>Pontos totais:</strong> {{ resultadoFinal.pontos }}</li>
            <li><strong>Fase atingida:</strong> {{ resultadoFinal.fase }}</li>
            <li v-if="resultadoFinal.venceu">Você completou todas as fases!</li>
            <li v-else>Que tal tentar de novo para superar sua pontuação?</li>
          </ul>
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="game-button" @click="jogarNovamente">Jogar Novamente</button>
          <button class="game-button" @click="voltarTelaInicial">Tela Inicial</button>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
// Importações

// Professores
import cidaoImg from '@/assets/characters/villains/cidao.jpeg'
import morenoImg from '@/assets/characters/villains/moreno.jpeg'
import ferliniImg from '@/assets/characters/villains/ferlini.jpeg'
import hugoImg from '@/assets/characters/villains/hugo.jpeg'

// Personagens
import perinImg from '@/assets/characters/perin.jpg'
import marcosImg from '@/assets/characters/marcos.jpg'
import andrezImg from '@/assets/characters/andrez.jpg'

// Sons
import fase1Msc from '@/assets/sounds/primeira-fase.mp3'
import fase2Msc from '@/assets/sounds/segunda-fase.mp3'

import gameOver from '@/assets/sounds/gameover.mp3'
import victory from '@/assets/sounds/victory.mp3'

import palavrasPorFase from '@/assets/palavras.json'

// Cores de feedback para acertos e erros
const CORES_FEEDBACK = {
  acerto: '#00ff00',
  erro: '#ff0000'
}

export default {
  emits: ['voltar'],
  data() {
    return {
      personagemSelecionado: null,  // indice do personagem selecionado
      jogoIniciado: false,          // Controla se o jogo esta iniciado
      mostrarComoJogar: false,      // mostra popup de como jogar
      pontuacao: 0,                 // Pontuaçao atual do jogador
      pontuacaoPorFase: [],         // Array para guardar a pontuação de cada fase
      pontuacaoFaseAtual: 0,        // Pontuação da fase atual
      vidas: 3,                     // Numero de vidas restantes
      palavraDigitada: '',          // Palavra digitada pelo jogador
      palavrasAtivas: [],           // Array de palavras ativas na tela
      velocidadeBase: 0.6,          // Velocidade base das palavras (antes 1)
      faseAtual: 1,                 // Fase atual do jogo
      palavrasPorFase,              // dados das palavras por fase
      listaPalavras: [],            // Lista de palavras da fase atual
      intervaloPalavras: null,      // Referencia do intervalo de geração de palavras
      intervaloAnimacao: null,      // referencia da animaçao frame a frame
      areaJogo: {                   // Dimensoes da área de jogo
        width: 800,
        height: 500
      },
      mostrarTransicaoFase: false,
      mensagemTransicaoFase: '',
      // Lista dos personagens disponiveis
      personagens: [
        { name: 'Perin', type: 'dev', image: perinImg },
        { name: 'Marcos', type: 'dev', image: marcosImg },
        { name: 'Andrezão', type: 'dev', image: andrezImg },
        { name: 'Gabe', type: 'dev' },
        { name: 'Dig', type: 'dev' },
        { name: 'Bernardo', type: 'dev' }
      ],
      viloes: [
        { name: 'Cidão, O Abominável (mas nem tanto)', image: cidaoImg, fase: 1, musica: fase1Msc },
        { name: 'Ferlini, O Gostosinho...', image: ferliniImg, fase: 2, musica: fase2Msc },
        { name: 'Moreno, O Pequeno Grande Professor...', image: morenoImg, fase: 3, musica: fase2Msc },
        { name: 'Hugo, O Sr. Bootstrap...', image: hugoImg, fase: 4, musica: fase2Msc },
      ],
      audioElement: null,
      vilaoAtual: null,
      mostrarBotaoAudio: false,
      sounds: {
        gameOver: gameOver,
        victory: victory
      },
      mostrarPopup: false,
      mensagemPopup: '',
      mostrarTelaGameOver: false,
      resultadoFinal: {
        pontos: 0,
        fase: 1,
        venceu: false
      },
    }
  },

  // Hook(funcao) chamado quando o componente e montado
  mounted() {
    this.atualizarDimensoesAreaJogo()
    window.addEventListener('resize', this.atualizarDimensoesAreaJogo)
  },

  // Hook chamado antes do componente ser destruído
  beforeDestroy() {
    this.limparIntervalos()
    window.removeEventListener('resize', this.atualizarDimensoesAreaJogo)
  },

  methods: {
    /**
     * Seleciona um personagem
     * @param {number} index - indice do personagem selecionado
     */
    selecionarPersonagem(index) {
      this.personagemSelecionado = index
    },
    mostrarPopupTemporario(msg) {
      this.mensagemPopup = msg;
      this.mostrarPopup = true;
      setTimeout(() => {
        this.mostrarPopup = false;
      }, 2000); // 2 segundos
    },

    /**
     * Inicia o jogo, resetando todos os estados
     */
    iniciarJogo() {
      if (this.personagemSelecionado === null) return

      this.pararMusica();

      this.jogoIniciado = true
      this.pontuacao = 0
      this.vidas = 3
      this.faseAtual = 1

      // >>> ALTERAÇÃO AQUI: também resetamos para a velocidade base mais lenta
      this.velocidadeBase = 0.6

      this.palavraDigitada = ''
      this.palavrasAtivas = []
      this.pontuacaoPorFase = []
      this.pontuacaoFaseAtual = 0

      this.$nextTick(() => {
        this.atualizarDimensoesAreaJogo()
        this.carregarFase(this.faseAtual)
        this.iniciarAnimacaoPalavras()
        if (this.$refs.inputPalavra) this.$refs.inputPalavra.focus()
      })
    },
    //limpa input ao apertar enter
    limparInput() {
    this.palavraDigitada = '';
  },

    /**
     * Atualiza as dimensoes da area de jogo
     */
    atualizarDimensoesAreaJogo() {
      if (this.$refs.areaJogo) {
        this.areaJogo.width = this.$refs.areaJogo.offsetWidth
        this.areaJogo.height = this.$refs.areaJogo.offsetHeight
      }
    },

    /**
     * Carrega as palavras para a fase especificada
     * @param {number} fase - Numero da fase a ser carregada
     */
    carregarFase(fase) {
      // Acha o vilão/professor da fase atual
      this.vilaoAtual = this.viloes.find(v => v.fase === fase) || null;

      // Da play na musica da fase
      if (this.vilaoAtual && this.vilaoAtual.musica) {
        this.iniciarMusica(this.vilaoAtual.musica);
      }

      const palavras = this.palavrasPorFase['fase' + fase]
      this.listaPalavras = palavras ? [...palavras] : []
    },

    /**
     * Inicia a animaçao das palavras caindo
     */
    iniciarAnimacaoPalavras() {
      this.limparIntervalos()

      // Configura intervalo para adicionar novas palavras
      this.intervaloPalavras = setInterval(() => {
        this.adicionarPalavra()
      }, 2000) // Intervalo entre palavras

      this.intervaloAnimacao = requestAnimationFrame(() => this.animarPalavras())
    },

    /**
     * Animação frame a frame das palavras caindo
     */
    animarPalavras() {
      const novasPalavrasAtivas = []
      let perdeuVida = false

      // Atualiza posição de cada palavra
      this.palavrasAtivas.forEach(palavra => {
        palavra.y += palavra.velocidade * this.velocidadeBase

        // Verifica se a palavra ainda está na tela
        if (palavra.y < this.areaJogo.height) {
          novasPalavrasAtivas.push(palavra)
        } else if (!perdeuVida) {
          // Se a palavra saiu da tela, remove uma vida
          perdeuVida = true
          this.vidas--

          // Verifica se o jogador perdeu
          if (this.vidas <= 0) {
            this.fimDeJogo(false)
          }
        }
      })

      this.palavrasAtivas = novasPalavrasAtivas

      // Continua a animação se o jogo está ativo
      if (this.jogoIniciado) {
        this.intervaloAnimacao = requestAnimationFrame(() => this.animarPalavras())
      }
    },

    /**
     * Verifica se a palavra digitada está na lista de palavras ativas
     */
    verificarPalavra() {
      const palavraLower = this.palavraDigitada.toLowerCase();

      // Encontra a primeira palavra que começa com o texto digitado
      const palavraCorrespondente = this.palavrasAtivas.find(p =>
        p.texto.toLowerCase().startsWith(palavraLower)
      );

      if (palavraCorrespondente && palavraCorrespondente.texto.toLowerCase() === palavraLower) {
        // Completa (palavra totalmente digitada)
        palavraCorrespondente.cor = CORES_FEEDBACK.acerto;
        setTimeout(() => {
          this.palavrasAtivas = this.palavrasAtivas.filter(p => p !== palavraCorrespondente);
        }, 200);

        // Soma pontos por caractere da palavra acertada
        this.pontuacao += palavraCorrespondente.texto.length;
        this.pontuacaoFaseAtual += palavraCorrespondente.texto.length;
        this.palavraDigitada = ''; // Reseta o input depois de acertar

        // diminui o incremento para tornar a velocidade crescente mais suave
        if (this.pontuacao % 25 === 0) {
          this.velocidadeBase += 0.1; // antes era 0.2
          clearInterval(this.intervaloPalavras);
          const novoIntervalo = Math.max(700, 2000 - this.velocidadeBase * 400);
          this.intervaloPalavras = setInterval(() => {
            this.adicionarPalavra()
          }, novoIntervalo);
        }

        // Verifica se acabou a fase (ex: pontos >= 100 ou acabou lista)
        if (this.pontuacaoFaseAtual >= 100) {
          this.pontuacaoPorFase.push(this.pontuacaoFaseAtual);
          this.pontuacaoFaseAtual = 0;

          // Transição de fase para qualquer fase, inclusive a última
          this.limparIntervalos();
          this.palavrasAtivas = [];
          this.mensagemTransicaoFase = `Fase ${this.faseAtual} completa!`;
          this.mostrarTransicaoFase = true;

          setTimeout(() => {
            this.mostrarTransicaoFase = false;
            this.faseAtual++;

            this.carregarFase(this.faseAtual);

            this.$nextTick(() => {
              if (!this.listaPalavras.length) {
                this.fimDeJogo(true);
              } else {
                this.velocidadeBase = 0.6;
                this.iniciarAnimacaoPalavras();
              }
            });
          }, 2000);
        }
      }
    },

    /**
     * Adiciona uma palavra nova na tela
     */
    adicionarPalavra() {
      // Se a lista de palavras acabou, reabastece com as palavras da fase atual
      if (!this.listaPalavras.length) {
        const palavrasOriginais = this.palavrasPorFase['fase' + this.faseAtual];
        if (palavrasOriginais && palavrasOriginais.length) {
          this.listaPalavras = [...palavrasOriginais];
        } else {
          return; // Não há palavras para esta fase
        }
      }

      // Seleciona palavra aleatória da lista
      const indice = Math.floor(Math.random() * this.listaPalavras.length);
      const palavraTexto = this.listaPalavras[indice];

      // Remove a palavra da lista para evitar repetição imediata
      this.listaPalavras.splice(indice, 1);

      // Cria objeto palavra com posição e velocidade
      const palavra = {
        texto: palavraTexto,
        x: Math.random() * (this.areaJogo.width - (palavraTexto.length * 22 + 20)),
        y: 0,
        velocidade: 1 + Math.random() * 0.5,
        cor: '#ffffff'
      };

      this.palavrasAtivas.push(palavra);
    },

    /**
     * Limpa os intervalos e animações para evitar vazamento de memória
     */
    limparIntervalos() {
      if (this.intervaloPalavras) clearInterval(this.intervaloPalavras)
      if (this.intervaloAnimacao) cancelAnimationFrame(this.intervaloAnimacao)
    },

    /**
     * Finaliza o jogo mostrando tela de vitória ou derrota
     * @param {boolean} venceu - true se o jogador venceu
     */
    fimDeJogo(venceu) {
      this.jogoIniciado = false
      this.limparIntervalos()

      this.resultadoFinal.pontos = this.pontuacao
      this.resultadoFinal.fase = this.faseAtual
      this.resultadoFinal.venceu = venceu

      this.mostrarTelaGameOver = true
      this.pararMusica()

      // Toca som de vitória ou derrota
      const audio = new Audio(venceu ? this.sounds.victory : this.sounds.gameOver)
      audio.play()
    },

    iniciarMusica(src) {
      this.pararMusica()
      this.audioElement = new Audio(src)
      this.audioElement.loop = true
      this.audioElement.play()
      this.mostrarBotaoAudio = true
    },

    pararMusica() {
      if (this.audioElement) {
        this.audioElement.pause()
        this.audioElement = null
      }
      this.mostrarBotaoAudio = false
    },

    pausarOuRetomarMusica() {
      if (!this.audioElement) return
      if (this.audioElement.paused) this.audioElement.play()
      else this.audioElement.pause()
    },

    mostrarAjuda() {
      this.mostrarComoJogar = true
    },

    fecharAjuda() {
      this.mostrarComoJogar = false
    },

    jogarNovamente() {
      this.mostrarTelaGameOver = false;
      this.iniciarJogo();
    },

    voltarTelaInicial() {
      this.mostrarTelaGameOver = false;
      this.jogoIniciado = false;
      this.pontuacao = 0;
      this.vidas = 3;
      this.faseAtual = 1;
      this.palavraDigitada = '';
      this.palavrasAtivas = [];
      this.vilaoAtual = null;
      this.personagemSelecionado = null;
      this.limparIntervalos();
      this.pararMusica();
      this.$emit('voltar');
    },
  }
}
</script>



<!-- CSS -->
<style scoped>
/* Container principal */
.app-screen {
  position: relative;
  overflow: hidden;
}

/* Efeitos de fundo */
.bg-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  background: rgba(110, 0, 255, 0.3);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

.particle:nth-child(1) {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.particle:nth-child(3) {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -50px;
  animation-delay: 10s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  50% {
    transform: translate(50px, 50px) rotate(180deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

/* Tela de seleção */
.selection-screen {
  width: 90%;
  max-width: 1000px;
  padding: 2rem;
  background: rgba(10, 4, 26, 0.8);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(110, 0, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  animation: fadeIn 0.5s ease-out;
}

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.character-card {
  background: rgba(20, 10, 40, 0.6);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(110, 0, 255, 0.3);
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(110, 0, 255, 0.3);
  border-color: var(--accent);
}

.character-card.selected {
  background: rgba(110, 0, 255, 0.2);
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
}

.character-card.selected .character-selector {
  opacity: 1;
}

.character-image-container {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.character-name {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  color: var(--light);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.character-selector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid var(--accent);
  border-radius: 15px;
  opacity: 0;
  transition: all 0.3s;
  pointer-events: none;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.start-button {
  position: relative;
  overflow: visible;
  background: linear-gradient(45deg, var(--accent), var(--success));
}

.start-button .button-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, var(--accent), var(--success));
  border-radius: 50px;
  filter: blur(15px);
  opacity: 0.7;
  z-index: -1;
  animation: pulse-glow 2s infinite;
}

.back-button {
  background: linear-gradient(45deg, var(--dark), #333);
}

/* Tela de jogo */
.game-screen {
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  background: rgba(10, 4, 26, 0.8);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 0 30px rgba(110, 0, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.player-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-avatar-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.player-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent);
}

.player-level {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: var(--primary);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid var(--dark);
}

.player-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.player-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--light);
}

.health-bar {
  width: 120px;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.health-fill {
  height: 100%;
  background: linear-gradient(to right, var(--danger), var(--success));
  transition: width 0.3s;
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.6rem;
  color: white;
  text-shadow: 0 0 3px black;
}

.game-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.3rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.villain-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.villain-avatar-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.villain-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--danger);
  box-shadow: 0 0 10px var(--danger);
}

.villain-level {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: var(--danger);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7rem;
  font-weight: bold;
  border: 2px solid var(--dark);
}

.villain-name {
  font-size: 0.7rem;
  color: var(--danger);
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  max-width: 100px;
}

/* Área do jogo */
.game-area {
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.falling-words-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.falling-word {
  position: absolute;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
  user-select: none;
  transition: color 0.3s;
  animation: float-text 1s infinite alternate;
}

@keyframes float-text {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-5px);
  }
}

/* Controles */
.game-controls {
  width: 100%;
  padding: 0.5rem 0;
}

.input-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.game-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50px;
  color: white;
  outline: none;
  position: relative;
  z-index: 1;
}

.input-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, var(--primary), var(--accent));
  border-radius: 50px;
  z-index: 0;
  opacity: 0.7;
  transition: all 0.3s;
}

.input-container:focus-within .input-border {
  opacity: 1;
  transform: scale(1.02);
}

.game-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}


.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: linear-gradient(145deg, var(--darker), var(--dark));
  border-radius: 15px;
  padding: 2rem 3rem;
  text-align: center;
  max-width: 80%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(110, 0, 255, 0.5);
}

.popup-message {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--accent), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.popup-progress {
  height: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.popup-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, var(--accent), var(--secondary));
  animation: progress-bar 3s linear forwards;
}

@keyframes progress-bar {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

/* Transições */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s;
}

.popup-enter,
.popup-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .characters-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .game-button {
    width: 100%;
  }

  .player-info,
  .game-stats,
  .villain-container {
    width: 100%;
    justify-content: center;
  }

  .popup-content {
    padding: 1.5rem;
  }

  .popup-message {
    font-size: 1.2rem;
  }

  .how-to-play-container {
    top: 12px;
    right: 12px;
  }
}

.how-to-play-container {
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 10;
  border-radius: 500px;
  padding: 0.7em 0.5em;
}

.how-to-play-button {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  padding: 0;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;
  overflow: visible;
}

.how-to-play-button::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  background: rgba(110, 0, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(1);
  opacity: 0.7;
  z-index: -1;
  animation: pulse-bolinha 1.5s infinite;
}

.how-to-play-button:hover {
  background: linear-gradient(45deg, var(--accent), var(--primary));
  color: #fff;
}

@keyframes pulse-bolinha {
  70% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}
</style>