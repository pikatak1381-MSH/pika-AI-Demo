import jalaali from "jalaali-js"

export function getTodayGregorian() {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, "0")
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const yyyy = today.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}


export function getTodayJalali() {
    const gDate = new Date()
    const jDate = jalaali.toJalaali(gDate.getFullYear(), gDate.getMonth() + 1, gDate.getDate())

    const dd = String(jDate.jd).padStart(2, "0")
    const mm = String(jDate.jm).padStart(2, "0")
    const yyyy = jDate.jy

    return `${yyyy}/${mm}/${dd}`
}