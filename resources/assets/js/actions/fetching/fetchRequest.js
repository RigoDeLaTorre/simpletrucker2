import { IS_FETCHING_REQUEST } from '../types'

export const fetchRequest = (payload = 'wut') => {
  return {
    type: IS_FETCHING_REQUEST,
    payload
  }
}
