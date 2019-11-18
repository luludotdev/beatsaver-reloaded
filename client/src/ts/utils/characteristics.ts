export const parseCharacteristics: (
  chars: IBeatmapCharacteristic[]
) => IBeatmapCharacteristic[] = chars => {
  return chars.map(({ name, ...rest }) => {

    let newName = ""

    if (name) {
      newName = name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim()
        .replace(/(  )/g, ' ')
    } else {
      newName = chars
    }

    return { name: newName, ...rest }
  })
}
