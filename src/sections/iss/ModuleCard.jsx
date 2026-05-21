import { forwardRef } from 'react'

function renderTitle(raw) {
  if (!raw) return null
  return raw.split(/(<em>[^<]*<\/em>|\n)/g).map((part, i) => {
    if (part === '\n') return <br key={i} />
    const m = part.match(/^<em>([^<]*)<\/em>$/)
    if (m) return <em key={i}>{m[1]}</em>
    return part || null
  })
}

export const ModuleCard = forwardRef(function ModuleCard(
  { index = 0, total = 3, tag, title, description, stats, position = 'tr', state = 'future' },
  ref,
) {
  const cls = [
    'iss-card',
    `pos-${position}`,
    state === 'active' ? 'is-active' : '',
    state === 'past' ? 'is-past' : '',
  ].filter(Boolean).join(' ')

  return (
    <article ref={ref} className={cls} aria-hidden={state !== 'active'}>
      <div className="iss-card-index">
        <em>{String(index + 1).padStart(2, '0')}</em>
        <span>/</span>
        <span>{String(total).padStart(2, '0')}</span>
      </div>
      {tag && <div className="iss-card-tag">{tag}</div>}
      {title && <h3>{renderTitle(title)}</h3>}
      {description && <p>{description}</p>}
      {stats && stats.length > 0 && (
        <div className="iss-card-stats">
          {stats.map(([n, l], i) => (
            <div key={i} className="iss-card-stat">
              <span className="iss-card-stat-num">{n}</span>
              <span className="iss-card-stat-lbl">{l}</span>
            </div>
          ))}
        </div>
      )}
    </article>
  )
})
