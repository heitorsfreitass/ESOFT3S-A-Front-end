<template>
  <div class="app-screen">
    <!-- Container principal da tela -->
    <div class="title-container">
      <!-- Título do jogo com estilo cyberpunk -->
      <h1 class="game-title">FINAL CODE: A Jornada dos Devs</h1>
    </div>
    
    <!-- Área dos botões principais -->
    <div class="game-content">
      <!-- Botão Jogar - o mais importante com efeito especial -->
      <button class="game-button jogar-button" @click="$emit('trocarTela', 'jogo')">
        <span class="button-text">Jogar</span>
        <!-- Efeito de brilho por trás do texto -->
        <span class="button-glow"></span>
      </button>
      
      <!-- Demais botões com efeito padrão -->
      <button class="game-button" @click="$emit('trocarTela', 'historia')">
        <span class="button-text">História</span>
        <span class="button-glow"></span>
      </button>
      
      <button class="game-button" @click="$emit('trocarTela', 'creditos')">
        <span class="button-text">Créditos</span>
        <span class="button-glow"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Estilo base da tela com background animado */
.app-screen {
    background-image: url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
    flex-direction: column;
}

/* Container do título com efeito de vidro */
.title-container {
    backdrop-filter: blur(4px); /* Efeito de desfoque */
    padding: 30px 50px;
    border-radius: 5px;
    margin-bottom: 40px;
    background-color: rgba(10, 4, 26, 0.8); /* Fundo semi-transparente */
    border: 1px solid #6e00ff; /* Borda neon */
}

/* Estilo do título principal */
.game-title {
    font-size: 3rem;
    letter-spacing: 3px; /* Espaçamento entre letras */
    color: #00ffcc; /* Cor neon */
    text-shadow: 0 0 10px rgba(0, 255, 204, 0.7); /* Brilho no texto */
}

/* Linha decorativa abaixo do título */
.game-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    /* Gradiente que combina com o tema */
    background: linear-gradient(90deg, transparent, #6e00ff, #00ffcc, transparent);
}

/* Container dos botões */
.game-content {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 30px; 
    backdrop-filter: blur(4px); 
    padding: 30px;
    border-radius: 5px;
    background-color: rgba(10, 4, 26, 0.8);
    border: 1px solid #6e00ff; 
}

/* ESTILO DOS BOTÕES  */

.game-button {
    min-width: 180px;
    padding: 15px 30px;
    font-size: 1.2rem;
    position: relative;
    overflow: hidden; /* Esconde efeitos que ultrapassam */
    
    /* Gradiente roxo/ciano */
    background: linear-gradient(45deg, #6e00ff, #00ffcc);
    color: white;
    border: none;
    border-radius: 50px; /* Bordas arredondadas */
    
    /* Estilo de texto */
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 1px;
    text-transform: uppercase;
    
    /* Camadas e efeitos visuais */
    z-index: 1;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease; 
}

/* Efeito de brilho externo */
.game-button .button-glow {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, #6e00ff, #00ffcc);
    border-radius: 50px;
    filter: blur(15px); 
    opacity: 0.7;
    z-index: -1; 
    animation: pulse-glow 2s infinite; 
}

/* Efeito hover - quando o mouse passa por cima */
.game-button:hover {
    transform: translateY(-3px); 
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4); 
}

/* Faísca que passa quando hover */
.game-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg, 
        transparent, 
        rgba(255, 255, 255, 0.2), 
        transparent
    );
    transition: 0.5s;
    z-index: -1;
}

.game-button:hover::before {
    left: 100%; /* Animação da faísca */
}

/* Animação do brilho pulsante */
@keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.9; }
}

/* Efeito de scanlines  */
.app-screen::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Linhas horizontais transparentes */
    background: linear-gradient(
        rgba(0, 0, 0, 0) 50%, 
        rgba(0, 0, 0, 0.3) 50%
    );
    background-size: 100% 4px; 
    pointer-events: none; 
    opacity: 0.3; 
}

/* responsividade*/
@media (max-width: 768px) {
    .game-title {
        font-size: 2rem; 
    }
    
    .game-button {
        min-width: 140px; 
        padding: 12px 24px;
        font-size: 1rem; 
    }
    
    .game-content {
        gap: 20px; 
        padding: 20px; 
    }
    
    .title-container {
        padding: 20px 30px;
        margin-bottom: 30px;
    }
}
</style>