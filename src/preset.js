import { create } from './index'
import _nesting from './addon/nesting'
import _prefixer from './addon/prefixer'
import _keyframes from './addon/keyframes'
import _rule from './addon/rule'
import _cache from './addon/cache'

const nano = create()

_cache(nano)
_nesting(nano)
_rule(nano)
_keyframes(nano)
_prefixer(nano)

const { rule, keyframes } = nano

export default nano

export { rule, keyframes }