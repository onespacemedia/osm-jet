import { debounce, getOffsetTop } from '../utils/helper-functions'

class SubmitRowDropdown {
  constructor ({ el }) {
    this.el = el
    /* The dropdown elements are hardcoded in css to 32px and there are always 4 of them so 128, could probably change
       this to get the element(s) heights in js but it's faff and it is unlikely to change... #TODO
     */
    this.dropdownHeight = 128
    /* The <body> element doesn't actually stretch to the full height of the document, so we use the sidebar instead */
    this.sidebar = document.querySelector('.sidebar')
    this.POLLINTERVAL = 500

    /* Poll updating the dropdown. There are so many things that can change the position of the dropdown relative to
       the document this is preferable to binding on every possible scenario and debouncing the function.
     */
    this.pollUpdateDropdown()
  }

  updateDropdownDirection () {
    const top = getOffsetTop(this.el)
    const height = this.sidebar.clientHeight

    if (height - top < this.dropdownHeight) {
      this.el.classList.add('submit-row-dropdown-invert')
    } else {
      this.el.classList.remove('submit-row-dropdown-invert')
    }
  }

  pollUpdateDropdown () {
    this.updateDropdownDirection()

    window.setTimeout(this.pollUpdateDropdown.bind(this), this.POLLINTERVAL)
  }
}

function initSubmitRowDropdown () {
  const els = document.querySelectorAll('.js-SubmitRow')

  for (const el of els) {
    new SubmitRowDropdown({ el })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSubmitRowDropdown()
})
