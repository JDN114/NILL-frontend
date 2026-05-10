import { forwardRef } from 'react'

export const ModuleCard = forwardRef(function ModuleCard({ tag, title, desc, stats }, ref) {
  return (
    <div ref={ref} className="iss-module-card">
      <div className="iss-module-tag">{tag}</div>
      <h3 className="iss-module-title">{title}</h3>
      <p className="iss-module-desc">{desc}</p>
      {stats && (
        <div className="iss-module-stats">
          {stats.map((s, i) => (
            <div key={i} className="iss-module-stat-item">
              <span className="iss-module-stat-num">{s.n}</span>
              <span className="iss-module-stat-lbl">{s.l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
