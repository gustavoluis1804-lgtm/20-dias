import { useEffect, useRef, useState } from 'react';
import { gift, rooms, finalLetter, type Discovery, type FutureWish } from './content';
import { sounds } from './sounds';
import { Sky } from './Sky';
import {
  AnniversaryBadge,
  HugOverlay,
  NoteModal,
  FutureWindowModal,
  RadioVoiceModal,
  SurpriseKissModal,
  SouvenirCard,
  Portrait,
  PrintSheet,
} from './Overlays';

type Screen = 'entrance' | 'overview' | 'room' | 'ending';
type PrintMode = 'letter' | 'card';
const STORAGE_KEY = 'ana-gustavo-casa-v2';
const RING = 2 * Math.PI * 16;

/* ---------------- ícones ---------------- */
function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    spark: <path d="m12 3 2 6.2 6.2 2-6.2 2L12 20l-2-6.8-6.2-2 6.2-2L12 3Z" />,
    sound: <path d="M4 9v6h4l5 4V5L8 9H4Zm12-1a6 6 0 0 1 0 8" />,
    mute: <path d="M4 9v6h4l5 4V5L8 9H4Zm13 1 4 4m0-4-4 4" />,
    reset: <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />,
    print: <path d="M6 9V3h12v6M6 18H4V9h16v9h-2M6 14h12v7H6v-7Z" />,
    camera: (
      <>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* ---------------- ilustrações ---------------- */
function Art({ kind, photo }: { kind: string; photo?: string | null }) {
  const line = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const map: Record<string, React.ReactNode> = {
    clock: (
      <>
        <circle cx="50" cy="50" r="31" {...line} />
        <circle cx="50" cy="50" r="24" {...line} opacity=".35" />
        <path d="M50 50 61 57" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M50 50 30 46" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        <text x="50" y="76" textAnchor="middle" fill="currentColor" fontFamily="Georgia" fontSize="6.5">16:43</text>
      </>
    ),
    calendar: (
      <>
        <rect x="18" y="22" width="64" height="60" rx="4" {...line} />
        <path d="M18 39h64M34 16v12M66 16v12" {...line} />
        <text x="50" y="64" textAnchor="middle" fill="currentColor" fontFamily="Georgia" fontSize="24">12</text>
        <text x="50" y="75" textAnchor="middle" fill="currentColor" fontFamily="Arial" fontSize="5.5" letterSpacing="1.2">SET 2026</text>
      </>
    ),
    tickets: (
      <>
        <path d="m21 31 45-10 9 46-45 10z" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="2" />
        <path d="m31 27 46 8-8 45-46-8z" fill="currentColor" opacity=".08" stroke="currentColor" strokeWidth="2" />
        <path d="m39 45 24 4M36 55l23 4M35 65l14 2" {...line} />
      </>
    ),
    key: (
      <>
        <circle cx="32" cy="38" r="15" {...line} />
        <circle cx="32" cy="38" r="5" {...line} />
        <path d="m44 49 30 30 7-7-7-7-6 6-7-7 6-6-16-16" {...line} />
      </>
    ),
    cup: (
      <>
        <path d="M25 43h46v17c0 17-9 23-23 23S25 77 25 60V43ZM71 48h7c13 0 10 19-7 19M21 86h56" {...line} />
        <path d="M37 36c-9-9 8-11 0-21M51 36c-9-9 8-11 0-21" {...line} opacity=".75" />
        <text x="48" y="63" textAnchor="middle" fill="currentColor" fontSize="11" opacity=".7">♡</text>
      </>
    ),
    jar: (
      <>
        <path d="M32 30h36l5 12v37c0 5-4 8-9 8H36c-5 0-9-3-9-8V42zM30 22h40v8H30z" {...line} />
        <path d="M38 52l8 3 5-4 9 3 5-5M38 65l8 3 8-3 9 2" {...line} />
        <path d="M43 45h14v12H43z" fill="currentColor" opacity=".2" stroke="currentColor" strokeWidth="1" />
      </>
    ),
    recipe: (
      <>
        <path d="m27 17 48 8-9 61-48-8z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="2" />
        <path d="m34 37 27 4M31 48l30 5M29 58l27 5M27 68l19 3" {...line} />
        <path d="M56 19c0-8 10-8 10 0 0-8 10-8 10 0 0 6-10 11-10 11S56 25 56 19" fill="currentColor" opacity=".75" />
      </>
    ),
    napkin: (
      <>
        <path d="M20 25h61L64 80H20z" fill="currentColor" opacity=".14" stroke="currentColor" strokeWidth="2" />
        <path d="M20 25 64 80M81 25 49 53M29 35h16" {...line} />
        <path d="M36 50l7-6 7 6" {...line} opacity=".6" />
      </>
    ),
    flower: (
      <>
        <path d="M50 84V47M50 82c-12-1-17-9-19-15 10 0 16 3 19 11M50 68c10-10 17-9 21-8-4 7-10 11-21 12" {...line} />
        <path
          d="M50 25c-8-17-19-10-17 0-16-6-19 8-9 15-13 8-5 21 7 18 1 15 17 17 20 4 9 12 23 6 21-7 15 0 21-14 9-21 9-13-1-23-14-17-4-14-17-16-17 8Z"
          fill="currentColor"
          opacity=".22"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="50" cy="40" r="9" fill="currentColor" opacity=".55" />
      </>
    ),
    frame: (
      <>
        <rect x="18" y="16" width="64" height="70" rx="3" {...line} />
        <rect x="25" y="23" width="50" height="56" rx="1" {...line} />
        {photo ? (
          <image href={photo} x="27" y="25" width="46" height="52" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <>
            <path d="M27 66c12-15 19-15 25-7 8-15 17-14 21-5M49 42c-6-10-15-5-10 2 3 5 10 9 10 9s8-5 10-10c4-8-7-11-10-1" {...line} />
            <circle cx="60" cy="36" r="4" fill="currentColor" />
          </>
        )}
      </>
    ),
    book: (
      <path
        d="M50 31c-13-9-25-8-37-3v47c12-5 25-6 37 3 12-9 25-8 37-3V28c-12-5-24-6-37 3ZM50 31v47M22 42c8-2 15-1 21 3M57 45c6-4 13-5 21-3M22 53c8-2 15-1 21 3M57 56c6-4 13-5 21-3"
        {...line}
      />
    ),
    radio: (
      <>
        <rect x="16" y="36" width="68" height="45" rx="9" {...line} />
        <path d="m24 36 48-20M27 48h24M27 56h24" {...line} />
        <circle cx="66" cy="59" r="12" {...line} />
        <circle cx="66" cy="59" r="4" fill="currentColor" />
      </>
    ),
    pillow: (
      <>
        <path d="M28 23c11 5 33 5 44 0 4 12 4 43 0 55-12-5-32-5-44 0-4-12-4-43 0-55Z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="2" />
        <path d="M36 34c8 3 20 3 28 0M36 67c8-3 20-3 28 0" {...line} />
        <path d="M50 45c-5-7-13-3-10 3 2 4 10 10 10 10s8-6 10-10c3-6-5-10-10-3Z" fill="currentColor" opacity=".55" />
      </>
    ),
    drawer: (
      <>
        <path d="M18 23h64v62H18zM18 44h64M18 64h64M24 14h52v9H24z" {...line} />
        <circle cx="50" cy="33" r="2.5" fill="currentColor" />
        <circle cx="50" cy="54" r="2.5" fill="currentColor" />
        <circle cx="50" cy="74" r="2.5" fill="currentColor" />
      </>
    ),
    letter: (
      <>
        <path d="M17 31h66v51H17z" fill="currentColor" opacity=".16" stroke="currentColor" strokeWidth="2" />
        <path d="m17 32 33 29 33-29M17 82l25-27M83 82 58 55M30 21h40v11H30zM42 27h17" {...line} />
      </>
    ),
    lamp: (
      <>
        <path d="M34 18h32l12 39H22z" fill="currentColor" opacity=".18" stroke="currentColor" strokeWidth="2" />
        <path d="M50 57v27M33 85h34M40 85l-5 5h30l-5-5" {...line} />
      </>
    ),
    box: <path d="M19 42h62v42H19zM14 32h72v12H14zM50 32v52M27 31c-18-12-3-25 11-14l12 15M73 31c18-12 3-25-11-14L50 32" {...line} />,
  };

  return (
    <svg className="art" viewBox="0 0 100 100" aria-hidden="true">
      {map[kind]}
    </svg>
  );
}

/* ---------------- app ---------------- */
export default function App() {
  const [screen, setScreen] = useState<Screen>('entrance');
  const [roomIndex, setRoomIndex] = useState(0);
  const [found, setFound] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(saved) ? saved.filter((id) => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [reading, setReading] = useState<Discovery | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [phase, setPhase] = useState(0);
  const [music, setMusic] = useState(false);

  const [hug, setHug] = useState(false);
  const [note, setNote] = useState(false);
  const [future, setFuture] = useState(false);
  const [souvenir, setSouvenir] = useState(false);
  const [radio, setRadio] = useState(false);
  const [kiss, setKiss] = useState(false);
  const [printMode, setPrintMode] = useState<PrintMode>('letter');
  const [openOverlay, setOpenOverlay] = useState<string | null>(null);

  const [wish, setWish] = useState<FutureWish | null>(() => {
    try {
      const saved = localStorage.getItem('ana-wish');
      return saved ? (JSON.parse(saved) as FutureWish) : null;
    } catch {
      return null;
    }
  });
  const [photo, setPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ana-photo') || gift.photoFile;
    } catch {
      return gift.photoFile;
    }
  });
  const [voice, setVoice] = useState<string | null>(() => {
    try {
      return localStorage.getItem('gustavo-voice') || gift.voiceAudioFile;
    } catch {
      return gift.voiceAudioFile;
    }
  });
  const [photoOk, setPhotoOk] = useState(true);

  /* Se o arquivo da foto não existir (ou falhar), voltamos para a ilustração */
  useEffect(() => {
    if (!photo) {
      setPhotoOk(true);
      return;
    }
    let alive = true;
    const probe = new window.Image();
    probe.onload = () => {
      if (alive) setPhotoOk(true);
    };
    probe.onerror = () => {
      if (alive) setPhotoOk(false);
    };
    probe.src = photo;
    return () => {
      alive = false;
    };
  }, [photo]);

  /* Devolve o foco ao botão que abriu o overlay */
  useEffect(() => {
    if (openOverlay) {
      lastTrigger.current = document.activeElement as HTMLElement | null;
    } else {
      lastTrigger.current?.focus();
      lastTrigger.current = null;
    }
  }, [openOverlay]);

  function open(name: string) {
    setOpenOverlay(name);
    setHint(null);
    setHighlight(null);
  }
  function close() {
    setOpenOverlay(null);
  }

  const audioRef = useRef<HTMLAudioElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const room = rooms[roomIndex];
  const roomFound = room.discoveries.filter((item) => found.includes(item.id)).length;
  const total = rooms.reduce((sum, item) => sum + item.discoveries.length, 0);
  const complete = found.length >= total;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {}
  }, [found]);

  useEffect(() => {
    if (reading) dialogRef.current?.focus();
    else lastTrigger.current?.focus();
  }, [reading]);

  useEffect(() => {
    if (!reading) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReading(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reading]);

  useEffect(() => {
    if (screen !== 'ending') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const steps = reduce ? [40, 80, 120] : [1800, 3400, 4800];
    const timers = steps.map((time, index) => window.setTimeout(() => setPhase(index + 1), time));
    return () => timers.forEach(window.clearTimeout);
  }, [screen]);

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function enter() {
    sounds.playEnter();
    setDoorOpen(true);
    window.setTimeout(() => setScreen('overview'), reduceMotion() ? 30 : 1000);
  }

  function openDiscovery(item: Discovery, event: React.MouseEvent<HTMLElement>) {
    lastTrigger.current = event.currentTarget;
    sounds.playChime();
    setReading(item);
    setFound((previous) => (previous.includes(item.id) ? previous : [...previous, item.id]));
    setHint(null);
    setHighlight(null);
  }

  function showHint() {
    const list = screen === 'room' ? room.discoveries : rooms.flatMap((item) => item.discoveries);
    const next = list.find((item) => !found.includes(item.id));
    if (!next) {
      setHint('Você encontrou todos os carinhos. A carta e o cartão estão esperando por você.');
      return;
    }
    if (screen !== 'room') {
      setRoomIndex(rooms.findIndex((item) => item.discoveries.some((entry) => entry.id === next.id)));
      setScreen('room');
    }
    setHighlight(next.id);
    setHint(next.hint + '.');
  }

  function goRoom(index: number) {
    setRoomIndex((index + rooms.length) % rooms.length);
    setHint(null);
    setHighlight(null);
  }

  function visitRoom(index: number) {
    setRoomIndex(index);
    setScreen('room');
    setHint(null);
    setHighlight(null);
  }

  function openEnding() {
    sounds.playChime();
    setReading(null);
    setPhase(0);
    setScreen('ending');
  }

  function restart() {
    if (!window.confirm('Recomeçar a visita e apagar os carinhos encontrados neste navegador?')) return;
    setFound([]);
    setReading(null);
    setHint(null);
    setHighlight(null);
    setDoorOpen(false);
    setScreen('entrance');
  }

  async function toggleMusic() {
    if (gift.audioFile && audioRef.current) {
      const audio = audioRef.current;
      if (music) {
        audio.pause();
        setMusic(false);
      } else {
        try {
          await audio.play();
          setMusic(true);
        } catch {
          setMusic(sounds.toggleAmbient());
        }
      }
      return;
    }
    setMusic(sounds.toggleAmbient());
  }

  function savePhoto(url: string) {
    setPhoto(url);
    setPhotoOk(true);
    try {
      localStorage.setItem('ana-photo', url);
    } catch {}
  }

  function uploadPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) savePhoto(result);
    };
    reader.readAsDataURL(file);
  }

  function saveWish(next: FutureWish) {
    setWish(next);
    try {
      localStorage.setItem('ana-wish', JSON.stringify(next));
    } catch {}
  }

  function saveVoice(url: string) {
    setVoice(url);
    try {
      localStorage.setItem('gustavo-voice', url);
    } catch {}
  }

  function printSheet(mode: PrintMode) {
    setPrintMode(mode);
    window.setTimeout(() => window.print(), 60);
  }

  const dockVisible = screen !== 'entrance' && !hug;

  return (
    <div className="app">
      {gift.audioFile && <audio ref={audioRef} src={gift.audioFile} loop preload="none" />}
      <div className="grain" aria-hidden="true" />

      <input ref={photoInput} type="file" accept="image/*" className="sr-only" onChange={uploadPhoto} />

      {/* ---------- cabeçalho ---------- */}
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('overview')} disabled={screen === 'entrance'} aria-label="Voltar para a visão geral">
          <span className="seal" aria-hidden="true">
            {gift.to.charAt(0)}
            <i>✦</i>
            {gift.from.charAt(0)}
          </span>
          <span className="brand-text">
            <b>Um lugar só nosso</b>
            <small>
              {gift.from} &amp; {gift.to} · vinte dias
            </small>
          </span>
        </button>

        <div className="topbar-side">
          {screen !== 'entrance' && (
            <p className="counter" aria-live="polite">
              <svg className="ring" viewBox="0 0 40 40" aria-hidden="true">
                <circle className="ring-track" cx="20" cy="20" r="16" />
                <circle
                  className="ring-fill"
                  cx="20"
                  cy="20"
                  r="16"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * (1 - found.length / total)}
                />
              </svg>
              <span>
                <strong>{found.length}</strong>/{total} carinhos
              </span>
            </p>
          )}
          <button className={`round-btn${music ? ' is-on' : ''}`} onClick={toggleMusic} aria-pressed={music} aria-label={music ? 'Desligar trilha suave' : 'Ligar trilha suave'}>
            <Icon name={music ? 'sound' : 'mute'} size={17} />
          </button>
        </div>
      </header>

      {/* ---------- 1. a porta ---------- */}
      {screen === 'entrance' && (
        <main className="page gate">
          <div className="gate-copy">
            <p className="kicker">
              <span aria-hidden="true">✦</span> para {gift.to}, de {gift.from}
            </p>
            <h1 className="foil">
              20 dias,
              <em>um lugar</em>
              só nosso<span className="gold">.</span>
            </h1>
            <p className="gate-lead">Eu ainda não tenho uma casa para te dar. Então construí um lugar com tudo o que sinto por você.</p>
            <div className="gate-actions">
              <button className="btn btn-seal" onClick={enter}>
                Posso entrar? <Icon name="arrow" size={17} />
              </button>
              <button className="btn btn-tape" onClick={() => { setHug(true); open('hug'); }}>
                Preciso de um abraço <span aria-hidden="true">🫂</span>
              </button>
            </div>
            <AnniversaryBadge />
            <p className="gate-note">Uma casa para explorar no seu tempo. Também funciona sem som.</p>
          </div>

          <div className="gate-frame">
            <div className={`door${doorOpen ? ' is-open' : ''}`} aria-hidden="true">
              <span className="door-star s1">✦</span>
              <span className="door-star s2">✧</span>
              <span className="door-star s3">✦</span>
              <span className="door-plant left">
                <i /><i /><i /><i /><i />
              </span>
              <span className="door-plant right">
                <i /><i /><i /><i /><i />
              </span>
              <span className="door-pool" />
              <span className="door-case">
                <span className="door-light" />
                <span className="door-leaf">
                  <span className="door-arch" />
                  <span className="door-name">{gift.to}</span>
                  <span className="door-rule a" />
                  <span className="door-rule b" />
                  <span className="door-knob" />
                </span>
              </span>
              <span className="door-step" />
            </div>
            <p className="gate-frame-note">a porta que eu deixei entreaberta para você</p>
          </div>
        </main>
      )}

      {/* ---------- 2. a casa ---------- */}
      {screen === 'overview' && (
        <main className="page home">
          <header className="home-head">
            <p className="kicker">a casa que nasceu de nós dois</p>
            <h1 className="foil">
              Bem-vinda, <em>{gift.to}.</em>
            </h1>
            <p>Cinco lugares, vinte carinhos escondidos. Entre por onde o coração quiser.</p>
          </header>

          <div className="home-grid">
            <section className="house" aria-label="Ambientes da casa">
              <Sky found={found.length} complete={complete} />

              <div className="roofline" aria-hidden="true">
                <span className="chimney">
                  <i />
                </span>
                <span className="roof">
                  <span className="roof-window">✦</span>
                </span>
              </div>

              <div className="rooms">
                {rooms.map((item, index) => {
                  const count = item.discoveries.filter((entry) => found.includes(entry.id)).length;
                  return (
                    <button
                      key={item.id}
                      className={`room${count === 4 ? ' is-lit' : count ? ' has-light' : ''}`}
                      onClick={() => visitRoom(index)}
                      aria-label={`${item.name}: ${count} de 4 carinhos`}
                    >
                      <span className="room-art" aria-hidden="true">
                        <Art kind={['key', 'cup', 'flower', 'book', 'lamp'][index]} />
                      </span>
                      <b>{item.name}</b>
                      <small>
                        0{index + 1} · {count}/4
                      </small>
                      {count === 4 && <i className="room-lit">iluminado ✦</i>}
                    </button>
                  );
                })}
              </div>

              <div className="ground" aria-hidden="true">
                <span>✿</span>
                <span>✿</span>
                <span>✿</span>
              </div>
            </section>

            <aside className="paper panel">
              <span className="tape tape-a" aria-hidden="true" />
              <p className="panel-hand">vinte</p>
              <p className="panel-note">
                Pequenas descobertas para lembrar que carinho também se constrói, um gesto de cada vez.
              </p>

              <ul className="checklist">
                {rooms.map((item, index) => {
                  const count = item.discoveries.filter((entry) => found.includes(entry.id)).length;
                  return (
                    <li key={item.id} className={count === 4 ? 'is-done' : ''}>
                      <button onClick={() => visitRoom(index)} aria-label={`${item.name}: ${count} de 4 carinhos`}>
                        <span className="check-name">{item.name}</span>
                        <span className="dots">
                          {item.discoveries.map((entry) => (
                            <i key={entry.id} className={found.includes(entry.id) ? 'on' : ''} />
                          ))}
                          <b>{count}/4</b>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="panel-links">
                <button className="link" onClick={showHint}>
                  Me mostra um carinho <Icon name="spark" size={15} />
                </button>
                <button className="link link-rose" onClick={() => { setNote(true); open('note'); }}>
                  💌 Escrever um bilhete
                </button>
                <button className="link link-sky" onClick={() => { setFuture(true); open('future'); }}>
                  🪟 {wish ? `Desejo: ${wish.title}` : 'Escolher um desejo'}
                </button>
                <button className="link link-gold" onClick={() => { setSouvenir(true); open('souvenir'); }}>
                  ✨ Cartão dos vinte dias
                </button>
                {complete && (
                  <button className="link link-gold is-strong" onClick={openEnding}>
                    ✦ Abrir nossa carta <Icon name="arrow" size={15} />
                  </button>
                )}
              </div>
            </aside>
          </div>

          <div className="home-foot">
            <p role="status">{hint || 'Toque em um ambiente para começar a explorar.'}</p>
            <button onClick={restart}>
              <Icon name="reset" size={14} /> Recomeçar
            </button>
          </div>
        </main>
      )}

      {/* ---------- 3. ambiente ---------- */}
      {screen === 'room' && (
        <main className="page stage" key={room.id}>
          <div className="stage-top">
            <button className="link" onClick={() => setScreen('overview')}>
              <Icon name="back" size={15} /> Visão geral
            </button>
            <div className="stage-tools">
              <button className="chip" onClick={() => { setFuture(true); open('future'); }}>
                🪟 {wish ? wish.icon : 'desejo'}
              </button>
              <button className="chip" onClick={() => { setNote(true); open('note'); }}>
                💌 bilhete
              </button>
              <span className="stage-index">
                0{roomIndex + 1} / 0{rooms.length}
              </span>
            </div>
          </div>

          <header className="stage-head">
            <p className="kicker">um cômodo para descobrir</p>
            <h2 className="foil">
              {room.name}
              <span className="gold">.</span>
            </h2>
            <p className="stage-intro">{room.intro}</p>
          </header>

          <section className={`plate plate-${room.id} tone-${roomFound}`} aria-label={`Objetos de ${room.name}`}>
            <div className="plate-inner">
              <div className="wall" aria-hidden="true">
                <span className="wall-arch" />
                <span className="wall-pendant" />
                <button
                  className="wall-window"
                  onClick={() => { setFuture(true); open('future'); }}
                  title="Toque para escolher um desejo"
                  aria-label="Janela para o futuro: escolher um desejo"
                >
                  <span className="window-moon" />
                  <span className="window-rain">⋮ ⋮ ⋮</span>
                  {wish && (
                    <span className="window-wish">
                      <b aria-hidden="true">{wish.icon}</b>
                      {wish.title}
                    </span>
                  )}
                </button>
                <span className="wall-vines">✧ ✦ ✧</span>
                {room.id === 'bedroom' && (
                  <span className="wall-stair">
                    <i />✉
                  </span>
                )}
                <span className="wall-portrait">
                  <Portrait photo={photoOk ? photo : null} onPhoto={savePhoto} onPick={() => photoInput.current?.click()} />
                </span>
              </div>

              <span className="plate-floor" aria-hidden="true" />
              <span className="plate-rug" aria-hidden="true" />
              {room.id === 'garden' && roomFound === 4 && (
                <span className="plate-bloom" aria-hidden="true">✿ ✦ ✿ ✧ ✿</span>
              )}

              <div className="shots">
                {room.discoveries.map((item) => {
                  const seen = found.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      className={`shot${seen ? ' is-found' : ''}${highlight === item.id ? ' is-hint' : ''}`}
                      onClick={(event) => openDiscovery(item, event)}
                      aria-label={`${item.name}${seen ? ', já encontrado: toque para reler' : ': toque para descobrir'}`}
                    >
                      <span className="shot-art">
                        <Art kind={item.kind} photo={item.kind === 'frame' && photoOk ? photo : null} />
                      </span>
                      <b>{item.name}</b>
                      <small aria-hidden="true">{seen ? '✓' : '✦'}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="stage-foot">
            <div>
              <p className="kicker">neste ambiente</p>
              <p className="stage-sub">
                {room.subtitle} <span>· {roomFound} de 4</span>
              </p>
            </div>
            <div className="stage-actions">
              {room.id === 'living' && (
                <>
                  <button className="chip" onClick={() => photoInput.current?.click()}>
                    <Icon name="camera" size={14} /> {photo ? 'trocar foto' : 'nossa foto'}
                  </button>
                  <button className="chip" onClick={() => { setRadio(true); open('radio'); }}>
                    📻 rádio
                  </button>
                </>
              )}
              <button className="link" onClick={showHint}>
                <Icon name="spark" size={15} /> Me mostra um carinho
              </button>
            </div>
          </div>

          {hint && (
            <p className="hint" role="status">
              Pista: {hint}
            </p>
          )}

          {!photoOk && room.id === 'living' && (
            <p className="photo-tip">
              para colocar nossa foto na moldura, salve o arquivo como <b>public/foto.jpg</b> — ou toque em “nossa foto”
            </p>
          )}

          <nav className="stage-nav" aria-label="Outros ambientes">
            <button onClick={() => goRoom(roomIndex - 1)}>
              <Icon name="back" size={15} /> Anterior
            </button>
            <span>
              {rooms.map((item, index) => (
                <button
                  key={item.id}
                  className={index === roomIndex ? 'is-current' : ''}
                  onClick={() => goRoom(index)}
                  aria-label={item.name}
                  aria-current={index === roomIndex ? 'page' : undefined}
                />
              ))}
            </span>
            <button onClick={() => goRoom(roomIndex + 1)}>
              Próximo <Icon name="arrow" size={15} />
            </button>
          </nav>
        </main>
      )}

      {/* ---------- 4. encerramento ---------- */}
      {screen === 'ending' && (
        <main className={`page finale phase-${phase}`}>
          {phase < 3 ? (
            <div className="cinema" role="status" aria-live="polite">
              <div className="cine-house" aria-hidden="true">
                <span className="cine-roof" />
                <span className="cine-body">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="cine-box" aria-hidden="true">
                <span className="cine-lid" />
                <span className="cine-ribbon-v" />
                <span className="cine-ribbon-h" />
                <span className="cine-bow">♡</span>
              </div>
              <p>
                {phase === 0
                  ? 'A casa inteira guarda todos os seus carinhos…'
                  : phase === 1
                  ? 'E cabe inteirinha em um pequeno presente…'
                  : `Feito só para você, ${gift.to}.`}
              </p>
            </div>
          ) : (
            <div className="letter-block">
              <p className="kicker">todos os {total} carinhos encontrados · de {gift.from}</p>
              <h2 className="foil">
                Uma carta para <em>{gift.to}.</em>
              </h2>

              <article className="paper letter">
                <span className="tape tape-b" aria-hidden="true" />
                <span className="letter-flower" aria-hidden="true">✿</span>
                <p className="letter-hello">Minha {gift.to},</p>
                {finalLetter.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="letter-sign">
                  com todo carinho,
                  <br />
                  <b>{gift.from}</b>
                </p>
                <span className="wax" aria-hidden="true">G</span>
              </article>

              <button className="teaser" onClick={() => { setKiss(true); open('kiss'); }}>
                <span aria-hidden="true">✨</span>
                <span className="teaser-text">Tem uma coisa que essa casa ainda não consegue fazer…</span>
                <span className="teaser-cta">tocar aqui</span>
              </button>

              <div className="finale-actions">
                <button className="btn btn-tape" onClick={() => { setSouvenir(true); open('souvenir'); }}>
                  ✨ Cartão de lembrança
                </button>
                <button className="btn btn-tape" onClick={() => setScreen('overview')}>
                  Quero passear por aqui de novo
                </button>
                <button className="btn btn-seal" onClick={() => printSheet('letter')}>
                  Guardar nossa carta <Icon name="print" size={16} />
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* ---------- leitura de um carinho ---------- */}
      {reading && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReading(null);
          }}
        >
          <div className="overlay-card" role="dialog" aria-modal="true" aria-label={reading.name} tabIndex={-1} ref={dialogRef}>
            <button className="overlay-close" aria-label="Fechar" onClick={() => setReading(null)}>
              ✕
            </button>
            <div className="overlay-art">
              <Art kind={reading.kind} photo={reading.kind === 'frame' && photoOk ? photo : null} />
            </div>
            <p className="kicker">
              um carinho de {gift.from} para {gift.to}
            </p>
            <h2>{reading.name}</h2>
            <p className="overlay-message">{reading.message}</p>
            <div className="overlay-foot">
              <span>
                {found.length} de {total} carinhos
              </span>
              {complete ? (
                <button className="link link-gold is-strong" onClick={openEnding}>
                  ✦ Abrir o presente <Icon name="arrow" size={15} />
                </button>
              ) : (
                <button className="link" onClick={() => setReading(null)}>
                  Continuar explorando <Icon name="arrow" size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------- experiências ---------- */}
      {hug && <HugOverlay onClose={() => { setHug(false); close(); }} />}
      {note && <NoteModal onClose={() => { setNote(false); close(); }} />}
      {future && <FutureWindowModal currentWishId={wish?.id ?? null} onSelect={saveWish} onClose={() => { setFuture(false); close(); }} />}
      {souvenir && <SouvenirCard photo={photoOk ? photo : null} onPrint={() => printSheet('card')} onClose={() => { setSouvenir(false); close(); }} />}
      {radio && <RadioVoiceModal voiceSrc={voice} onVoiceUpload={saveVoice} onClose={() => { setRadio(false); close(); }} />}
      {kiss && <SurpriseKissModal onClose={() => { setKiss(false); close(); }} />}

      {/* ---------- fita de cuidados ---------- */}
      {dockVisible && (
        <nav className="dock" aria-label="Cuidados da casa">
          <button className="dock-btn is-hug" onClick={() => { setHug(true); open('hug'); }} title="Um abraço" aria-label="Preciso de um abraço">
            <span aria-hidden="true">🫂</span>
            <i>abraço</i>
          </button>
          <button className="dock-btn" onClick={() => { setNote(true); open('note'); }} title="Escrever um bilhete" aria-label="Escrever um bilhete">
            <span aria-hidden="true">💌</span>
            <i>bilhete</i>
          </button>
          <button className="dock-btn" onClick={() => { setFuture(true); open('future'); }} title="Janela do futuro" aria-label="Escolher um desejo">
            <span aria-hidden="true">🪟</span>
            <i>desejo</i>
          </button>
          <button className="dock-btn" onClick={() => { setSouvenir(true); open('souvenir'); }} title="Cartão de lembrança" aria-label="Cartão de lembrança">
            <span aria-hidden="true">✨</span>
            <i>cartão</i>
          </button>
          <button className={`dock-btn${music ? ' is-on' : ''}`} onClick={toggleMusic} title="Trilha suave" aria-label="Ativar ou desligar a trilha suave">
            <span aria-hidden="true">🎵</span>
            <i>som</i>
          </button>
        </nav>
      )}

      <footer className="foot">
        <span>feito com carinho, por {gift.from}</span>
        <span>
          20 dias, um lugar só nosso <i aria-hidden="true">✦</i>
        </span>
      </footer>

      <PrintSheet mode={printMode} />
    </div>
  );
}
