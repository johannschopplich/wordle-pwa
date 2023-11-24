export function removeAccents(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}
