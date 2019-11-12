/* eslint-disable no-var, object-shorthand, prefer-template */
/**
 * Use the empty section from the DOM to check against to see if changes have been made.
 * The orders of everything but empty items will be saved so if people add an item but
 * add no content it wont error when they try and save it'll just remove it.
 */
function updateOrders () {
  var sections = document.querySelectorAll('.inline-navigation-item:not(.empty)')
  // There's an empty section in the DOM that gets cloned whenever a new item is added, use for defaults
  var emptySection = document.querySelector('.inline-related.empty-form')
  var emptySectionInputs = emptySection.querySelectorAll('input, textarea, select')

  for (var i = 0; i < sections.length; i++) {
    var relatedSection = document.getElementById(sections[i].dataset.inlineRelatedId)
    var relatedSectionInputs = relatedSection.querySelectorAll('input, textarea, select')
    var matchCount = 0

    for (var j = 0; j < emptySectionInputs.length; j++) {
      if (emptySectionInputs[j].value !== relatedSectionInputs[j].value) {
        // If there's a value which isn't the same break straight away, we will save this one
        break
      } else if (emptySectionInputs[j].value === relatedSectionInputs[j].value) {
        // If the value is the same as the default add to the match count
        matchCount++
      }
    }

    if (matchCount !== emptySectionInputs.length) {
      // There must be some deviation from the default values so update the order
      relatedSection.querySelector('.field-order input').value = i
    }
  }
}

/**
 * Add the drag handles to the sidebar to allow easy re-ordering.
 * Also adds the listeners that update the order fields on re-order
 */
function initDraggables () {
  // Helper function that creates the DOM structure for the handle element.
  function createHandle () {
    var handle = document.createElement('span')
    var handleText = document.createTextNode('☰')
    handle.appendChild(handleText)
    handle.classList.add('drag-handle')
    return handle
  }

  // Iterate over the sidebar items, remove their anchors to prevent draging issues and add the drag handle.
  var sortableItems = document.querySelectorAll('.inline-navigation-item')
  for (var i = 0; i < sortableItems.length; i++) {
    sortableItems[i].removeAttribute('href')
    sortableItems[i].insertAdjacentElement('afterbegin', createHandle())
  }

  // the js for this object gets included in the Media object for the compact inline so it is avaliable at runtime.
  /* eslint-disable no-undef */
  Sortable.create(document.querySelector('.inline-navigation-items'), {
    /* eslint-enable no-undef */
    // handle: '.drag-handle',
    animation: 100,
    forceFallback: true,
    onStart: function (evt, originalEvent) {
      document.querySelector('.inline-navigation-content').classList.add('dragging')
    },
    onEnd: function (evt, originalEvent) {
      document.querySelector('.inline-navigation-content').classList.remove('dragging')
      updateOrders()
    }
  })
}

/**
 * Clearly indicate the section that has an error on it.
 * Interate over all the sections and if it has an error, add a class to that sections sidebar item.
 */
function highlightErrors () {
  var sectionTabs = document.querySelectorAll('.inline-navigation-item:not(.empty)')
  for (var i = 0; i < sectionTabs.length; i++) {
    var section = document.getElementById(sectionTabs[i].dataset.inlineRelatedId)
    if (section.querySelector('.errorlist')) {
      sectionTabs[i].classList.add('section-error')
    }
  }
}

/**
 * If there are any WYSIWYG editors in the inline, we initialise them here. We only initialise on the
 * visible (not on the hidden form) ones due to how the inline works means they break if we also
 * initalise the hidden form's editor.
 */
function initWYSIWYG () {
  var WYSIWYGEditors = document.querySelectorAll('.inline-related:not(.empty-form) .wysiwyg')
  for (var i = 0; i < WYSIWYGEditors.length; i++) {
    // This function is provided by the OSM CMS's utils.js
    window.activate_tinymce(WYSIWYGEditors[i])
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initDraggables()
  highlightErrors()
  initWYSIWYG()

  // Code to run when the 'Add another' button is pressed
  var addButton = document.querySelector('.add-row a')
  addButton.addEventListener('click', function () {
    initDraggables()
    initWYSIWYG()
  })

  // Code to run when the form is submitted
  var contentForm = document.querySelector('#content-main form')
  contentForm.addEventListener('submit', updateOrders)
})
/* eslint-enable no-var, object-shorthand, prefer-template */
