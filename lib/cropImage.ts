export type CroppedAreaPixels = {
  width: number
  height: number
  x: number
  y: number
}

function createImage(imageSrc: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = imageSrc
  })
}

export async function getCroppedImageDataUrl(
  imageSrc: string,
  crop: CroppedAreaPixels,
  makeCircleMask: boolean = true,
  mimeType: string = 'image/png',
  quality: number = 0.92
): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  canvas.width = crop.width
  canvas.height = crop.height

  if (makeCircleMask) {
    ctx.save()
    ctx.beginPath()
    const radius = Math.min(crop.width, crop.height) / 2
    ctx.arc(crop.width / 2, crop.height / 2, radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  if (makeCircleMask) {
    ctx.restore()
  }

  return canvas.toDataURL(mimeType, quality)
}

export async function getCroppedImageBlob(
  imageSrc: string,
  crop: CroppedAreaPixels,
  makeCircleMask: boolean = true,
  mimeType: string = 'image/png',
  quality: number = 0.92
): Promise<Blob> {
  const dataUrl = await getCroppedImageDataUrl(imageSrc, crop, makeCircleMask, mimeType, quality)
  const res = await fetch(dataUrl)
  return await res.blob()
}


