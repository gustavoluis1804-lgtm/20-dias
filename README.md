# 20 dias, um lugar só nosso

Presente interativo de Gustavo para Ana: uma casa imaginária com 5 ambientes e 20 carinhos escondidos.

## Foto de vocês

Coloque a foto em **`public/foto.jpg`** (horizontal, proporção próxima de 3:2, até ~1,5 MB).
O site já aponta para esse caminho (`photoFile: 'foto.jpg'` em `src/content.ts`).

Enquanto o arquivo não existir, a moldura mostra uma ilustração — sem quebrar nada.
Assim que você salvar o `foto.jpg`, ela aparece na **moldura da sala**, no **porta-retrato dos cômodos**,
no **cartão de lembrança** e na **folha de impressão**.

Você também pode trocar a foto direto no site, pelo botão **“nossa foto”** na sala ou pelo
porta-retrato nos cômodos (a imagem fica salva no navegador).

## Voz do Gustavo no rádio

Coloque a gravação em `public/voz-gustavo.mp3` e defina `voiceAudioFile: 'voz-gustavo.mp3'`
em `src/content.ts`. Ou carregue o áudio pelo próprio rádio, dentro do site.

## Trilha instrumental

Coloque `public/trilha.mp3` e defina `audioFile: 'trilha.mp3'`. Sem arquivo, o site gera uma
trilha ambiente suave e discreta via Web Audio API — a experiência funciona sem som algum.

## Bilhete da Ana → WhatsApp

Em `src/content.ts`, defina `whatsappNumber: '5511999999999'` (com DDI). Assim o bilhete dela já
vai endereçado. Deixando vazio, o WhatsApp abre para ela escolher o contato.

## Mensagens e carta

Tudo em `src/content.ts`: as 20 mensagens (`rooms`), a carta final (`finalLetter`),
a mensagem do abraço (`hugMessage`), os desejos da janela do futuro (`futureWishes`) e a data
(`anniversaryISO` — 12/09/2026 às 16:43, fuso America/Sao_Paulo).

## Publicar no GitHub Pages

1. `npm install` e `npm run build`.
2. `node scripts/make-zip.mjs` → gera `site-ana-gustavo.zip` com `index.html` na raiz.
3. Publique o conteúdo de `dist/` (ou extraia o ZIP) na raiz do repositório e ative
   **Settings → Pages** com a branch e a pasta `/ (root)`.

## Acessibilidade

Navegação por teclado (Tab / Esc), foco visível, foco retido e devolvido nos modais,
`prefers-reduced-motion`, alto contraste e layout pensado primeiro para o celular.
O progresso fica salvo no navegador e pode ser apagado em “Recomeçar”.
