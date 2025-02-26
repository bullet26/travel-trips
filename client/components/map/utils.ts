const getColors = (country: string): { color: string; offset: number }[] => {
  switch (country) {
    case 'Ukraine':
      return [
        { color: '#fad910', offset: 0 },
        { color: '#1863b7', offset: 1 },
      ]
    case 'Poland':
      return [
        { color: '#fff', offset: 0 },
        { color: '#dc143c', offset: 1 },
      ]
    case 'Deutschland':
      return [
        { color: '#ffce00', offset: 0 },
        { color: '#dd0000', offset: 0.5 },
        { color: '#000000', offset: 1 },
      ]
    case 'Israel':
      return [
        { color: '#fff', offset: 0 },
        { color: '#2b337d', offset: 1 },
      ]
    case 'Russia':
      return [
        { color: '#fff', offset: 0 },
        { color: '#001189', offset: 0.5 },
        { color: '#b90000', offset: 1 },
      ]
    case 'Turkey':
      return [
        { color: '#cc0914', offset: 0 },
        { color: '#fff', offset: 1 },
      ]
    default:
      return [
        { color: '#fff', offset: 0 },
        { color: '#000', offset: 1 },
      ]
  }
}

export const createGradientIcon = (country: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = 40
  canvas.height = 40
  const context = canvas.getContext('2d')

  if (!context) return ''

  const gradient = context.createRadialGradient(20, 20, 5, 20, 20, 15)

  getColors(country).forEach(({ color, offset }) => {
    gradient.addColorStop(offset, color)
  })

  context.beginPath()
  context.arc(20, 20, 15, 0, 2 * Math.PI)
  context.fillStyle = gradient
  context.fill()

  return canvas.toDataURL()
}
