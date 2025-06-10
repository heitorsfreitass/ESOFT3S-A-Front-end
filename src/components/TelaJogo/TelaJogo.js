// Importações

// Professores
import cidaoImg from '@/assets/characters/villains/cidao.jpeg'
import morenoImg from '@/assets/characters/villains/moreno.jpeg'
import ferliniImg from '@/assets/characters/villains/ferlini.jpeg'
import hugoImg from '@/assets/characters/villains/hugo.jpeg'

// Personagens
import andreImg from '@/assets/characters/andre.jpg'
import andrezImg from '@/assets/characters/andrez.jpg'
import bernardoImg from '@/assets/characters/bernardo.jpg'
import gabrielImg from '@/assets/characters/gabriel.jpg'
import heitorImg from '@/assets/characters/heitor.jpg'
import marcosImg from '@/assets/characters/marcos.jpg'

// Sons
import fase1Msc from '@/assets/sounds/primeira-fase.mp3'
import fase2Msc from '@/assets/sounds/segunda-fase.mp3'
import fase3Msc from '@/assets/sounds/terceira-fase.mp3'
import fase4Msc from '@/assets/sounds/quarta-fase.mp3'
import fase5Msc from '@/assets/sounds/bonus-fase.mp3'
import acertoSound from '@/assets/sounds/acerto.mp3'
import erroSound from '@/assets/sounds/erro.mp3'
import selectSound from '@/assets/sounds/select.mp3'


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
      pausado: false,
      areaJogo: {                   // Dimensoes da área de jogo
        width: 800,
        height: 500
      },
      mostrarTransicaoFase: false,
      mensagemTransicaoFase: '',
      // Lista dos personagens disponiveis
      personagens: [
        { name: 'Perin', type: 'dev', image: andreImg },
        { name: 'Marcos', type: 'dev', image: marcosImg },
        { name: 'Andrezão', type: 'dev', image: andrezImg },
        { name: 'Gabe', type: 'dev', image: gabrielImg },
        { name: 'Dig', type: 'dev', image: heitorImg },
        { name: 'Bernardo', type: 'dev', image: bernardoImg },
      ],
      viloes: [
        { name: 'Cidão, O Abominável (mas nem tanto)', image: cidaoImg, fase: 1, musica: fase1Msc },
        { name: 'Ferlini, O Gostosinho...', image: ferliniImg, fase: 2, musica: fase2Msc },
        { name: 'Hugo, O Sr. Bootstrap...', image: hugoImg, fase: 3, musica: fase3Msc },
        { name: 'Moreno, O Pequeno Grande Professor...', image: morenoImg, fase: 4, musica: fase4Msc },
      ],
      audioElement: null,
      audioAtivo: true,
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
      fantasminhas: [],
    }
  },

  // Hook(funcao) chamado quando o componente e montado
  mounted() {
    this.atualizarDimensoesAreaJogo()
    window.addEventListener('resize', this.atualizarDimensoesAreaJogo)
    // Atalho para pular de fase: Ctrl + M
    window.addEventListener('keydown', this.atalhoPularFase)
    window.addEventListener('keydown', this.atalhoPausaEsc)
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },

  beforeDestroy() {
    this.limparIntervalos()
    window.removeEventListener('resize', this.atualizarDimensoesAreaJogo)
    window.removeEventListener('keydown', this.atalhoPularFase)
    window.removeEventListener('keydown', this.atalhoPausaEsc)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },

  methods: {

    //Seleciona um personagem pelo índice.
    selecionarPersonagem(index) {
      this.personagemSelecionado = index
    },

    tocarSelect() {
      const audio = new Audio(selectSound);
      audio.volume = 0.4; // ajuste o volume se quiser
      audio.play();
    },

    /**
     * Atalho para pular de fase (Ctrl+M). 
     * Se estiver na última fase, finaliza o jogo.
     */
    atalhoPularFase(e) {
      if (this.jogoIniciado && e.ctrlKey && (e.key === 'm' || e.key === 'M')) {
        this.pontuacaoPorFase.push(this.pontuacaoFaseAtual);
        this.pontuacaoFaseAtual = 0;
        this.limparIntervalos();
        this.palavrasAtivas = [];
        this.mensagemTransicaoFase = `Fase ${this.faseAtual} completa!`;
        this.mostrarTransicaoFase = true;

        setTimeout(() => { //se a fase atual for menor que 4 vai pular, se estiver na última fase finaliza 
          this.mostrarTransicaoFase = false;
          if (this.faseAtual < 4) {
            this.faseAtual++;
            this.carregarFase(this.faseAtual);
            this.$nextTick(() => {
              this.velocidadeBase = 0.6;
              this.iniciarAnimacaoPalavras();
            });
          } else {
            // Terminou a fase 4, mostra tela de vitória
            this.fimDeJogo(true);
          }
        }, 1200); // tempo menor para suavidade
      }
    },

    /**
     * Atalho para pausar/despausar o jogo com ESC.
     */
    atalhoPausaEsc(e) {
      if (this.jogoIniciado && e.key === 'Escape') {
        this.alternarPausa();
      }
    },

    /**
     * Pausa o jogo automaticamente ao sair da aba.
     */
    handleVisibilityChange() {
      if (document.hidden && this.jogoIniciado && !this.pausado && !this.mostrarTelaGameOver) {
        this.alternarPausa();
      }
    },


    /**
     * Calcula a velocidade base das palavras para cada fase.
     * Na fase bônus, a velocidade aumenta conforme a pontuação.
     */
    calcularVelocidadeBase() {
      if (this.faseAtual === 5) {
        // Aumenta a velocidade base conforme a pontuação total na fase bônus
        // Exemplo: começa em 1.5 e aumenta 0.1 a cada 50 pontos
        return 1.5 + Math.floor(this.pontuacaoFaseAtual / 100) * 0.4;
      }
      switch (this.faseAtual) {
        case 1: return 0.7;
        case 2: return 0.95;
        case 3: return 1.15;
        case 4: return 1.2;
        default: return 1.5;
      }
    },

    //Inicia o jogo, resetando todos os estados.
    iniciarJogo() {
      if (this.personagemSelecionado === null) return

      this.pararMusica();

      this.jogoIniciado = true
      this.pontuacao = 0
      this.vidas = 3
      this.faseAtual = 1

      this.velocidadeBase = this.calcularVelocidadeBase();

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
    /**
     * Limpa o input ao apertar enter.
     */
    limparInput() {
      this.palavraDigitada = '';
    },

    /**
     * Atualiza as dimensões da área de jogo.
     */
    atualizarDimensoesAreaJogo() {
      if (this.$refs.areaJogo) {
        this.areaJogo.width = this.$refs.areaJogo.offsetWidth
        this.areaJogo.height = this.$refs.areaJogo.offsetHeight
      }
    },

    /**
     * Carrega as palavras para a fase especificada.
     * Na fase bônus, carrega palavras infinitamente.
     */
    carregarFase(fase) {
      // Se for a fase bônus (ex: fase 5)
      if (fase === 5) {
        this.vilaoAtual = null; // vilao definido para null
        this.velocidadeBase = 1.5;
        this.iniciarMusica(fase5Msc);
        this.listaPalavras = this.palavrasPorFase['faseBonus'] ? [...this.palavrasPorFase['faseBonus']] : [];
        return;
      }
      // Fases normais
      this.vilaoAtual = this.viloes.find(v => v.fase === fase) || null;
      this.velocidadeBase = this.calcularVelocidadeBase();
      if (this.vilaoAtual && this.vilaoAtual.musica) {
        this.iniciarMusica(this.vilaoAtual.musica);
      }
      const palavras = this.palavrasPorFase['fase' + fase];
      this.listaPalavras = palavras ? [...palavras] : [];
    },


    /**
     * Inicia a animação das palavras caindo.
     * Na fase bônus, adiciona palavras com intervalo menor.
     */
    iniciarAnimacaoPalavras() {
      this.limparIntervalos();

      // Configura intervalo para adicionar novas palavras
      this.intervaloPalavras = setInterval(() => {
        this.adicionarPalavra();
      }, this.faseAtual === 5 ? 1200 : 2000); // Intervalo menor na fase bônus

      // Animação contínua das palavras caindo (frame a frame).
      this.intervaloAnimacao = requestAnimationFrame(() => this.animarPalavras());
    },

    /**
     * Animação frame a frame das palavras caindo.
     * Atualiza posição, verifica se saiu da tela e perde vida se necessário.
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

          // TOCA O SOM DE ERRO
          const audio = new Audio(erroSound)
          audio.volume = 0.5
          audio.play()

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
     * Verifica se a palavra digitada está na lista de palavras ativas.
     * Se acertar, toca som, mostra fantasminha, remove palavra, soma pontos e recalcula velocidade.
     * Só há transição de fase se NÃO estiver na fase bônus.
     */
    verificarPalavra() {
      // Remove espaços e deixa minúsculo
      const palavraLower = this.palavraDigitada.replace(/\s/g, '').toLowerCase();

      // Encontra a primeira palavra que começa com o texto digitado (ignorando espaços)
      const palavraCorrespondente = this.palavrasAtivas.find(p =>
        p.texto.replace(/\s/g, '').toLowerCase().startsWith(palavraLower)
      );

      if (palavraCorrespondente && palavraCorrespondente.texto.replace(/\s/g, '').toLowerCase() === palavraLower) {
        palavraCorrespondente.cor = CORES_FEEDBACK.acerto;
        //TOCA O SOM DE ACERTO
        const audio = new Audio(acertoSound);
        audio.volume = 0.5; // ajuste o volume 
        audio.play();
        setTimeout(() => {
          this.palavrasAtivas = this.palavrasAtivas.filter(p => p !== palavraCorrespondente);
        }, 200);

        const id = Date.now() + Math.random();
        this.fantasminhas.push({
          id,
          pontos: palavraCorrespondente.texto.length,
          x: palavraCorrespondente.x,
          y: palavraCorrespondente.y,
        });
        setTimeout(() => {
          this.fantasminhas = this.fantasminhas.filter(f => f.id !== id);
        }, 500);

        setTimeout(() => {
          this.palavrasAtivas = this.palavrasAtivas.filter(p => p !== palavraCorrespondente);
        }, 200);

        this.pontuacao += palavraCorrespondente.texto.length;
        this.pontuacaoFaseAtual += palavraCorrespondente.texto.length;
        this.palavraDigitada = '';

        this.velocidadeBase = this.calcularVelocidadeBase();

        clearInterval(this.intervaloPalavras);
        const novoIntervalo = Math.max(700, 2000 - this.velocidadeBase * 400);
        this.intervaloPalavras = setInterval(() => {
          this.adicionarPalavra()
        }, novoIntervalo);

        if (this.faseAtual !== 5 && this.pontuacaoFaseAtual >= 100) {
          this.pontuacaoPorFase.push(this.pontuacaoFaseAtual);
          this.pontuacaoFaseAtual = 0;
          this.limparIntervalos();
          this.palavrasAtivas = [];
          this.mensagemTransicaoFase = `Fase ${this.faseAtual} completa!`;
          this.proximoVilao = this.viloes.find(v => v.fase === this.faseAtual + 1) || null;
          this.mostrarTransicaoFase = true;

          setTimeout(() => {
            this.mostrarTransicaoFase = false;
            if (this.faseAtual < 4) {
              this.faseAtual++;
              this.carregarFase(this.faseAtual);
              this.$nextTick(() => {
                this.velocidadeBase = 0.6;
                this.iniciarAnimacaoPalavras();
              });
            } else {
              // Terminou a fase 4, mostra tela de vitória
              this.fimDeJogo(true);
            }
          }, 4000);  // 4 segundos

        }
      }
    },



    // Adiciona uma palavra nova na tela.
    // Se a lista de palavras acabar, recarrega para a fase atual (ou bônus se for fase 5).
    adicionarPalavra() {
      // Recarrega palavras da fase bônus sempre que acabar, tornando-a infinita.
      if (!this.listaPalavras.length) {
        let palavrasOriginais;
        if (this.faseAtual === 5) {
          palavrasOriginais = this.palavrasPorFase['faseBonus'];
        } else {
          palavrasOriginais = this.palavrasPorFase['fase' + this.faseAtual];
        }
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


      // Quanto menor a palavra, mais rápida; quanto maior, mais lenta
      const baseVelocidade = 2.2;
      const fator = 0.2;
      let velocidade = Math.max(0.7, baseVelocidade - palavraTexto.length * fator);

      // Pequena variação aleatória para não ficar tudo igual
      velocidade *= 0.95 + Math.random() * 0.1;

      const palavra = {
        texto: palavraTexto,
        x: Math.random() * (this.areaJogo.width - (palavraTexto.length * 22 + 20)),
        y: 0,
        velocidade: velocidade,
        cor: '#ffffff'
      };

      this.palavrasAtivas.push(palavra);
    },

    /**
     * Limpa os intervalos e animações para evitar vazamento de memória.
     */
    limparIntervalos() {
      if (this.intervaloPalavras) clearInterval(this.intervaloPalavras)
      if (this.intervaloAnimacao) cancelAnimationFrame(this.intervaloAnimacao)
    },

    /**
     * Finaliza o jogo mostrando tela de vitória ou derrota.
     * @param {boolean} venceu - true se o jogador venceu
     */
    fimDeJogo(venceu) {
      // Para tudo, mostra tela de vitória/derrota e toca som correspondente.
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

    /**
     * Inicia música de fundo da fase.
     */
    iniciarMusica(src) {
      this.pararMusica();
      this.audioElement = new Audio(src);
      this.audioElement.loop = true;
      // Volume bem baixo para a fase bônus, padrão para as outras
      this.audioElement.volume = (src === fase5Msc) ? 0.08 : 0.4;
      this.mostrarBotaoAudio = true;
      if (this.audioAtivo) {
        this.audioElement.play();
      }
    },

    /**
     * Para música de fundo.
     */
    pararMusica() {
      if (this.audioElement) {
        this.audioElement.pause()
        this.audioElement = null
      }
      this.mostrarBotaoAudio = false
    },

    /**
     * Alterna entre pausar e retomar música.
     */
    pausarOuRetomarMusica() {
      if (!this.audioElement) return
      if (this.audioElement.paused) {
        this.audioElement.play()
        this.audioAtivo = true
      } else {
        this.audioElement.pause()
        this.audioAtivo = false
      }
    },

    /**
     * Mostra popup de ajuda.
     */
    mostrarAjuda() {
      this.mostrarComoJogar = true
    },

    /**
     * Fecha popup de ajuda.
     */
    fecharAjuda() {
      this.mostrarComoJogar = false
    },

    /**
     * Reinicia o jogo após perder ou vencer.
     */
    jogarNovamente() {
      this.mostrarTelaGameOver = false;
      this.iniciarJogo();
    },

    //Volta para tela inicial, resetando tudo.
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

    /**
     * Alterna pausa do jogo (pausa animação, palavras e música).
     */
    alternarPausa() {
      this.pausado = !this.pausado;
      if (this.pausado) {
        if (this.intervaloPalavras) clearInterval(this.intervaloPalavras);
        if (this.intervaloAnimacao) cancelAnimationFrame(this.intervaloAnimacao);
        if (this.audioElement && !this.audioElement.paused) this.audioElement.pause();
      } else {
        if (this.audioElement && this.audioAtivo) this.audioElement.play();
        this.iniciarAnimacaoPalavras();
      }
    },

    //Inicia a fase bônus manualmente após vencer as 4 fases principais.
    //A fase bônus é infinita e só termina quando o jogador perde todas as vidas.
    iniciarFaseBonus() {
      this.mostrarTelaGameOver = false;
      this.jogoIniciado = true;
      this.faseAtual = 5;
      this.pontuacaoFaseAtual = 0;
      this.palavraDigitada = '';
      this.palavrasAtivas = [];
      this.vidas = 6; // Na fase bônus, começa com 6 vidas (pode ajustar)
      this.carregarFase(5);
      this.iniciarAnimacaoPalavras();
    }
  }
}