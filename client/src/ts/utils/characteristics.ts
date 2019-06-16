export const parseCharacteristics = (input: string[]) => {
  const chars = input.length === 0 ? ['Standard'] : input

  return chars.map(characteristic =>
    characteristic
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
      .replace(/(  )/g, ' ')
  )
}
