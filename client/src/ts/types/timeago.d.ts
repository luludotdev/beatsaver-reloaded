// tslint:disable-next-line: interface-name
interface Locale {
  locale: string
}

declare module 'javascript-time-ago' {
  export default class TimeAgo {
    public static addLocale(locale: Locale): void

    constructor(locale: string)
    public format(time: Date | number): string
  }
}

declare module 'javascript-time-ago/locale/en' {
  const locale: Locale
  export default locale
}
