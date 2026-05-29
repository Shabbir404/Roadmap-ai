import CareerRoadmapContent from './CareerRoadmapContent.jsx'

/** @deprecated Use /career route. Kept for compatibility if imported elsewhere. */
export default function CareerSheet({ career, topic, onClose, fromTemplate = false }) {
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} role="presentation" />
      <div className="sheet-page">
        <div className="sheet-handle" />
        <CareerRoadmapContent career={career} topic={topic} onClose={onClose} fromTemplate={fromTemplate} />
      </div>
    </>
  )
}
