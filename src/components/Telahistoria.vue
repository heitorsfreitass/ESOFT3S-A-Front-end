<template>

    <!-- História principal no topo -->
    <div class="historia-principal">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                    <div class="card mt-4">
                        <div class="card-header text-center">
                            Final Code: A Jornada dos Devs
                        </div>
                        <div class="card-body">
                            <figure>
                                <blockquote class="blockquote">
                                    <p style="color: white;">
                                        Imagine acordar num dia qualquer, indo pra aula com aquele clássico combo: sono
                                        acumulado, café fraco e esperança mínima. Agora imagine que, do nada, você é
                                        sugado por um glitch na rede da universidade e vai parar num universo paralelo
                                        onde a faculdade virou um jogo. Literalmente.
                                        <br>Seu objetivo é simples no papel: derrotar todos os chefões, provar que tem
                                        conhecimento (e paciência) suficiente pra se formar, e encarar o temido Reitor
                                        Supremo, o chefão final que junta todas as matérias numa prova mortal de
                                        múltipla escolha (sem consulta).
                                        <br>Mas claro... as coisas não são tão simples assim. Ao longo da jornada, você
                                        escolhe o melhor personagem, enfrenta perguntas que mais parecem enigmas
                                        existenciais, sobrevive às piadas sarcásticas dos professores, coleciona
                                        derrotas humilhantes até começar a acertar, e desbloqueia falas épicas, efeitos
                                        sonoros toscos e conquistas inúteis, porém divertidas.
                                        <br>No fim das contas, Final Code não é só um jogo — é um espelho (meio
                                        distorcido) da vida universitária: caótica, estressante, cheia de códigos
                                        quebrados mas com muita risada e gente boa pra aguentar junto.
                                    </p>
                                </blockquote>
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <section class="splide" style="position:static; margin-top: 2rem;">
        <div class="splide__slider">
            <div class="splide__track">
                <ul class="splide__list">
                    <li class="splide__slide">
                        <img src="https://via.placeholder.com/120x120" alt="Slide 1" class="slide-img" />
                        <div class="slide-text">Antes de virar chefão da Unicesumar em Maringá, o Moreno
                            já era lenda. Com 14 anos, hackeava calculadoras científicas pra rodar Tetris nas aulas de
                            matemática. Aos 18, recusou uma vaga na NASA. Motivo? Ninguém indentava direito lá.

                            Virou professor não por vocação, mas por puro entretenimento: adorava ver a galera se
                            perdendo
                            entre while, for e aquele ponto e virgula esquecido que quebra tudo. Entre uma correção e
                            outra,
                            largava uma piada afiada e um deboche com precisão cirúrgica. Ninguém escapa.

                            Ah, e se ouvir o barulho de uma moto subindo as escadas corre é ele ,Moreno pilota uma moto
                            preta com farol em forma de ponto e vírgula, cortando o silêncio com o ronco de quem não
                            indentou, rodou. A lenda diz que, se cruzar com ele nos corredores, só tem uma saída
                            compilar
                            sem erro — ou aceitar a derrota.</div>
                    </li>
                    <li class="splide__slide">
                        <img src="https://via.placeholder.com/120x120" alt="Slide 2" class="slide-img" />
                        <div class="slide-text">Texto do Slide 02</div>
                    </li>
                    <li class="splide__slide">
                        <img src="https://via.placeholder.com/120x120" alt="Slide 3" class="slide-img" />
                        <div class="slide-text">Texto do Slide 03</div>
                    </li>
                    <li class="splide__slide">
                        <img src="https://via.placeholder.com/120x120" alt="Slide 4" class="slide-img" />
                        <div class="slide-text">Texto do Slide 04</div>
                    </li>
                </ul>
            </div>
        </div>
        <button class="splide__toggle" type="button">
            <span class="splide__toggle__play">Play</span>
            <span class="splide__toggle__pause">Pause</span>
        </button>
    </section>

</template>

<script>
import { onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

export default {
    name: 'Telahistoria',
    setup() {
        onMounted(() => {
            new Splide('.splide', {
                type: 'loop',
                perPage: 1,
                autoplay: true,
                interval: 3000,
                pauseOnHover: true,
                pauseOnFocus: true,
            }).mount();
        });
    },
};



// Exemplo para remover bloqueio via JavaScript
document.body.style.overflow = 'auto';
</script>

<style scoped>
/* ...existing code... */

.splide {
    position: static;
    width: 80%;
    margin: 2rem auto 0 auto;
    /* Centraliza horizontalmente */
    background: rgba(26, 26, 46, 0.95);
    border: 1px solid #00ffff;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
    z-index: 1000;
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}


.splide__slide {
    color: #00ffff;
    font-size: 1.2rem;
    text-align: center;
    padding: 1rem 0;
    font-weight: bold;
    letter-spacing: 1px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.slide-text {
    word-break: break-word;
    white-space: normal;
    max-width: 90%;
}

.splide__toggle {
    margin-top: 0.5rem;
    background: #00ffff;
    color: #1a1a2e;
    border: none;
    border-radius: 6px;
    padding: 0.4rem 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.splide__toggle:hover {
    background: #00baba;
}

/* Responsivo */
@media (max-width: 480px) {
    .splide {
        width: 95vw;
        min-width: 0;
        padding: 0.5rem 0.2rem;
    }

    .splide__slide {
        font-size: 1rem;
        padding: 0.5rem 0;
    }
}




/* Estilo base */
.custom-card {
    width: 100%;
    max-width: 350px;
    min-width: 250px;
    margin-bottom: 1rem;
    background: rgba(26, 26, 46, 0.8);
    border: 1px solid #00ffff;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.container {
    padding: 2rem;
    background: linear-gradient(135deg, #1a1a2e 100%, #16213e 100%);
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    z-index: -1;
}
</style>