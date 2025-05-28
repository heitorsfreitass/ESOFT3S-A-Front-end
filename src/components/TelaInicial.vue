<template>
  <div class="app-screen">
    <h1 class="game-title">FINAL CODE: A Jornada dos Devs</h1>
    
    <div class="game-content">
      <button class="game-button" @click="$emit('trocarTela', 'jogo')">Jogar</button>
      <button class="game-button" @click="$emit('trocarTela', 'historia')">História</button>
      <button class="game-button" @click="$emit('trocarTela', 'creditos')">Créditos</button>
    </div>
  </div>
</template>

<style scoped>

/* mudancas pra essa tela */
.app-screen {
    flex-direction: column;
}   

.game-title {
    font-size: 3rem;
    margin-bottom: 50px;
    letter-spacing: 2px;
    animation: text-glow 2s infinite alternate;
}

.game-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
}

.game-button {
    min-width: 180px;
    padding: 15px 30px;
    font-size: 1.2rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.game-button:hover {
    transform: translateY(-3px);
}

.game-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.4), transparent);
    transition: 0.5s;
}

.game-button:hover::after {
    left: 100%;
}

/* Animaçoes */
@keyframes text-glow {
    0% {
        text-shadow: 0 0 8px #00ffff;
    }
    100% {
        text-shadow: 0 0 16px #00ffff, 0 0 24px #00ffff;
    }
}

@media (max-width: 768px) {
    .game-title {
        font-size: 2rem;
        margin-bottom: 30px;
    }
    
    .game-button {
        min-width: 140px;
        padding: 12px 24px;
        font-size: 1rem;
    }
    
    .game-content {
        gap: 20px;
    }
}
</style>