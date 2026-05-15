import { useEffect, useRef } from 'react'

export default function NeuralBg() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf, nodes = []

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      nodes = Array.from({ length: Math.floor(canvas.width * canvas.height / 18000) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
      })
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < 140) {
            ctx.strokeStyle = `rgba(96,165,250,${(1-d/140)*0.45})`
            ctx.lineWidth = 0.5
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke()
          }
        }
        ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 1.5, 0, Math.PI*2)
        ctx.fillStyle = i%3===0 ? 'rgba(167,139,250,0.6)' : 'rgba(96,165,250,0.6)'
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} id="neural" />
}
