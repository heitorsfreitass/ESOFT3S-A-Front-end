<template>
  <!-- Tela principal do componente -->
  <div class="app-screen">
    <div v-if="mostrarBotaoAudio" class="audio-permission">
      <button @click="ativarAudio">Ativar música</button>
    </div>
    <!-- Tela de seleção de personagem -->
    <div v-if="!jogoIniciado" class="tela-selecao">
      <h2>Escolha seu personagem</h2>
      <!-- Container dos personagens selecionaveis -->
      <div class="personagens">
        <!-- Loop para renderizar cada personagem -->
        <div
          v-for="(p, index) in personagens"
          :key="index"
          class="personagem"
          :class="{ selecionado: personagemSelecionado === index }"
          @click="selecionarPersonagem(index)"
        >
          <!-- Imagem do personagem -->
          <img v-if="p.image" :src="p.image" class="avatar" />
          <!-- Nome do personagem -->
          <div class="nome-personagem">{{ p.name }}</div>
        </div>
      </div>

      <!-- area dos botoes de açao -->
      <div class="botoes-acao">
        <!-- Botão para iniciar o jogo  -->
        <button class="game-button" @click="iniciarJogo" :disabled="personagemSelecionado === null">
          Iniciar Jogo
        </button>
        <!-- Botão para voltar  -->
        <button class="game-button" @click="$emit('voltar')">Voltar</button>
      </div>
    </div>

    <!-- Tela do jogo  -->
    <div v-if="jogoIniciado" class="tela-jogo-ativo">
      <!-- Cabeçalho com informaçoes do vilão -->
      <div class="display-vilao" v-if="vilaoAtual">
        <img :src="vilaoAtual.image" class="avatar-vilao">
        <span>{{ vilaoAtual.name }}</span>
      </div>

      <!-- area onde as palavras caem -->
      <div class="area-jogo" ref="areaJogo">
        <!-- Renderizador para as palavras-->
        <div
          v-for="(palavra, index) in palavrasAtivas"
          :key="index"
          class="palavra"
          :style="{
            top: palavra.y + 'px',
            left: palavra.x + 'px',
            color: palavra.cor || '#00ffff'
          }"
        >
          {{ palavra.texto }}
        </div>
      </div>

      <!-- area de controle com entrada para digitar palavras -->
      <div class="controle-jogo text-center"> <!-- Alterado de @keyup.enter para @input -->
        <input
          type="text"
          v-model="palavraDigitada"
          @input="verificarPalavra"
          @keydown.enter="limparInput"
          placeholder="Digite a palavra aqui"
          class="input-palavra"
          ref="inputPalavra"
          autofocus
        />
      </div>
      <!-- Rodapé do jogo com input e informações do jogo-->
      <div class="cabecalho-jogo">
          <div class="display-jogador">
            <!-- Avatar e nome do personagem selecionado -->
            <img :src="personagens[personagemSelecionado].image" class="avatar-jogador">
            <span>Jogando como: {{ personagens[personagemSelecionado].name }}</span>
          </div>
            <!-- Estatisticas do jogo -->
          <div class="estatisticas-jogo">
            <div>Pontuação: {{ pontuacao }}</div>
            <!-- Contador de vidas -->
            <div>Vidas: <span :class="{ 'vida-perdida': vidas < 3 }">{{ vidas }}</span></div>
            <div>Fase: {{ faseAtual }}</div>
          </div>
      </div>
        
    </div>

    <div v-if="mostrarPopup" class="popup-overlay">
      <div class="popup-content">
        {{ mensagemPopup }}
      </div>
    </div>
  </div>
</template>

<script>
// Importaçaes dos nego
import cidaoImg from '@/assets/characters/villains/cidao.jpg'
import perinImg from '@/assets/characters/perin.jpg'
import marcosImg from '@/assets/characters/marcos.jpg'
import andrezImg from '@/assets/characters/andrez.jpg'

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
  data() {
    return {
      personagemSelecionado: null, // indice do personagem selecionado
      jogoIniciado: false,         // Controla se o jogo esta iniciado
      pontuacao: 0,                // Pontuaçao atual do jogador
      vidas: 3,                    // Numero de vidas restantes
      palavraDigitada: '',          // Palavra digitada pelo jogador
      palavrasAtivas: [],           // Array de palavras ativas na tela
      velocidadeBase: 1,           // Velocidade base das palavras
      faseAtual: 1,                // Fase atual do jogo
      palavrasPorFase,              // dados das palavras por fase
      listaPalavras: [],            // Lista de palavras da fase atual
      intervaloPalavras: null,      // Referencia do intervalo de geração de palavras
      intervaloAnimacao: null,      // referencia da animaçao frame a frame
      areaJogo: {                   // Dimensoes da área de jogo
        width: 800,
        height: 500
      },
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
        {name: 'Cidão, O Abominável (mas nem tanto)', image: cidaoImg, fase: 1, musica: fase1Msc},
        {name: 'Ferlini, O Gostosinho...', image: cidaoImg, fase: 2, musica: fase2Msc},
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
      this.velocidadeBase = 1
      this.palavraDigitada = ''
      this.palavrasAtivas = []

      
      this.$nextTick(() => {
        this.atualizarDimensoesAreaJogo()
        this.carregarFase(this.faseAtual)
        this.iniciarAnimacaoPalavras()
        this.$refs.inputPalavra.focus()
      })
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
        if (this.listaPalavras.length === 0) return

        // Seleciona palavra aleatorias da lista
        const texto = this.listaPalavras[Math.floor(Math.random() * this.listaPalavras.length)]
        this.palavrasAtivas.push({
          texto,
          y: 0, // Posição Y inicial (topo)
          x: Math.random() * (this.areaJogo.width - 100), // Posição X aleatoria
          velocidade: 0.5 + Math.random() * 0.5 // velocidade aleatoria
        })
      }, 2000) // Intervalo entre palavras

    
      this.intervaloAnimacao = requestAnimationFrame(this.animarPalavras)
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
        this.intervaloAnimacao = requestAnimationFrame(this.animarPalavras)
      }
    },

    /**
     * Verifica se a palavra digitada está na lista de palavras ativas
     */
    verificarPalavra() { // Ela agora verifica digitação em tempo real, sem precisar apertar 'enter' para enviar
      const palavraLower = this.palavraDigitada.toLowerCase()

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
        
        this.pontuacao++;
        this.palavraDigitada = ''; // Reseta o input depois de acertar
        
        // Aumenta dificuldade a cada 5 acertos
        if (this.pontuacao % 5 === 0) {
          this.velocidadeBase += 0.2;
          clearInterval(this.intervaloPalavras);
          const novoIntervalo = Math.max(500, 2000 - (this.pontuacao * 50));
          this.intervaloPalavras = setInterval(this.adicionarPalavra, novoIntervalo);
        }
        
        // Avança de fase ao atingir pontuação
        if (this.pontuacao >= 20) {
          this.avancarFase();
        }
      } else if (!palavraCorrespondente && this.palavraDigitada) {
        // Erro: feedback visual no input
        this.$refs.inputPalavra.style.borderColor = CORES_FEEDBACK.erro;
        setTimeout(() => {
          if (this.$refs.inputPalavra) {
            this.$refs.inputPalavra.style.borderColor = '#00ffff';
          }
        }, 300);
      }
    },

    /**
     * Adiciona uma nova palavra à lista de palavras ativas
     */
    adicionarPalavra() {
      if (this.listaPalavras.length === 0) return

      const texto = this.listaPalavras[Math.floor(Math.random() * this.listaPalavras.length)]
      this.palavrasAtivas.push({
        texto,
        y: 0,
        x: Math.random() * (this.areaJogo.width - 100),
        velocidade: 0.5 + Math.random() * (0.5 + this.velocidadeBase * 0.3)
      })
    },

    /**
     * Avança para a proxima fase do jogo
     */
    avancarFase() {
      clearInterval(this.intervaloPalavras)
      cancelAnimationFrame(this.intervaloAnimacao)
      
      this.faseAtual++
      
      
      if (this.palavrasPorFase['fase' + this.faseAtual]) {
        setTimeout(() => {
          //alert(`Fase ${this.faseAtual - 1} completada! Iniciando fase ${this.faseAtual}...`)
          this.mostrarPopupTemporario(`Fase ${this.faseAtual - 1} completada! Iniciando fase ${this.faseAtual}...`);
          this.pontuacao = 0
          this.velocidadeBase = 1 + (this.faseAtual * 0.3)
          this.palavrasAtivas = []
          this.carregarFase(this.faseAtual)
          this.iniciarAnimacaoPalavras()
        }, 500)
      } else {
        
        this.fimDeJogo(true)
      }
    },

    /**
     * Finaliza o jogo
     * @param {boolean} vitoria - Indica se o jogador venceu
     */
    fimDeJogo(vitoria) {
      this.limparIntervalos()
      this.pararMusica()

      // se ganhar, som de vitoria, se perder, som de game over
      if (vitoria && this.sounds.victory) {
        this.tocarSom(this.sounds.victory);
      } else if (!vitoria &&  this.sounds.gameOver) {
        this.tocarSom(this.sounds.gameOver);
      }

      this.jogoIniciado = false
      
      setTimeout(() => {
        /*alert(vitoria 
          ? 'Parabéns! Você completou todas as fases!' 
          : 'Game Over! Tente novamente.') */
          this.mostrarPopupTemporario('Game over!')
      }, 1000)
    },

    /**
     * Limpa os intervalos de animação
     */
    limparIntervalos() {
      if (this.intervaloPalavras) clearInterval(this.intervaloPalavras)
      if (this.intervaloAnimacao) cancelAnimationFrame(this.intervaloAnimacao)
    },

    iniciarMusica(musica) {
      // Para a musica atual se tiver
      this.pararMusica();

      try {
        this.audioElement = new Audio(musica);
        this.audioElement.loop = true;
        
        this.audioElement.addEventListener('error', () => {
          console.error("Erro ao carregar áudio");
          this.audioElement = null;
        })

        // Aqui inicia a reprodução
        const playPromise = this.audioElement.play();
    
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Reprodução automática prevenida:", error);
            // Mostra um botão para permitir que o usuário inicie a música
            this.mostrarBotaoAudio = true;
          });
        }
        
      } catch(error) {
        console.error("Erro ao iniciar musica: ", error);
      }
    },

    pararMusica() {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement = null;
      }
    },

    tocarSom(som) {
      try {
        const audio = new Audio(som);
        audio.play().catch(e => console.log("Erro ao reproduzir som: ", e));
      } catch (error) {
        console.error("Erro ao carregar audio: ", error);
      }
    }, 

    ativarAudio() {
      if (this.vilaoAtual && this.vilaoAtual.musica) {
        this.iniciarMusica(this.vilaoAtual.musica);
      }
      this.mostrarBotaoAudio = false;
    },

    mostrarPopupTemporario(mensagem) {
      this.mensagemPopup = mensagem;
      this.mostrarPopup = true;

      setTimeout(() => {
        this.mostrarPopup = false;
        this.mensagemPopup = '';
      }, 3000);
    },

    limparInput(){ //função para limpar o input quando aperta enter
      this.palavraDigitada = '';
    },

  }
}
</script>

<!-- CSS -->
<style scoped>

@import url('https://fonts.cdnfonts.com/css/minecraftia');

/* css base da tela do jogo */
.app-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Minecraftia', sans-serif;
  color: #00ffff;
  text-shadow: 0 0 8px #00ffff;
  padding: 20px;
  box-sizing: border-box;
}

/* Estilo da tela de seleção de personagem */
.tela-selecao {
  background-color: rgba(15, 12, 41, 0.9);
  border: 2px solid #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  padding: 30px;
  border-radius: 0;
  max-width: 800px;
  width: 100%;
}

/* css da tela de jogo ativo */
.tela-jogo-ativo {
  background-color: rgba(15, 12, 41, 0.9);
  border: 2px solid #00ffff;
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* css base dos botoes */
.game-button {
  background-color: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  font-family: 'Minecraftia', sans-serif;
  padding: 12px 25px;
  margin: 0 15px;
  border-radius: 0;
  text-shadow: 0 0 8px #00ffff;
  transition: all 0.2s;
  font-size: 1.2rem;
  cursor: pointer;
}

/* Efeito hover dos botões */
.game-button:hover {
  background-color: #00ffff;
  color: #0f0c29;
  box-shadow: 0 0 12px #00ffff;
  transform: translateY(-2px);
}

/* css do botao desabilitado */
.game-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: transparent;
  color: #00ffff;
  transform: none;
  box-shadow: none;
}

/* grid dos personagens */
.personagens {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 30px 0;
}

/* css de cada personagem */
.personagem {
  border: 2px solid transparent;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* efeito hover do personagem */
.personagem:hover {
  border-color: #00ffff;
}

/* css do personagem selecionado */
.personagem.selecionado {
  border-color: #00ffff;
  background-color: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 15px #00ffff;
}

/* Avatar do personagem */
.avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0;
  border: 2px solid #00ffff;
  margin-bottom: 10px;
}

/* nome do personagem */
.nome-personagem {
  font-size: 0.9rem;
}

/* area onde as palavras caem */
.area-jogo {
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #00ffff;
  border-radius: 0;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  flex-grow: 1;
  position: relative;
  margin: 20px 0;
  overflow: hidden;
}

/* css das palavras que caem */
.palavra {
  font-family: 'Minecraftia', sans-serif;
  font-size: 24px;
  text-shadow: 0 0 5px currentColor;
  position: absolute;
  white-space: nowrap;
}

/* Campo de entrada para digitar palavras */
.input-palavra {
  background-color: rgba(0, 0, 0, 0.5);
  border: 2px solid #00ffff;
  color: #00ffff;
  font-family: 'Minecraftia', sans-serif;
  border-radius: 0;
  text-shadow: 0 0 5px #00ffff;
  padding: 12px 20px;
  font-size: 1.2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  outline: none;
}

/* Placeholder da entrada */
.input-palavra::placeholder {
  color: #00ffff;
  opacity: 0.7;
}

/* mostra do avatar do jogador durante o jogo */
.avatar-jogador {
  width: 60px;
  height: 60px;
  border: 2px solid #00ffff;
  border-radius: 0;
  object-fit: cover;
}

/* perda de vidas */
.vida-perdida {
  color: #ff5555;
  text-shadow: 0 0 8px #ff5555;
}

/* cabeçalho do jogo */
.cabecalho-jogo {
  border-bottom: 2px solid #00ffff;
  padding-bottom: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* estatisticas */
.estatisticas-jogo {
  font-size: 1.1rem;
  display: flex;
  gap: 20px;
}

/* mostra do jogador */
.display-jogador {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Container dos botões de açao */
.botoes-acao {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* area de controle do jogo */
.controle-jogo {
  width: 100%;
  padding: 10px 0;
}

/* Parte do vilão */
.display-vilao {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-vilao {
  width: 60px;
  height: 60px;
  border: 2px solid #ff0000;
  border-radius: 0;
  object-fit: cover;
  box-shadow: 0 0 10px #ff0000;
}

/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.popup-content {
  background: linear-gradient(135deg, #0f0c29, #302b63);
  border: 2px solid #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  padding: 30px 50px;
  border-radius: 0;
  font-size: 1.5rem;
  text-align: center;
  max-width: 80%;
  animation: slideUp 0.3s ease-out;
  text-shadow: 0 0 8px #00ffff;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
}


/* Estilos responsivos para telas menores */
@media (max-width: 768px) {
  .personagens {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .game-button {
    padding: 10px 20px;
    margin: 0 10px;
    font-size: 1rem;
  }
  
  .estatisticas-jogo {
    flex-direction: column;
    gap: 5px;
    font-size: 1rem;
  }
  
  .cabecalho-jogo {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .tela-selecao, .tela-jogo-ativo {
    padding: 15px;
  }
}
</style>