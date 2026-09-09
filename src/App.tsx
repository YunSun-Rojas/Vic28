import { useState, useRef, useEffect } from 'react'
import './App.css'

interface MemoryData {
  title: string
  subtitle: string
  text: string
  items: Array<{
    image: string
    caption: string
    note?: string
  }>
}

const memoryDetails: Record<1 | 2 | 3, MemoryData> = {
  1: {
    title: '1 a 6 MESES',
    subtitle: 'Nuestros primeros momentos',
    text: 'Desde nuestra primera cita hasta nuestros primeros meses juntos.',
    items: [
      { image: '/fotos/recuerdo-1.jpg', caption: 'Nuestra Primera Cita ♡', note: 'Algo tan innesperado, gracioso, especial. Aun lo recuerdo como si fuera ayer.' },
      { image: '/fotos/recuerdo-2.jpg', caption: 'Un 06/06/25', note: 'El inicio de nuestra historia, donde todo comenzó. Nunca olvidaré lo nervioso que estabas...' },
      { image: '/fotos/recuerdo-3.jpg', caption: '1er mesesito', note: 'Recuerdo que en la noche me sorprendiste con unas flores y me dijiste "Tenía muchas ganas de regalarte flores" estaba alucinando tooodo!' },
      { image: '/fotos/recuerdo-4.jpg', caption: '2do mesesito', note: 'Simplemente uno de los momentos más especiales. Risas y a la vez enojos por tu culpa jiji' },
      { image: '/fotos/recuerdo-8.jpg', caption: '3er mesesito', note: 'Empezaste a conocer mi mundo, y lo aceptaste. Y hasta el dia de hoy te lo agradezco mi amor.' },
      { image: '/fotos/recuerdo-7.jpg', caption: '4to mesesito', note: 'Hubo meses en los que, solo podiamos ir al parquesito a conversar, y son uno de los mejores días para mi. Porque podiamos reir y hablar de cualquier cosa, solo tu y yo.' },
      { image: '/fotos/recuerdo-6.jpg', caption: '5to mesesito', note: 'Sin palabras JAJAJA. Acabó mal, pero bien. Cosas que solo tu y yo entenderemos jiji' },
      { image: '/fotos/recuerdo-5.jpg', caption: '6to mesesito', note: 'Nuestra primera Navidad juntosss. E iremos por otro <3' },
    ]
  },
  2: {
    title: '7 a 12 MESES',
    subtitle: 'Momentos inolvidables de yun y vic',
    text: 'Cada mes guarda una historia especial.',
    items: [
        { image: '/fotos/recuerdo-9.jpg', caption: '7mo mesesito'  },
        { image: '/fotos/recuerdo-10.jpg', caption: '8vo mesesito' },
        { image: '/fotos/recuerdo-11.jpg', caption: '9no mesesito' },
        { image: '/fotos/recuerdo-12.jpg', caption: '10mo mesesito' },
        { image: '/fotos/recuerdo-13.jpg', caption: '11vo mesesito' },
        { image: '/fotos/recuerdo-14.jpg', caption: '1er añito' },
        { image: '/fotos/recuerdo-15.jpg', caption: '1er añito x2'},
        { image: '/fotos/recuerdo-16.jpg', caption: 'MIO' },
    ]
  },
  3: {
    title: '1 AÑO Y 3 MESES',
    subtitle: 'Nuestro presente hermoso',
    text: 'El camino que seguimos recorriendo juntos hoy en día. Eres la persona con la que quiero pasar el resto de mi vida.',
    items: [
        { image: '/fotos/recuerdo-17.jpg', caption: 'Mio' },
        { image: '/fotos/recuerdo-18.jpg', caption: 'Quino de mi cuñis' },
        { image: '/fotos/recuerdo-19.jpg', caption: 'Nuestro primer congreso juntos' },
        { image: '/fotos/recuerdo-20.jpg', caption: 'Mi bebé hermoso <3' },
        { image: '/fotos/recuerdo-21.jpg', caption: 'que?' },
        { image: '/fotos/recuerdo-22.jpg', caption: 'Nuestro primer concierto 🦁' },
        { image: '/fotos/recuerdo-23.jpg', caption: 'Primera vez yendo al circo juntoss' },
        { image: '/fotos/recuerdo-24.jpg', caption: 'Nuestro intento de broaster jiji' },
    ]
  }
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [openMemory, setOpenMemory] = useState<1 | 2 | 3 | null>(null)
  const [activeRotation, setActiveRotation] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  // Arrastre con mouse / touch para la galería 3D
  const isDragging = useRef(false)
  const startX = useRef(0)
  const currentRotation = useRef(0)

  const currentMemoryData = openMemory !== null ? memoryDetails[openMemory] : null
  const itemsCount = currentMemoryData?.items.length || 8
  const angleStep = 360 / itemsCount

  // Resetear rotación al abrir memoria
  useEffect(() => {
    if (openMemory !== null) {
      setActiveRotation(0)
      currentRotation.current = 0
      setActiveIndex(0)
    }
  }, [openMemory])

  useEffect(() => {
    if (openMemory === null) return

    const activeItemTimer = window.setInterval(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % itemsCount)
    }, 3500)

    return () => window.clearInterval(activeItemTimer)
  }, [openMemory, itemsCount])

  const rotateTo = (index: number) => {
    const targetAngle = -index * angleStep
    setActiveRotation(targetAngle)
    currentRotation.current = targetAngle
    setActiveIndex((index + itemsCount) % itemsCount)
  }

  // Eventos Drag / Swipe
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const deltaX = x - startX.current
    const newAngle = currentRotation.current + deltaX * 0.35
    setActiveRotation(newAngle)
  }

  const handleMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    currentRotation.current = activeRotation
    
    // Normalizar index activo
    let calculatedIndex = Math.round(-activeRotation / angleStep) % itemsCount
    if (calculatedIndex < 0) calculatedIndex += itemsCount
    setActiveIndex(calculatedIndex)
  }

  return (
    <main className="page-shell">
      <nav className="topbar" aria-label="Navegación principal">
        <span className="brand-mark">♡</span>
        <span className="brand-name">Para ti</span>
        <span className="topbar-note">hecho con muchisisisimo amor</span>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">una pequeña carta para</p>
          <h1><span>Mi amorcito bello</span><i>♡</i></h1>
          <p className="hero-intro">
            Holi mi amor, te escribo esta carta para decirte que eres la persona más especial en mi vida. Cada momento contigo es algo valioso que guardo en mi corazón. 
            Gracias a esta cartita, recordaremos nuestros momentos juntos y los que vendrán. Gracias por ser mi compañero, mi amigo y mi amor. Te amo con todo mi corazón mi bebé.
          </p>
          <button className="open-button" type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? 'Cerrar mi carta' : 'Abrir mi carta'} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="heart-outline">♡</div>
          <span className="sparkle sparkle-one">✦</span>
          <span className="sparkle sparkle-two">✦</span>
          <span className="scribble">V y Y <br /></span>
        </div>
      </section>

      <section className={`letter-section ${isOpen ? 'is-open' : ''}`}>
        <div className={`envelope-card ${isOpen ? 'is-open' : ''}`}>
          <span className="envelope-heart" aria-hidden="true">♥</span>
          <div className="envelope-flap" aria-hidden="true" />
          <div className={`letter-card ${isOpen ? 'is-open' : ''}`}>
            <div className="letter-head">
              <span className="tiny-heart">♥</span>
              <span>para que leas cuando pienses que no te amo jum</span>
              <span className="letter-date">08/09/2026</span>
            </div>
            <div className="letter-body">
              <p className="letter-greeting">Amor mio,</p>
              <p>
                Eres todo lo que siempre quise, gracias a todos los problemas que hemos pasado, 
                me he dado cuenta de que eres la persona con la que quiero pasar el resto de mi vida. Pues, hemos aprendido a sobrellevar
                nuestras diferencias y a apoyarnos mutuamente en los momentos difíciles. Cada día contigo es una nueva aventura, y no 
                puedo esperar a ver qué nos espera en el futuro.
              </p>
              <p>
                Prometo seguir amándote y apoyándote en todo lo que hagas, y asi poder crear una familia juntos. Casarnos, y vivir muchas 
                aventuras juntos cariño.
              </p>
              <p className="letter-signoff">De tu bebé.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="memories-section">
        <div className="section-label">Nuestros recuerdos...</div>
        <div className="memory-grid">
          <article className="memory-card memory-card-pink" role="button" tabIndex={0} onClick={() => setOpenMemory(1)}>
            <span className="memory-number">01</span>
            <h2>¡1 a 6 meses!</h2>
            <p>Dónde empezó todo... ¡Donde hubo más intercambios de ideas!</p>
            <span className="memory-icon">ϟ</span>
          </article>
          <article className="memory-card memory-card-cream" role="button" tabIndex={0} onClick={() => setOpenMemory(2)}>
            <span className="memory-number">02</span>
            <h2>7 a 12 meses</h2>
            <p>Todo empezó a tomar sentido, con risas y momentos inolvidables.</p>
            <span className="memory-icon">☼</span>
          </article>
          <article className="memory-card memory-card-red" role="button" tabIndex={0} onClick={() => setOpenMemory(3)}>
            <span className="memory-number">03</span>
            <h2>1 año y 3 meses</h2>
            <p>Nuestro presente.</p>
            <span className="memory-icon">♥</span>
          </article>
        </div>
      </section>

      <footer className="footer-note">
        <span>t amo, amor de mi vida.</span>
        <span className="footer-heart">♥</span>
        <span>De Yun · 2026</span>
      </footer>

      {/* --- MODAL DE GALERÍA CIRCULAR 3D --- */}
      {openMemory !== null && currentMemoryData && (
        <div className="circular-modal-overlay">
          <div className={`circular-modal-window ${openMemory === 2 || openMemory === 3 ? 'memory-two-gallery' : ''}`}>
            
            {/* Header del modal */}
            <div className="modal-header">
              <button className="back-btn" onClick={() => setOpenMemory(null)}>
                ← Volver
              </button>
              <div className="modal-title-group">
                <h2>{currentMemoryData.title}</h2>
                <p>{currentMemoryData.subtitle}</p>
              </div>
              <button className="close-btn" onClick={() => setOpenMemory(null)}>✕</button>
            </div>

            

            {/* Escena 3D Cilíndrica */}
            <div 
              className="gallery-3d-stage"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
              <div 
                className="gallery-3d-ring auto-spin"
                style={{ transform: `rotateY(${activeRotation}deg)` }}
              >
                {currentMemoryData.items.map((item, index) => {
                  const angle = index * angleStep
                  return (
                    <div 
                      key={index} 
                      className={`gallery-3d-card ${index === activeIndex ? 'is-active' : ''}`}
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(360px)`
                      }}
                      onClick={() => rotateTo(index)}
                    >
                      <div className="polaroid-inner">
                        {(openMemory === 2 || openMemory === 3) && (
                          <div className="polaroid-meta second-memory-heading">
                            <h3 className="second-memory-title">{item.caption}</h3>
                          </div>
                        )}
                        <div className="polaroid-photo-box">
                          {item.image ? (
                            <img src={item.image} alt={item.caption} />
                          ) : (
                            <div className="photo-placeholder">
                              <span>📸</span>
                              <p>Foto {index + 1}</p>
                            </div>
                          )}
                        </div>
                        {openMemory !== 2 && openMemory !== 3 && <div className="polaroid-meta">
                          <h3>{item.caption}</h3>
                          {item.note && <p className="polaroid-note">{item.note}</p>}
                        </div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Controles de Navegación y Descripción */}
            

          </div>
        </div>
      )}
    </main>
  )
}