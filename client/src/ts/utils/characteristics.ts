export const parseCharacteristics: (
  chars: IBeatmapCharacteristic[]
) => IBeatmapCharacteristic[] = chars => {
  return chars.map(({ name, ...rest }) => {
    const newName = name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
      .replace(/(  )/g, ' ')

    return { name: newName, ...rest }
  })
}
