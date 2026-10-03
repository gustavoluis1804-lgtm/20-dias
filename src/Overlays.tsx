import { useEffect, useRef, useState } from 'react';
import { gift, futureWishes, finalLetter, type FutureWish } from './content';

/* ============================================================
   Base compartilhada dos overlays
   ============================================================ */
function Overlay({
  label,
  onClose,
  children,
  wide,
}: {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      /* mantém o foco dentro do cartão */
      if (event.key !== 'Tab' || !cardRef.current) return;
      const controls = Array.from(
        cardRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((node) => node.offsetParent !== null);
      if (!controls.length) return;
      const first = controls[0] as HTMLElement;
      const last = controls[controls.length - 1] as HTMLElement;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === cardRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === cardRef.current)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`overlay-card${wide ? ' is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={cardRef}
      >
      <span className="tape tape-a" aria-hidden="true" />
        <button className="overlay-close" aria-label="Fechar" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

function OverlayHead({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <header className="overlay-head">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {lead && <p className="overlay-lead">{lead}</p>}
    </header>
  );
}

/* ============================================================
   Contador comemorativo
   ============================================================ */
function useElapsed() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const start = new Date(gift.anniversaryISO).getTime();
  const total = Math.max(0, Math.floor((now - start) / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

export function AnniversaryBadge() {
  const elapsed = useElapsed();
  return (
    <p className="anniversary-badge">
      <span className="badge-star" aria-hidden="true">✦</span>
      Desde 12/09/2026 às 16:43 · <strong>20 dias celebrados</strong>
      <span className="badge-live">{elapsed}</span>
    </p>
  );
}

/* ============================================================
   Abraço
   ============================================================ */
export function HugOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="hug-stage" role="dialog" aria-modal="true" aria-label="Um abraço de Gustavo">
      <span className="hug-glow hug-glow-a" aria-hidden="true" />
      <span className="hug-glow hug-glow-b" aria-hidden="true" />
      <div className="hug-card">
        <div className="hug-icons" aria-hidden="true">
          <span className="hug-spark">✦</span>
          <span className="hug-face">🫂</span>
          <span className="hug-spark">✦</span>
        </div>
        <p className="eyebrow">Seu abraço em forma de carinho</p>
        <h2>Fique aqui um instante, {gift.to}.</h2>
        <p className="hug-text">{gift.hugMessage}</p>
        <div className="hug-warm" aria-hidden="true">
          <span />feche os olhos e respire fundo<span />
        </div>
        <button className="btn btn-primary hug-btn" onClick={onClose}>
          Fiquei quentinha ♡
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Bilhete dela → WhatsApp
   ============================================================ */
export function NoteModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState(() => localStorage.getItem('ana-bilhete') || '');
  const [copied, setCopied] = useState(false);

  const ready = text.trim().length > 0;
  const message = `Oi, ${gift.from}! ❤️\n\nEstou na nossa casinha dos 20 dias e deixei este bilhetinho para você:\n\n"${text.trim()}"\n\nCom carinho,\n${gift.to} ✨`;

  function update(value: string) {
    setText(value);
    try {
      localStorage.setItem('ana-bilhete', value);
    } catch {}
  }

  function send() {
    const phone = (gift.whatsappNumber || '').replace(/\D/g, '');
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  }

  function copy() {
    navigator.clipboard?.writeText(message).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <Overlay label="Escrever um bilhete" onClose={onClose}>
      <div className="overlay-icon" aria-hidden="true">💌</div>
      <OverlayHead
        kicker="Um cantinho só seu"
        title={`Escreva para o ${gift.from}`}
        lead="Deixe aqui o que você está sentindo. Você revisa a mensagem antes de enviar."
      />
      <div className="note-sheet">
        <textarea
          className="note-input"
          value={text}
          onChange={(event) => update(event.target.value)}
          placeholder="Oi meu bem... nesses 20 dias eu..."
          rows={5}
        />
      </div>
      {ready && (
        <div className="note-preview">
          <span className="note-preview-label">Prévia do recado</span>
          <p>“{text.trim()}”</p>
        </div>
      )}
      <div className="overlay-actions">
        <button className="btn btn-whatsapp" onClick={send} disabled={!ready}>
          Enviar pelo WhatsApp 💬
        </button>
        <button className="btn btn-ghost" onClick={copy} disabled={!ready}>
          {copied ? 'Copiado ✓' : 'Copiar texto'}
        </button>
      </div>
    </Overlay>
  );
}

/* ============================================================
   Janela para o futuro
   ============================================================ */
export function FutureWindowModal({
  currentWishId,
  onSelect,
  onClose,
}: {
  currentWishId: string | null;
  onSelect: (wish: FutureWish) => void;
  onClose: () => void;
}) {
  return (
    <Overlay label="Escolher um desejo" onClose={onClose} wide>
      <div className="overlay-icon" aria-hidden="true">🪟</div>
      <OverlayHead
        kicker="Uma janela para o futuro"
        title="Qual é o nosso próximo momento?"
        lead="Escolha um desejo simples. Ele vai ficar desenhado na janela da nossa casa."
      />
      <div className="wish-grid">
        {futureWishes.map((wish) => (
          <button
            key={wish.id}
            className={`wish${currentWishId === wish.id ? ' is-selected' : ''}`}
            onClick={() => onSelect(wish)}
          >
            <span className="wish-icon" aria-hidden="true">{wish.icon}</span>
            <span className="wish-title">{wish.title}</span>
            <span className="wish-desc">{wish.description}</span>
            {currentWishId === wish.id && <span className="wish-tag">na janela ✦</span>}
          </button>
        ))}
      </div>
      <div className="overlay-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Guardar e voltar
        </button>
      </div>
    </Overlay>
  );
}

/* ============================================================
   Rádio com a sua voz
   ============================================================ */
export function RadioVoiceModal({
  voiceSrc,
  onVoiceUpload,
  onClose,
}: {
  voiceSrc: string | null;
  onVoiceUpload: (url: string) => void;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) onVoiceUpload(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <Overlay label="Rádio com a sua voz" onClose={onClose}>
      <div className="overlay-icon" aria-hidden="true">📻</div>
      <OverlayHead
        kicker="Sua voz escondida no rádio"
        title="Uma sintonia só nossa"
        lead="Este rádio antigo não toca qualquer estação: ele sintoniza a voz de quem mais te quer bem."
      />

      <div className="radio">
        <div className="radio-display">
          <span>FM 12.09</span>
          <span className={playing ? 'is-live' : ''}>{playing ? '● no ar' : '○ sintonizado'}</span>
        </div>
        <div className="radio-viz" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((bar) => (
            <span key={bar} className={playing ? 'is-on' : ''} style={{ animationDelay: `${bar * 0.09}s` }} />
          ))}
        </div>

        {voiceSrc ? (
          <>
            <audio ref={audioRef} src={voiceSrc} onEnded={() => setPlaying(false)} />
            <button className="btn btn-primary radio-btn" onClick={toggle}>
              {playing ? 'Pausar ❚❚' : 'Ouvir a mensagem ▶'}
            </button>
          </>
        ) : (
          <div className="radio-empty">
            <p className="radio-quote">
              “Mesmo no silêncio, tem companhia aqui. Não preciso preencher cada pausa para gostar de estar ao seu lado.”
            </p>
            <input ref={inputRef} type="file" accept="audio/*" className="sr-only" onChange={upload} />
            <button className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
              🎙️ Adicionar áudio com a voz
            </button>
          </div>
        )}
      </div>

      <div className="overlay-actions">
        <button className="btn btn-ghost" onClick={onClose}>
          Fechar o rádio
        </button>
      </div>
    </Overlay>
  );
}

/* ============================================================
   Surpresa depois da carta
   ============================================================ */
export function SurpriseKissModal({ onClose }: { onClose: () => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Overlay label="Uma surpresa" onClose={onClose}>
      {!revealed ? (
        <>
          <div className="overlay-icon" aria-hidden="true">✨</div>
          <OverlayHead
            kicker="Uma coisinha a mais"
            title="Tem uma coisa que essa casa ainda não consegue fazer…"
            lead="Ela guarda carinhos, luzes, flores e os nossos 20 dias inteiros. Mas faltava um gesto."
          />
          <div className="overlay-actions">
            <button className="btn btn-primary" onClick={() => setRevealed(true)}>
              O que é, meu amor?
            </button>
          </div>
        </>
      ) : (
        <div className="kiss">
          <div className="kiss-art" aria-hidden="true">
            <span className="kiss-spark">✨</span>
            <span className="kiss-lips">💋</span>
            <span className="kiss-spark">✨</span>
          </div>
          <p className="eyebrow">O que falta no mundo real</p>
          <h2>…te dar o beijo que eu queria te dar agora.</h2>
          <p className="kiss-lead">Recebe esse beijo bem cheio de vontade, até a gente se ver.</p>
          <div className="overlay-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Guardar no coração ♡
            </button>
          </div>
        </div>
      )}
    </Overlay>
  );
}

/* ============================================================
   Cartão de lembrança
   ============================================================ */
export function SouvenirCard({
  photo,
  onPrint,
  onClose,
}: {
  photo: string | null;
  onPrint: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function share() {
    const text = `20 dias, um lugar só nosso — ${gift.from} & ${gift.to} ✨`;
    if (navigator.share) {
      navigator.share({ title: text, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      });
    }
  }

  return (
    <Overlay label="Cartão de lembrança" onClose={onClose}>
      <div className="overlay-icon" aria-hidden="true">✨</div>
      <OverlayHead
        kicker="Uma lembrança para guardar"
        title="Cartão dos 20 dias"
        lead="Salve, imprima ou compartilhe este cartão feito para você."
      />

      <div className="card-sheet">
        <p className="card-stars" aria-hidden="true">✦ ✧ ✦</p>
        <p className="card-kicker">20 dias, um lugar só nosso</p>
        <p className="card-names">
          {gift.from} <span>&amp;</span> {gift.to}
        </p>
        <p className="card-date">12 de setembro de 2026 · 16:43</p>
        <div className="card-art">
          {photo ? (
            <img src={photo} alt={`${gift.from} e ${gift.to}`} />
          ) : (
            <span aria-hidden="true">🏡</span>
          )}
        </div>
        <p className="card-quote">
          “Vinte dias podem parecer pouco no calendário. Mas você já fez esse pedacinho da minha vida ter um lugar só seu.”
        </p>
        <div className="card-foot">
          <span>feito com carinho</span>
          <span className="card-seal">✦ 20 dias ✦</span>
        </div>
      </div>

      <div className="overlay-actions">
        <button className="btn btn-primary" onClick={onPrint}>
          Imprimir / Salvar PDF 🖨️
        </button>
        <button className="btn btn-ghost" onClick={share}>
          {copied ? 'Copiado ✓' : 'Compartilhar'}
        </button>
      </div>
    </Overlay>
  );
}

/* ============================================================
   Retrato no cenário
   ============================================================ */
export function Portrait({
  photo,
  onPhoto,
  onPick,
}: {
  photo: string | null;
  onPhoto: (url: string) => void;
  onPick?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) onPhoto(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <button
      className="portrait"
      onClick={() => (onPick ? onPick() : inputRef.current?.click())}
      title={photo ? 'Trocar nossa foto' : 'Colocar nossa foto'}
      aria-label={photo ? 'Trocar nossa foto no cenário' : 'Colocar nossa foto no cenário'}
    >
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={upload} />
      <span className="portrait-frame">{photo ? <img src={photo} alt="Nossa foto" /> : <span aria-hidden="true">👫</span>}</span>
    </button>
  );
}

/* ============================================================
   Folha de impressão (carta ou cartão)
   ============================================================ */
export function PrintSheet({ mode }: { mode: 'letter' | 'card' }) {
  if (mode === 'card') {
    return (
      <div className="print-sheet">
        <p className="print-kicker">20 dias, um lugar só nosso</p>
        <p className="print-names">
          {gift.from} <span>&amp;</span> {gift.to}
        </p>
        <p className="print-date">12 de setembro de 2026 · 16:43</p>
        <p className="print-quote">
          “Vinte dias podem parecer pouco no calendário. Mas você já fez esse pedacinho da minha vida ter um lugar só seu.”
        </p>
        <p className="print-sign">com carinho, {gift.from}</p>
      </div>
    );
  }
  return (
    <div className="print-sheet">
      <p className="print-kicker">Uma carta para {gift.to}</p>
      {[`Minha ${gift.to},`, ...finalLetter].map((paragraph, index) => (
        <p key={index} className="print-paragraph">
          {paragraph}
        </p>
      ))}
      <p className="print-sign">
        com todo carinho,
        <br />
        {gift.from}
      </p>
    </div>
  );
}
