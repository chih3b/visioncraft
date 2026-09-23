/* The detection reticle — corner brackets that frame a subject the way a CV
   model draws a bounding box (lifted from the app icon's alignment ticks).
   The signature motif of the page; used sparingly on focal moments. */
export default function Reticle({ children, bright = false, tags, className = '' }) {
  return (
    <div className={`lp-reticle ${bright ? 'lp-reticle-bright' : ''} ${className}`.trim()}>
      <span className="lp-corner lp-corner-tl" aria-hidden="true" />
      <span className="lp-corner lp-corner-tr" aria-hidden="true" />
      <span className="lp-corner lp-corner-bl" aria-hidden="true" />
      <span className="lp-corner lp-corner-br" aria-hidden="true" />
      {tags?.topLeft && (
        <span className="lp-tag lp-tag-tl" aria-hidden="true">
          <span className="lp-tag-dot" />
          {tags.topLeft}
        </span>
      )}
      {tags?.confidence && (
        <span className="lp-tag lp-tag-br" aria-hidden="true">
          conf {tags.confidence}
        </span>
      )}
      {children}
    </div>
  )
}
