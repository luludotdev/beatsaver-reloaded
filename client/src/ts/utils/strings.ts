export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const automapperName: (input: string) => string = input => {
  if (input === 'beatsage') return 'BeatSage'
  if (input === 'deepsaber') return 'DeepSaber'

  return capitalize(input)
}
