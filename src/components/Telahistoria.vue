<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-6">
                <div class="card mt-4">
                    <div class="card-header text-center">
                        Final Code: A Jornada dos Devs
                    </div>
                    <div class="card-body">
                        <figure>
                            <blockquote class="blockquote">
                                <p>
                                    Imagine acordar num dia qualquer, indo pra aula com aquele clássico combo: sono
                                    acumulado, café
                                    fraco e esperança mínima. Agora imagine que, do nada, você é sugado por um
                                    glitch na rede da
                                    universidade e vai parar num universo paralelo onde a faculdade virou um
                                    jogo. Literalmente.
                                    Você é um estudante normal (ou quase), que acaba sendo “escolhido” pelo
                                    sistema para uma
                                    missão que nem sabia que existia: sobreviver à Universidade dos Chefões
                                    Supremos.
                                    Nesse lugar bizarro e altamente bugado, cada professor se tornou um chefão de
                                    fase com
                                    superpoderes baseados nas matérias mais temidas da faculdade de Engenharia de
                                    Software. Eles dominam
                                    o campus da Unicesumar.
                                    Seu objetivo é simples no papel:
                                    <br> Derrotar todos os chefões,
                                    <br> Provar que tem conhecimento (e paciência) suficiente pra se formar,
                                    <br> E encarar o temido Reitor Supremo, o chefão final que junta todas as
                                    matérias numa prova
                                    mortal de múltipla escolha (sem consulta).
                                    Mas claro... as coisas não são tão simples assim.
                                    Ao longo da jornada, você:
                                    <br>Escolhe o melhor personagem
                                    <br>Enfrenta perguntas que mais parecem enigmas existenciais.
                                    <br>Sobrevive às piadas sarcásticas dos professores.
                                    <br>Coleciona derrotas humilhantes até começar a acertar.
                                    <br>E desbloqueia falas épicas, efeitos sonoros toscos e conquistas inúteis,
                                    porém divertidas.
                                    Tudo isso com trilha sonora de formatura épica
                                    No fim das contas, Final Code não é só um jogo — é um espelho (meio distorcido)
                                    da vida
                                    universitária: caótica, estressante, cheia de códigos quebrados mas com muita
                                    risada e gente
                                    boa pra aguentar junto.
                                </p>
                            </blockquote>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
</script>

<style scoped>
/* Estilo base */
.container {
    padding: 2rem;
    background: linear-gradient(135deg, #1a1a2e 100%, #16213e 100%);
    min-height: 100vh;
    color: white;
}

.card {
    background: rgba(26, 26, 46, 0.8);
    border: 1px solid #00ffff;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
    transform: translateY(-5px);
}

.card-header {
    background: rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid #00ffff;
    font-size: 1.8rem;
    font-weight: bold;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
    padding: 1.5rem;
    letter-spacing: 1px;
    animation: text-glow 2s infinite alternate;
}

.card-body {
    padding: 2rem;
}

.blockquote {
    font-size: 1.1rem;
    line-height: 1.8;
    text-align: justify;
}

.blockquote p {
    margin-bottom: 1.5rem;
    position: relative;
    padding-left: 1.5rem;
}

.blockquote p::before {
    content: ">";
    position: absolute;
    left: 0;
    color: #00ffff;
    font-weight: bold;
}

/* Animações */
@keyframes text-glow {
    0% {
        text-shadow: 0 0 8px #00ffff;
    }

    100% {
        text-shadow: 0 0 16px #00ffff, 0 0 24px #00ffff;
    }
}

/* Responsividade */
@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }

    .card-header {
        font-size: 1.5rem;
        padding: 1rem;
    }

    .blockquote {
        font-size: 1rem;
    }
}

@media (max-width: 576px) {
    .card-header {
        font-size: 1.3rem;
    }

    .blockquote p {
        padding-left: 1rem;
    }

    .blockquote p::before {
        display: none;
    }
}

.container::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    z-index: -1;
}
</style>