import { IS_FETCHING_COMPLETE } from '../types'

export const fetchComplete = () => {
  return {
    type: IS_FETCHING_COMPLETE
  }
}
