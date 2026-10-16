import pixel from './pixel.js'
import terminal from './terminal.js'
import orbit from './orbit.js'
import folio from './folio.js'
import shop from './shop.js'
import event from './event.js'

export const TEMPLATES = [pixel, terminal, orbit, folio, shop, event]
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id)
