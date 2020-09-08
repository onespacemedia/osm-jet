export function getOffsetTop (el, parent = document.body) {
  let offsetTop = 0

  do {
    if (!isNaN(el.offsetTop)) {
      offsetTop += el.offsetTop
    }

    el = el.offsetParent
  } while (el !== parent || el !== document.body)

  return offsetTop
}

export function getOffsetLeft (el, parent = document.body) {
  let offsetLeft = 0

  do {
    if (!isNaN(el.offsetLeft)) {
      offsetLeft += el.offsetLeft
    }

    el = el.offsetParent
  } while (el !== parent || el !== document.body)

  return offsetLeft
}

export function debounce (func, wait, immediate) {
  let timeout

  return function () {
    const context = this
    const args = arguments

    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
