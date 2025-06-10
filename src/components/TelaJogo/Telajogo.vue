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
            <div class="stat-value">{{ faseAtual === 5 ? 'BÔNUS' : faseAtual }}</div>
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
          <div class="falling-words-container">
            <div v-for="(palavra, index) in palavrasAtivas" :key="index" class="falling-word" :style="{
              top: palavra.y + 'px',
              left: palavra.x + 'px',
              color: palavra.cor || getRandomColor(),
              filter: `drop-shadow(0 0 5px ${palavra.cor || getRandomColor()})`
            }">
              {{ palavra.texto }}
            </div>
            <!-- Fantasminhas de pontos -->
            <transition-group name="fantasminha" tag="div">
              <div v-for="fantasma in fantasminhas" :key="fantasma.id" class="fantasminha" :style="{
                top: (fantasma.y - 20) + 'px',
                left: (fantasma.x + 30) + 'px'
              }">
                <span style="color:#00ff00;">+{{ fantasma.pontos }}</span>
              </div>
            </transition-group>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <div class="game-controls">
        <div class="input-container">
          <input type="text" v-model="palavraDigitada" @input="verificarPalavra" @keydown.enter="limparInput"
            placeholder="Digite a palavra aqui..." class="game-input" ref="inputPalavra" autofocus
            :disabled="pausado" />
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
              <li>ENTER para limpar a caixa de texto</li>
              <li>ESC para pausar</li>
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

    <transition name="fade">
      <div v-if="mostrarTransicaoFase" class="transition-overlay">
        <div class="transition-content">
          <div class="transition-title">FASE {{ faseAtual }} COMPLETA</div>

          <div class="villains-container">
            <!-- Vilão atual -->
            <div v-if="vilaoAtual" class="villain-card">
              <div class="villain-image-wrapper">
                <img :src="vilaoAtual.image" :alt="vilaoAtual.name" class="villain-image">
                <div class="defeated-badge">DERROTADO</div>
              </div>
              <div class="villain-name-transition">{{ vilaoAtual.name }}</div>
            </div>

            <!-- Seta de transição (se tiver proximo vilao) -->
            <div v-if="proximoVilao" class="transition-arrow">→</div>

            <!-- proximo vilao -->
            <div v-if="proximoVilao" class="villain-card">
              <div class="villain-image-wrapper">
                <img :src="proximoVilao.image" :alt="proximoVilao.name" class="villain-image">
                <div class="next-badge">PRÓXIMO</div>
              </div>
              <div class="villain-name-transition">{{ proximoVilao.name }}</div>
            </div>
          </div>

          <div class="transition-footer">
            Preparando próxima fase...
          </div>
        </div>
      </div>
    </transition>

    <!--Popup de GameOver-->
    <transition name="popup">
      <div v-if="mostrarTelaGameOver" class="popup-overlay">
        <div class="popup-content">
          <div class="popup-message" style="margin-bottom: 1rem;">
            <strong>{{ resultadoFinal.venceu ? 'Parabéns! Você venceu!' : 'Game Over!' }}</strong>
          </div>
          <div style="color: #fff; text-align:left; margin-bottom: 1rem;">
            <ul>
              <li><strong>Pontos totais:</strong> {{ resultadoFinal.pontos }}</li>
              <li><strong>Fase atingida:</strong> {{ resultadoFinal.fase - (resultadoFinal.venceu ? 1 : 0) }}</li>
              <li v-if="resultadoFinal.venceu">Você completou todas as fases!</li>
              <li v-else>Que tal tentar de novo para superar sua pontuação?</li>
            </ul>
          </div>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button v-if="resultadoFinal.venceu" class="game-button" @click="iniciarFaseBonus">Fase Bônus</button>
            <button v-else class="game-button" @click="jogarNovamente">Jogar Novamente</button>
            <button class="game-button" @click="voltarTelaInicial">Tela Inicial</button>
          </div>
        </div>
      </div>
    </transition>

    <!--Popup Jogo Pausado-->
    <transition name="popup">
      <div v-if="pausado && jogoIniciado && !mostrarTelaGameOver" class="popup-overlay">
        <div class="popup-content">
          <div class="popup-message">Jogo Pausado<br><span style="font-size:1rem;">Pressione ESC para voltar</span>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<!-- JS -->
<script src="./TelaJogo.js"></script>
<!-- CSS -->
<style src="./TelaJogo.css" scoped></style>