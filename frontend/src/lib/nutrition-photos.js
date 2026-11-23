const DB_NAME = 'opengym-nutrition-photos'
const STORE = 'photos'
let opening

function database() {
  if (!opening) {
    opening = new Promise((resolve, reject) => {
      if (!globalThis.indexedDB) {
        reject(new Error('Photo storage is unavailable in this browser.'))
        return
      }
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE)
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Could not open photo storage.'))
      request.onblocked = () => reject(new Error('Photo storage is busy in another tab. Close other app tabs and try again.'))
    }).catch(error => {
      opening = null
      throw error
    })
  }
  return opening
}

function transact(mode, action) {
  return database().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = action(tx.objectStore(STORE))
    let result = null
    request.onsuccess = () => { result = request.result ?? null }
    request.onerror = () => reject(request.error || new Error('Could not access the saved meal photo.'))
    tx.oncomplete = () => resolve(result)
    tx.onerror = () => reject(tx.error || new Error('Could not access the saved meal photo.'))
    tx.onabort = () => reject(tx.error || new Error('Photo storage transaction was aborted.'))
  }))
}

export const saveNutritionPhoto = (id, blob) => transact('readwrite', store => store.put(blob, id))
export const loadNutritionPhoto = id => transact('readonly', store => store.get(id))
export const removeNutritionPhoto = id => transact('readwrite', store => store.delete(id))

async function imageBitmap(file) {
  if (globalThis.createImageBitmap) {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }) } catch { /* use the browser image decoder below */ }
  }
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function compressNutritionPhoto(file) {
  if (!(file instanceof Blob) || !file.type.startsWith('image/')) throw new Error('Choose an image file for the meal photo.')
  if (file.size > 20 * 1024 * 1024) throw new Error('Meal photos must be 20 MB or smaller.')
  const image = await imageBitmap(file)
  const scale = Math.min(1, 960 / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.width * scale))
  canvas.height = Math.max(1, Math.round(image.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('This browser could not prepare the meal photo.')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  if (typeof image.close === 'function') image.close()
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error('This browser could not compress the meal photo.'))
    }, 'image/jpeg', 0.78)
  })
}
