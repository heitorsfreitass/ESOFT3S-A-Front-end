import { createApp } from 'vue'
import App from './App.vue'
import './assets/global.css' // Importando aqui para usar somente um arquivo de estilo, sem repetir código
import listaDePalavras from '@/assets/palavras.json'; // Importando aqui uma lista de palavras para cada fase


createApp(App).mount('#app')
