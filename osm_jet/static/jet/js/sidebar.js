/* eslint-disable no-var, prefer-template */
function sidebarHoverIn (el, popupsList, popup) {
  var elBoundingBox = el.getBoundingClientRect()
  popupsList.style.top = elBoundingBox.top + 'px'

  var popupsArray = popupsList.querySelectorAll('.sidebar-popup-section')
  for (var i = popupsArray.length - 1; i >= 0; i--) {
    popupsArray[i].style.display = 'none'
  }
  popup.style.display = 'block'

  // If the popups list would go below the page, instead move them up to the bottom of
  // the items is in line with the bottom of the sidebar item
  window.requestAnimationFrame(function () {
    if (elBoundingBox.top + popup.clientHeight > window.innerHeight) {
      popupsList.style.top = elBoundingBox.bottom - popup.clientHeight + 'px'
    }
  })

  var sidebarContainer = document.querySelector('.sidebar-popup-container')
  sidebarContainer.style.display = 'block'
}

document.addEventListener('DOMContentLoaded', function () {
  // for mobile, don't set this as Jet does something else with the sidebar for mobiles
  if (window.innerWidth <= 960) {
    return
  }

  // appsList contains nodes with data atributes of the form: data-app-label="APP"
  var appsList = document.querySelectorAll('.app-item')

  // popupList contains nodes with classes of the form: sidebar-popup-section-APP
  var popupsList = document.querySelector('.sidebar-popup')

  if (popupsList) {
    // Nuke all event listeners on popupsList
    popupsList.innerHTML += ''
  }

  for (var i=appsList.length - 1; i>=0; i--) {
    var appName = appsList[i].dataset.appLabel
    var relatedPopup = popupsList.querySelector('.sidebar-popup-section-' + appName)
    appsList[i].addEventListener('mouseenter', sidebarHoverIn.bind(this, appsList[i], popupsList, relatedPopup))
  }
})
/* eslint-enable no-var, prefer-template */
