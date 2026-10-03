// Edite este arquivo para personalizar o presente. Coloque os arquivos opcionais em public/.
export const gift = {
  from: 'Gustavo',
  to: 'Ana',
  anniversaryDate: '12 de setembro de 2026',
  anniversaryTime: '16:43',
  anniversaryISO: '2026-09-12T16:43:00-03:00', // America/Sao_Paulo (12/09/2026 às 16:43)
  photoFile: 'foto.jpg' as string | null, // Coloque a foto de vocês em public/foto.jpg
  audioFile: null as string | null, // Exemplo: 'trilha.mp3'
  voiceAudioFile: null as string | null, // Exemplo: 'voz-gustavo.mp3' (áudio de voz falada para o rádio)
  whatsappNumber: '' as string, // Exemplo: '5511999999999' (opcional, para enviar o bilhete da Ana)
  hugMessage: 'Queria poder te abraçar agora mesmo, te puxar para perto e te lembrar que você é o lugar onde meu coração fica mais em paz. Imagina meu abraço bem demorado em você, bem quentinho.',
};

export type FutureWish = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const futureWishes: FutureWish[] = [
  { id: 'movie', title: 'Ver um filme juntinhos', description: 'Cobertor quentinho, pipoca e nós dois abraçados no sofá.', icon: '🎬' },
  { id: 'cook', title: 'Cozinhar juntos', description: 'Colocar uma música gostosa, errar a receita e rir da bagunça.', icon: '🍝' },
  { id: 'walk', title: 'Passear de mãos dadas', description: 'Caminhar sem pressa no fim de tarde só curtindo a sua companhia.', icon: '✨' },
  { id: 'stargaze', title: 'Olhar as estrelas', description: 'Deitar sob o céu calmo conversando sobre tudo e nada.', icon: '🌌' },
];

export type Discovery = { id: string; name: string; message: string; kind: string; hint: string };
export type Room = { id: string; name: string; subtitle: string; intro: string; discoveries: Discovery[] };

export const rooms: Room[] = [
  {
    id: 'hall', name: 'O hall do começo', subtitle: 'Onde o tempo ganhou outro sentido',
    intro: 'Toda casa tem uma primeira porta. A nossa começou naquele instante.',
    discoveries: [
      { id: 'clock', name: 'Relógio', kind: 'clock', hint: 'O tempo também guarda histórias', message: 'Às 16:43, no dia 12 de setembro de 2026, a gente disse sim para esse começo. Gosto de pensar que o relógio ficou aqui para guardar esse instante com cuidado.' },
      { id: 'calendar', name: 'Calendário', kind: 'calendar', hint: 'Uma data ficou marcada', message: '12 de setembro de 2026. Não preciso saber tudo o que vem depois para ter certeza de uma coisa: sou feliz por ter começado isso com você.' },
      { id: 'tickets', name: 'Dois bilhetes', kind: 'tickets', hint: 'Há palavras dobradas no canto', message: 'Um bilhete diz “fica mais um pouco”. O outro diz “eu também quero”. Acho bonito que a nossa história possa ser feita de vontades pequenas e compartilhadas.' },
      { id: 'key', name: 'Chave', kind: 'key', hint: 'Uma chave espera por você', message: 'Você chegou e algumas coisas aqui dentro encontraram seu lugar.' },
    ],
  },
  {
    id: 'kitchen', name: 'A cozinha dos pequenos cuidados', subtitle: 'O carinho mora nas coisas simples',
    intro: 'Aqui, estar junto é o ingrediente que faz diferença.',
    discoveries: [
      { id: 'cup', name: 'Xícara', kind: 'cup', hint: 'Repare no vapor da xícara', message: 'Se eu pudesse servir um pouco de aconchego numa xícara, colocaria nela a vontade de ficar perto de você, mesmo nos dias mais comuns.' },
      { id: 'jar', name: 'Potinho de recados', kind: 'jar', hint: 'Há palavras dentro do pote', message: 'Um recadinho para quando você precisar: gosto de te dar atenção, de ouvir o que você tem a dizer e de encontrar tempo para nós dois.' },
      { id: 'recipe', name: 'Receita de carinho', kind: 'recipe', hint: 'Uma receita está à espera', message: 'Nossa receita ainda está sendo escrita: uma medida de paciência, duas de presença e a liberdade de descobrir, juntos, o que faz bem para nós.' },
      { id: 'napkin', name: 'Guardanapo', kind: 'napkin', hint: 'O guardanapo está dobrado', message: 'Não quero que a beleza dos dias simples passe despercebida. Às vezes, o melhor plano é só dividir o momento com você.' },
    ],
  },
  {
    id: 'garden', name: 'O jardim do que cresce', subtitle: 'Cada cuidado é uma flor nova',
    intro: 'Flores de papel não precisam ter pressa para florescer.',
    discoveries: [
      { id: 'respect', name: 'Flor do respeito', kind: 'flower', hint: 'Toque uma flor de papel', message: 'Quero que a gente tenha espaço para ser quem é. Cuidar do que estamos construindo também é respeitar o tempo e o jeito um do outro.' },
      { id: 'trust', name: 'Flor da confiança', kind: 'flower', hint: 'Outra flor guarda uma palavra', message: 'A confiança, para mim, cresce nos gestos de todo dia. Quero ser alguém com quem você possa contar, sem precisar adivinhar o que sinto.' },
      { id: 'care', name: 'Flor do cuidado', kind: 'flower', hint: 'Há mais pétalas para abrir', message: 'Eu gosto da ideia de cuidar de você sem te prender: estar por perto, perguntar como foi seu dia e lembrar que seu coração merece delicadeza.' },
      { id: 'growth', name: 'Flor do crescimento', kind: 'flower', hint: 'A última flor também floresce', message: 'Que a gente continue aprendendo a estar junto. Não precisamos crescer depressa; só seguir escolhendo cuidar desse começo.' },
    ],
  },
  {
    id: 'living', name: 'A sala do nosso jeito', subtitle: 'Um lugar para sermos nós',
    intro: 'Ainda há muito espaço para as histórias que vamos escolher viver.',
    discoveries: [
      { id: 'frame', name: 'Moldura', kind: 'frame', hint: 'A moldura guarda um espaço nosso', message: 'Deixei este lugar para uma foto nossa. Por enquanto, ele guarda a imagem mais bonita que consigo imaginar: nós dois tendo tempo para estar perto.' },
      { id: 'book', name: 'Livro', kind: 'book', hint: 'Abra uma página do livro', message: 'Este livro não precisa de um final escrito agora. Gosto de virar as páginas devagar com você e descobrir o que a gente pode construir.' },
      { id: 'radio', name: 'Rádio', kind: 'radio', hint: 'O rádio tem algo a dizer', message: 'Mesmo no silêncio, tem companhia aqui. Quero que você saiba que não preciso preencher cada pausa para gostar de estar ao seu lado.' },
      { id: 'pillow', name: 'Almofada', kind: 'pillow', hint: 'Há algo debaixo da almofada', message: 'Bilhete escondido: se o dia estiver pesado, espero que este cantinho te lembre que você pode encontrar acolhimento comigo.' },
    ],
  },
  {
    id: 'bedroom', name: 'O quarto das palavras guardadas', subtitle: 'Para ler quando quiser ficar um pouco',
    intro: 'Algumas palavras pedem uma luz baixa e um lugar tranquilo.',
    discoveries: [
      { id: 'drawer', name: 'Gaveta de elogios', kind: 'drawer', hint: 'A gaveta pode ser aberta', message: 'Eu admiro a pessoa que estou conhecendo em você. E gosto, especialmente, de como me sinto à vontade para descobrir mais, um dia de cada vez.' },
      { id: 'folded-letter', name: 'Carta dobrada', kind: 'letter', hint: 'Uma carta foi dobrada com cuidado', message: 'Ana, estes primeiros 20 dias me deram uma vontade bonita de estar perto. Não para apressar o futuro, mas para aproveitar de verdade o presente com você.' },
      { id: 'lamp', name: 'Luminária', kind: 'lamp', hint: 'A luz pode acender', message: 'Se alguma noite parecer escura, queria poder te oferecer uma luz pequena: a certeza de que eu me importo e quero te escutar.' },
      { id: 'last-box', name: 'Caixinha', kind: 'box', hint: 'Uma caixinha espera no canto', message: 'Esta casa impossível existe porque você já tem um lugar muito real no meu carinho. Obrigado por dividir comigo o começo da nossa história.' },
    ],
  },
];

export const finalLetter = [
  'Ana, eu quis te dar um lugar que não coubesse em uma prateleira. Então fui juntando estes primeiros dias, os pensamentos que me fazem sorrir e a vontade de estar perto de você. Foi assim que esta casinha apareceu.',
  'Ainda estamos no começo, e isso é uma das partes mais bonitas. Gosto de saber que podemos descobrir, com calma, o jeito que é só nosso de dividir os dias, as conversas e até os silêncios.',
  'Não sei desenhar o futuro inteiro. Mas sei que quero cuidar do que existe agora: te ouvir, te respeitar, estar presente e construir com você algo que faça bem para nós dois.',
  'Vinte dias podem parecer pouco no calendário. Mas você já fez esse pedacinho da minha vida ter um lugar só seu.',
];