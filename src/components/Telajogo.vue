<template>
    <div class="app-screen">
        <div class="game-content">
            <div class="game-square"></div>
            <div class="d-flex justify-content-between w-100" style="max-width: 300px;">
                <button class="game-button" @click="iniciarJogo">Iniciar Jogo</button>
                <button class="game-button" @click="$emit('voltar')">Voltar</button>
            </div>
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

</style>
    