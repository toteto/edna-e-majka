const l2c = {
  A: 'А',
  B: 'Б',
  C: 'Ц',
  D: 'Д',
  E: 'Е',
  F: 'Ф',
  G: 'Г',
  H: 'Х',
  I: 'И',
  K: 'К',
  L: 'Л',
  M: 'М',
  N: 'Н',
  O: 'О',
  P: 'П',
  Q: 'ку',
  R: 'Р',
  S: 'С',
  T: 'Т',
  V: 'В',
  X: 'ИКС',
  Y: 'S',
  Z: 'З',
  CH: 'Ч',
  LJ: 'Љ',
  NJ: 'Њ',
  DZ: 'S',
  SH: 'Ш',
  GJ: 'Ѓ',
  KJ: 'Ќ',
  ZH: 'Ж'
} as any

export function latinToCyrillic(text: string): string {
  if (!text) return text

  let result = ''
  for (let i = 0; i < text.length; ) {
    const oneLetter = text[i].toUpperCase()
    const twoLetter = text.slice(i, i + 2).toUpperCase()

    if (twoLetter.length === 2 && l2c[twoLetter]) {
      result += l2c[twoLetter]
      i += 2
    } else if (l2c[oneLetter]) {
      result += l2c[oneLetter]
      i += 1
    } else {
      result += oneLetter
      i += 1
    }
  }

  return result
}

export function validateEmail(email: string): boolean {
  return !!email.match(
    /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/
  )
}

export function truncate(text: string, maxLength: number, leeway = 0.1) {
  return text.length > maxLength + maxLength * leeway ? text.slice(0, maxLength) + '...' : text
}
