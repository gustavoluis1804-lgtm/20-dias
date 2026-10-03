// Céu dos 20 dias: 20 estrelas que acendem conforme os carinhos são encontrados.
// Quando as 20 estão acesas, elas se reorganizam e formam a constelação "G + A".

export type StarPoint = { x: number; y: number };

// Posições dispersas pelo céu (viewBox 100 x 40)
const SCATTERED: StarPoint[] = [
  { x: 6, y: 12 }, { x: 15, y: 30 }, { x: 22, y: 8 }, { x: 29, y: 22 },
  { x: 36, y: 34 }, { x: 44, y: 10 }, { x: 51, y: 27 }, { x: 58, y: 7 },
  { x: 64, y: 31 }, { x: 71, y: 15 }, { x: 78, y: 34 }, { x: 85, y: 9 },
  { x: 92, y: 24 }, { x: 10, y: 35 }, { x: 33, y: 5 }, { x: 47, y: 36 },
  { x: 67, y: 5 }, { x: 89, y: 36 }, { x: 20, y: 20 }, { x: 75, y: 21 },
];

// Constelação "G + A" (9 + 4 + 7 = 20 estrelas)
const CONSTELLATION: StarPoint[] = [
  // G
  { x: 30, y: 8 }, { x: 19, y: 8 }, { x: 12, y: 16 }, { x: 12, y: 26 },
  { x: 19, y: 33 }, { x: 30, y: 33 }, { x: 32, y: 25 }, { x: 32, y: 17 },
  { x: 24, y: 20 },
  // +
  { x: 48, y: 10 }, { x: 48, y: 30 }, { x: 41, y: 20 }, { x: 55, y: 20 },
  // A
  { x: 62, y: 33 }, { x: 68, y: 22 }, { x: 75, y: 7 }, { x: 82, y: 22 },
  { x: 88, y: 33 }, { x: 70, y: 25 }, { x: 81, y: 25 },
];

const LINES = {
  g: '30,8 19,8 12,16 12,26 19,33 30,33 32,25 32,17 24,20',
  a: '62,33 68,22 75,7 82,22 88,33',
};

export function Sky({ found, complete }: { found: number; complete: boolean }) {
  return (
    <div className="sky" role="img" aria-label={complete ? 'Céu com 20 estrelas formando G mais A' : `Céu dos 20 dias: ${found} de 20 estrelas acesas`}>
      <p className="sky-caption">
        {complete ? (
          <span className="sky-caption-full">✦ G + A ✦</span>
        ) : (
          <>
            Céu dos 20 dias · <strong>{found}</strong> de 20 estrelas acesas
          </>
        )}
      </p>

      <svg className="sky-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
        <g className={`sky-group sky-scattered ${complete ? 'is-hidden' : ''}`}>
          {SCATTERED.map((star, index) => (
            <circle
              key={`s${index}`}
              cx={star.x}
              cy={star.y}
              r={index < found ? 0.9 : 0.45}
              fill={index < found ? '#ffe6b8' : '#6b4f5a'}
              className={index < found ? 'is-lit' : 'is-dim'}
            />
          ))}
        </g>

        <g className={`sky-group sky-constellation ${complete ? 'is-shown' : ''}`}>
          <g className="sky-lines" fill="none" stroke="#e9c987" strokeWidth="0.25" strokeLinecap="round" opacity="0.8">
            <polyline points={LINES.g} />
            <line x1="48" y1="10" x2="48" y2="30" />
            <line x1="41" y1="20" x2="55" y2="20" />
            <polyline points={LINES.a} />
            <line x1="70" y1="25" x2="81" y2="25" />
          </g>
          {CONSTELLATION.map((star, index) => (
            <g key={`c${index}`} className="sky-star">
              <circle cx={star.x} cy={star.y} r="1.5" fill="#ffd9a0" opacity="0.35" />
              <circle cx={star.x} cy={star.y} r="0.75" fill="#fffaf2" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
