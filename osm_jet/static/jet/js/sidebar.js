/* eslint-disable no-var, prefer-template */
document.addEventListener('DOMContentLoaded', function () {
  // appsList contains nodes with data atributes of the form: data-app-label="APP"
  var appsList = Array.from(document.querySelectorAll('.app-item'))

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

  function sidebarHoverIn (el, popupsList, popup) {
    popupsList.style.top = el.getBoundingClientRect().top + 'px'

    var popupsArray = Array.from(popupsList.querySelectorAll('.sidebar-popup-section'))
    for (var i = popupsArray.length - 1; i >= 0; i--) {
      popupsArray[i].style.display = 'none'
    }
    popup.style.display = 'block'

    // for mobile, don't set this as Jet does something else with the sidebar for mobiles
    if (window.innerWidth > 960) {
      var sidebarContainer = document.querySelector('.sidebar-popup-container')
      sidebarContainer.style.display = 'block'
    }
  }
})
/* eslint-enable no-var, prefer-template */
