export const countObjectProperties = (obj: any) => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length
  }
  return 0
}
