import oc from './oc.js'
import couple from './couple.js'
import community from './community.js'
import home from './home.js'
import pixel from './pixel.js'
import terminal from './terminal.js'
import orbit from './orbit.js'
import folio from './folio.js'
import shop from './shop.js'
import event from './event.js'

export const TEMPLATES = [oc, couple, community, home, pixel, terminal, orbit, folio, shop, event]
export const GROUPS = ['덕질', '일반']
export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id)
