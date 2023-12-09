export function removeAccents(value: string) {
  // return value.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
  // Keep German umlauts
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u0307\u0309-\u036F]/g, '') // Exclude combining diaeresis
    .normalize('NFC')
}
