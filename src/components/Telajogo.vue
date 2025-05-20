<template>
    <div class="container">
        <div class="content">
            <div class="quadrado"></div>
            <button class="botao-jogar" @click="iniciarJogo">Iniciar Jogo</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        iniciarJogo() {
            alert('Jogo iniciado!'); // Aqui você pode disparar a lógica real de iniciar o jogo
        }
    }
}
</script>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #222;
}

/* Para agrupar o quadrado e o botão centralizados na vertical */
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    /* Espaço entre quadrado e botão */
}

.quadrado {
    width: 300px;
    height: 300px;
    background-color: #00ffff;
    border-radius: 12px;
    box-shadow: 0 0 20px #00ffff;
}

.botao-jogar {
    padding: 12px 30px;
    font-size: 1.2rem;
    color: #000;
    background-color: #00ffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 0 10px #00ffff;
    transition: background-color 0.3s;
}

.botao-jogar:hover {
    background-color: #00cccc;
}
</style>
    