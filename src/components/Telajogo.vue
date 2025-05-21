<template>
    <div class="app-screen">
        <div class="game-content">
            <div class="row">
                <!-- Seção de escolha de personagem -->
                <div v-if="!jogoIniciado" class="selecao-personagem"> <!-- exibir se o jogo ainda nao tiver iniciado -->
                    <h3 class="game-title mb-5">Escolha seu Personagem</h3>
                    <div class="row">
                        <!-- 'for' para exibir os personagens -->
                        <div class="col-4 mb-4 card-personagem" v-for="(personagem, index) in personagens" :key="index"> 
                            <!-- Botão que vai selecionar personagem -->
                            <button 
                                class="botao-personagem"
                                :class="{ 'selecionado': personagemSelecionado === index }"
                                @click="selecionarPersonagem(index)"
                                >
                                <img :src="personagem.image" :alt="personagem.name" class="personagem-img" @error="tratarErroImagem">
                            </button>
                            <div class="personagem-nome">{{ personagem.name }}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Tela do Jogo -->
                <div v-else class="tela-jogo-ativo"> <!-- Exibe se o jogo for iniciado -->
                    <div class="area-jogo">
                        <div class="display-jogador">
                            <img :src="personagens[personagemSelecionado].image" class="avatar-jogador">
                            {{ personagens[personagemSelecionado].name }}
                        </div>
                        <div class="palavras-caindo">
                            Palavras vão dropar aqui
                            
                        </div>
                    </div>
                    <div class="estatisticas-jogo">
                        <div>Pontuação: {{ pontuacao }}</div>
                        <div>Vidas: {{ vidas }}</div>
                    </div>
                </div>
                
                <div class="botoes-acao">
                    <button 
                        class="game-button" 
                        @click="iniciarJogo"
                        :disabled="personagemSelecionado === null"
                        >
                        {{ personagemSelecionado !== null ? 'Iniciar Jogo' : 'Selecione um Personagem' }}
                    </button>
                    <button class="game-button" @click="$emit('voltar')">
                        Voltar
                    </button>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script>
// importar as outras imagens dos personagens igualmente aqui | 2 de teste
import perinImg from '@/assets/characters/perin.jpg'
import marcosImg from '@/assets/characters/marcos.jpg'

export default {
    data() {
        return {
            // Setando todas as variaveis com seus valores iniciais antes do começo do jogo

            personagemSelecionado: null, // selecionado começa como falso -> não selecionado
            jogoIniciado: false, // Jogo iniciado começa falso -> não iniciado
            pontuacao: 0, // pontuação começa zerada
            vidas: 3, // 3 vidas para começar o jogo sempre
            palavrasAtivas: [], // palavras ativas começa com nenhuma
            personagens: [
                {name: 'Perin', type:'dev', image: perinImg}, // esses como exemplo para os outros
                {name: 'Marcos', type:'dev', image: marcosImg},
                {name: 'Andrezão', type:'dev'},
                {name: 'Gabe', type:'dev'},
                {name: 'Dig', type:'dev'},
                {name: 'Bernardo', type:'dev'},
            ],
            listaPalavras: ['Teste', 'Teste2', 'Teste3'] // palavras de teste
        }
    },
    methods: {
        selecionarPersonagem(index) {
            this.personagemSelecionado = index
        },

        iniciarJogo() {
            //alert('Jogo iniciado!'); // Aqui você pode disparar a lógica real de iniciar o jogo
            if (this.personagemSelecionado === null) return // se não tiver selecionado personagem, não começa

            this.jogoIniciado = true // aqui começa o jogo e reseta as variaveis para iniciar
            this.pontuacao = 0
            this.vidas = 3
            this.palavrasAtivas = []
        },
    }
}
</script>

<style scoped>
.selecao-personagem {
  width: 100%;
  text-align: center;
}

.botao-personagem {
  width: 120px;
  height: 120px;
  background: rgba(0, 255, 255, 0.1);
  border: 2px solid #00ffff;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.botao-personagem:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
}

.botao-personagem.selecionado {
  background: rgba(0, 255, 255, 0.3);
  border-color: #ff00ff;
  box-shadow: 0 0 20px #ff00ff;
}

.card-personagem {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.personagem-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.personagem-nome {
  color: #00ffff;
  margin-top: 10px;
  font-size: 1.1rem;
  text-shadow: 0 0 8px #00ffff;
}

.area-jogo {
  width: 1000px;
  height: 600px;
  margin: 0 auto; /* centraliza horizontalmente */
  border: 2px solid #00ffff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.display-jogador {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #00ffff;
  padding: 5px 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Minecraftia', sans-serif;
  text-shadow: 0 0 8px #00ffff;
}

.avatar-jogador {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.palavras-caindo {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.estatisticas-jogo {
  display: flex;
  justify-content: space-around;
  color: #00ffff;
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-family: 'Minecraftia', sans-serif;
  text-shadow: 0 0 8px #00ffff;
}

.botoes-acao {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.game-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-button:disabled:hover {
  background-color: transparent;
  color: #00ffff;
  box-shadow: none;
}

</style>
    