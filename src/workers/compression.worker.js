/**
 * Image Compression Web Worker
 *
 * Receives: { file: File, id: number, maxDimension?: number, quality?: number }
 * Returns:  { id: number, blob: Blob, width: number, height: number }
 *    or:    { id: number, error: string }
 *
 * Key fixes:
 * - Blob is NOT transferable; removed from transfer list (structured clone handles it)
 * - Added smart resize to cap dimensions (saves compression time + bandwidth)
 * - ImageBitmap.close() called to free GPU memory
 */
self.onmessage = async (e) => {
  const { file, id, maxDimension = 2048, quality = 0.7 } = e.data

  let bitmap = null
  try {
    bitmap = await createImageBitmap(file)

    // Calculate resize dimensions — preserve aspect ratio
    let { width, height } = bitmap
    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height)
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }

    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality
    })

    // Send blob via structured clone (NOT in transfer list — Blob is not transferable)
    self.postMessage({ id, blob, width, height })
  } catch (err) {
    self.postMessage({ id, error: err.message })
  } finally {
    // Free GPU/memory resources
    if (bitmap) bitmap.close()
  }
}
