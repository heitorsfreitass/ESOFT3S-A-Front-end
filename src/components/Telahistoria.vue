<template>
  <div class="game-screen">
    <!-- Botão Voltar -->
    <button class="back-button" @click="handleVoltar">
      <span class="button-icon">←</span> VOLTAR
    </button>

    <!-- História principal no topo -->
    <div class="main-story">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8">
            <div class="story-card">
              <div class="card-header text-center">
                Final Code: A Jornada dos Devs
              </div>
              <div class="card-content">
                <p class="story-text">
                  Imagine acordar num dia qualquer, indo pra aula com aquele clássico combo: sono
                  acumulado, café fraco e esperança mínima. Agora imagine que, do nada, você é
                  sugado por um glitch na rede da universidade e vai parar num universo paralelo
                  onde a faculdade virou um jogo. Literalmente.
                </p>
                <p class="story-text">
                  Seu objetivo é simples no papel: derrotar todos os chefões, provar que tem
                  conhecimento (e paciência) suficiente pra se formar, e encarar o temido Reitor
                  Supremo, o chefão final que junta todas as matérias numa prova mortal de
                  múltipla escolha (sem consulta).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carrossel de Histórias -->
    <section class="splide" aria-label="Histórias dos Chefões">
      <div class="splide__track">
        <ul class="splide__list">
          <li class="splide__slide">
            <div class="slide-content">
              <img src="@/assets/characters/villains/moreno.jpeg" alt="Moreno" class="slide-img" />
              <div class="slide-text">
                <h3 class="character-name">Moreno</h3>
                <p>Antes de virar chefão da Unicesumar em Maringá, o Moreno já era lenda. Com 14 anos, hackeava calculadoras científicas pra rodar Tetris nas aulas de matemática.</p>
                <p>Aos 18, recusou uma vaga na NASA. Motivo? "Ninguém indentava direito lá". Virou professor não por vocação, mas por puro entretenimento.</p>
                <p class="special-ability">Habilidade Especial: <span>Indentação Perfeita</span> - Seu código sempre tem a formatação impecável, mesmo sob pressão.</p>
              </div>
            </div>
          </li>
          <li class="splide__slide">
            <div class="slide-content">
              <img src="@/assets/characters/villains/cidao.jpeg" alt="Cidão" class="slide-img" />
              <div class="slide-text">
                <h3 class="character-name">Cidão</h3>
                <p>O temido "Rei das Exceções", Cidão acredita que todo sistema deve prever até os cenários mais absurdos. Diz a lenda que ele já fez um try-catch que cobria até erros de digitação do usuário.</p>
                <p>Seus projetos têm mais tratamentos de erro que lógica de negócio. Alunos tremem quando ouvem a frase "E se...?" em suas aulas.</p>
                <p class="special-ability">Habilidade Especial: <span>Tratamento de Exceções Infinito</span> - Seu código nunca crasha, mas também nunca chega no resultado esperado.</p>
              </div>
            </div>
          </li>
          <li class="splide__slide">
            <div class="slide-content">
              <img src="@/assets/characters/villains/ferlini.jpeg" alt="Ferlini" class="slide-img" />
              <div class="slide-text">
                <h3 class="character-name">Ferlini</h3>
                <p>Conhecido como "O Criptógrafo", Ferlini diz ter trabalhado em projetos ultrassecretos antes de virar docente. Suas aulas são cheias de enigmas e quem decifra seus códigos ganha pontos extras.</p>
                <p>Nunca foi visto sem seu café térmico personalizado. Dizem que ele escreve algoritmos em SHA-256 só por diversão.</p>
                <p class="special-ability">Habilidade Especial: <span>Código Irreversível</span> - Seus algoritmos são tão bem criptografados que nem ele mesmo consegue explicar como funcionam.</p>
              </div>
            </div>
          </li>
          <li class="splide__slide">
            <div class="slide-content">
              <img src="@/assets/characters/villains/hugo.jpeg" alt="Hugo" class="slide-img" />
              <div class="slide-text">
                <h3 class="character-name">Hugo</h3>
                <p>A "Máquina de Padrões", Hugo é obcecado por designs perfeitos e arquitetura limpa. Já reprovou uma turma inteira porque um projeto tinha um Singleton mal implementado.</p>
                <p>Seu lema: "Se não seguir o padrão, não existe". Corre o boato que ele sonha em UML e acorda gritando quando vê um God Object.</p>
                <p class="special-ability">Habilidade Especial: <span>Visão de Design Patterns</span> - Consegue identificar um Factory Method a 100 metros de distância.</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';

export default {
  name: 'TelaHistoria',
  emits: ['voltar'],
  setup(props, { emit }) {
    const handleVoltar = () => {
      emit('voltar');
    };

    onMounted(() => {
      new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        perMove: 1,
        autoplay: true,
        interval: 7000,
        pauseOnHover: true,
        pauseOnFocus: true,
        arrows: true,
        pagination: true,
        speed: 800,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        classes: {
          arrows: 'splide__arrows your-class-arrows',
          arrow : 'splide__arrow your-class-arrow',
          prev  : 'splide__arrow--prev your-class-prev',
          next  : 'splide__arrow--next your-class-next',
        },
        breakpoints: {
          768: {
            arrows: false,
            pagination: true
          }
        }
      }).mount();
    });

    return {
      handleVoltar
    };
  },
};
</script>

<style scoped>

/* Estrutura principal */
.game-screen {
  background: var(--darker);
  color: var(--light);
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

/* Botão Voltar */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(110, 0, 255, 0.3);
  color: var(--light);
  border: 2px solid var(--primary);
  border-radius: 50px;
  padding: 8px 20px;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
  transition: all 0.3s;
}

.back-button:hover {
  background: var(--primary);
  transform: translateX(-5px);
}

.button-icon {
  font-size: 1.2rem;
}

/* História Principal */
.main-story {
  max-width: 1200px;
  margin: 0 auto 3rem;
}

.story-card {
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid var(--primary);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(110, 0, 255, 0.2);
}

.card-header {
  background: linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(110, 0, 255, 0.2) 50%, rgba(0,0,0,0.3) 100%);
  border-bottom: 2px solid var(--primary);
  padding: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--accent);
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
}

.card-content {
  padding: 2rem;
}

.story-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  position: relative;
  padding-left: 1.8rem;
}

.story-text::before {
  content: ">";
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: bold;
}

/* Carrossel Aprimorado */
.splide {
  max-width: 900px;
  margin: 3rem auto;
  background: rgba(26, 26, 46, 0.9);
  border: 2px solid var(--secondary);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.splide::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--accent), var(--primary));
}

.splide__arrows {
  position: absolute;
  top: 50%;
  width: calc(100% + 80px);
  left: -40px;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 1;
}

.splide__arrow {
  background: rgba(110, 0, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1.5rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

.splide__arrow:hover {
  background: var(--primary);
  transform: scale(1.1);
}

.splide__arrow--prev {
  left: 10px;
}

.splide__arrow--next {
  right: 10px;
}

.splide__pagination {
  position: absolute;
  bottom: -25px;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.splide__pagination__page {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  padding: 0;
  transition: all 0.3s;
  opacity: 0.7;
}

.splide__pagination__page.is-active {
  background: var(--accent);
  transform: scale(1.3);
  opacity: 1;
}

.splide__pagination__page:hover {
  transform: scale(1.2);
  opacity: 1;
}

.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 2rem;
}

.slide-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid var(--accent);
  object-fit: cover;
  box-shadow: 0 0 25px rgba(0, 255, 204, 0.4);
  transition: all 0.3s;
}

.slide-img:hover {
  transform: scale(1.05);
  box-shadow: 0 0 35px rgba(0, 255, 204, 0.6);
}

.character-name {
  color: var(--accent);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
  position: relative;
  display: inline-block;
}

.character-name::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
}

.slide-text {
  color: var(--light);
  font-size: 1.1rem;
  line-height: 1.7;
  text-align: center;
  max-width: 90%;
}

.slide-text p {
  margin-bottom: 1rem;
}

.special-ability {
  font-style: italic;
  margin-top: 1.5rem;
  color: var(--light);
  font-size: 1rem;
}

.special-ability span {
  color: var(--accent);
  font-weight: bold;
}

/* Responsividade */
@media (max-width: 992px) {
  .splide {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  .game-screen {
    padding: 1rem;
  }
  
  .card-header {
    font-size: 1.5rem;
    padding: 1rem;
  }
  
  .story-text {
    font-size: 1rem;
    padding-left: 1.2rem;
  }
  
  .splide {
    padding: 1.5rem;
    margin: 2rem auto;
  }
  
  .splide__arrow {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .slide-content {
    padding: 1rem;
  }
  
  .slide-img {
    width: 120px;
    height: 120px;
  }
  
  .character-name {
    font-size: 1.5rem;
  }
  
  .slide-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .back-button {
    padding: 6px 15px;
    font-size: 0.9rem;
  }
  
  .slide-img {
    width: 100px;
    height: 100px;
  }
  
  .slide-text {
    font-size: 0.9rem;
  }
  
  .special-ability {
    font-size: 0.85rem;
  }
  
  .splide__pagination__page {
    width: 10px;
    height: 10px;
  }
}
</style>