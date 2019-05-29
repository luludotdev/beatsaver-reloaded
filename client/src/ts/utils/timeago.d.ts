interface Locale {}

declare module 'javascript-time-ago' {
  export default class TimeAgo {
    constructor(locale: string)

    public static addLocale(locale: Locale): void
    public format(time: Date | number): string
  }
}

declare module 'javascript-time-ago/locale/en' {
  const locale: Locale
  export default locale
}
