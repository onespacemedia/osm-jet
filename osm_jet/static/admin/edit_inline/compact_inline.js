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
 * Check the value of a particular field and if it changes update the value of the
 * currently selected field to be that value. Then reset the original field's value
 */
function observeHiddenFieldValue (hiddenField, baseValue) {
  // Since this is run on an interval, we deal with the most likely cast first and break out ASAP
  if (hiddenField.value === baseValue) {
    return
  }

  // If it does have a value, get the currently selected section and also get the version of this field in that section.
  var activeSectionId = document.querySelector('.inline-navigation-item.selected').dataset.inlineRelatedId
  var activeSection = document.getElementById(activeSectionId)
  var fieldName = hiddenField.id.split('-')
  fieldName = fieldName[fieldName.length - 1]
  var field = activeSection.querySelector('.field-' + fieldName + ' ' + hiddenField.nodeName)

  if (hiddenField.nodeName === 'SELECT') {
    // If the hidden field is a select, we need to copy the entire option node over.
    var selectedOption = hiddenField.querySelectorAll('option')[hiddenField.selectedIndex]
    var newOption = selectedOption.cloneNode(true)
    field.appendChild(newOption)
    field.value = newOption.value
    hiddenField.value = baseValue

    // We also need to update the select2 active box to the new text as well.
    field.parentNode.querySelector('.select2-selection__rendered').title = newOption.textContent
    field.parentNode.querySelector('.select2-selection__rendered').textContent = newOption.textContent
  } else {
    // If it's just an input, we can just Update the values and clear the old input and not have to do anything fancy
    field.value = hiddenField.value
    hiddenField.value = baseValue
  }
}

/**
 * Add some listeners to the ForeignKey and RawID fields on the hidden form as there's
 * an issue where if you add a new section and then use a field e.g. to insert an image.
 * The value for the image will get inserted into that field on the hidden form rather
 * than on the new section.
 */
function trackHiddenFields () {
  var emptySectionId = document.querySelector('.inline-navigation-item.empty').dataset.inlineRelatedId
  var emptySection = document.getElementById(emptySectionId)
  var emptySectionTrackingFields = emptySection.querySelectorAll('.vForeignKeyRawIdAdminField, .related-widget-wrapper select')

  for (var i = 0; i < emptySectionTrackingFields.length; i++) {
    // Check semi-regularly for any updates to input values.
    var fieldDefault = emptySectionTrackingFields[i].value
    setInterval(observeHiddenFieldValue.bind(this, emptySectionTrackingFields[i], fieldDefault), 300)
  }
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
  trackHiddenFields()
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
