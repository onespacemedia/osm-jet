/* eslint-disable no-var */
function addOptionListener (option, selectedSelect, notSelectedSelect) {
  if (option.parentNode === selectedSelect) {
    notSelectedSelect.appendChild(option)
  } else {
    selectedSelect.appendChild(option)
  }
  option.selected = false
}

function moveOptionsToSelect (fromSelect, toSelect) {
  var fromOptions = fromSelect.querySelectorAll('option')
  for (var i = 0; i < fromOptions.length; i++) {
    toSelect.appendChild(fromOptions[i])
    options[i].style.display = ''
  }
}

function filterSelect (input, select) {
  var options = select.querySelectorAll('option')
  var filterText = input.value.toUpperCase()
  for (var i = 0; i < options.length; i++) {
    var textValue = options[i].textContent || options[i].innerText

    if (textValue.toUpperCase().indexOf(filterText) > -1) {
      options[i].style.display = ''
    } else {
      options[i].style.display = 'none'
    }
  }
}

function moveSelectedOptionsToSelect (fromSelect, toSelect) {
  var fromOptions = fromSelect.querySelectorAll('option')
  for (var i = 0; i < fromOptions.length; i++) {
    if (fromOptions[i].selected) {
      toSelect.appendChild(fromOptions[i])
      fromOptions[i].style.display = ''
    }
  }
}

function initManyToMany (manyToMany) {
  var oldSelect = manyToMany.querySelector('.js-SelectMultiple_Old select')
  var newSelect = manyToMany.querySelector('.js-SelectMultiple_New select')
  var options = manyToMany.querySelectorAll('option')

  for (var j = 0; j < options.length; j++) {
    options[j].addEventListener('dblclick', addOptionListener.bind(this, options[j], newSelect, oldSelect))
  }

  var addAllButton = manyToMany.querySelector('.js-SelectMultiple_AddAll')
  var removeAllButton = manyToMany.querySelector('.js-SelectMultiple_RemoveAll')
  var addSelectedButton = manyToMany.querySelector('.js-SelectMultiple_AddSelected')
  var removeSelectedButton = manyToMany.querySelector('.js-SelectMultiple_RemoveSelected')

  addAllButton.addEventListener('click', moveOptionsToSelect.bind(this, oldSelect, newSelect))
  removeAllButton.addEventListener('click', moveOptionsToSelect.bind(this, newSelect, oldSelect))
  addSelectedButton.addEventListener('click', moveSelectedOptionsToSelect.bind(this, oldSelect, newSelect))
  removeSelectedButton.addEventListener('click', moveSelectedOptionsToSelect.bind(this, newSelect, oldSelect))

  var searchOld = manyToMany.querySelector('.js-SelectMultiple_SearchOld')
  var searchNew = manyToMany.querySelector('.js-SelectMultiple_SearchNew')

  searchOld.addEventListener('input', filterSelect.bind(this, searchOld, oldSelect))
  searchNew.addEventListener('input', filterSelect.bind(this, searchNew, oldSelect))
}

function saveM2MFields () {
  var manyToManys = document.querySelectorAll('.js-SelectMultiple')

  for (var i = 0; i < manyToManys.length; i++) {
    var selectOptions = manyToManys[i].querySelectorAll('.js-SelectMultiple_New select option')
    for (var j = 0; j < selectOptions.length; j++) {
      selectOptions[j].selected = true
    }
  }
}

function initNewM2MFields () {
  var sections = document.querySelectorAll('.inline-group .inline-related:not(.empty-form)')
  var lastSection = sections[sections.length - 1]
  var manyToManys = lastSection.querySelectorAll('.js-SelectMultiple')

  for (var i = 0; i < manyToManys.length; i++) {
    initManyToMany(manyToManys[i])
  }
}

function initM2MFields () {
  var manyToManys = document.querySelectorAll('.js-SelectMultiple')
  for (var i = 0; i < manyToManys.length; i++) {
    initManyToMany(manyToManys[i])
  }

  var saveButtons = document.querySelectorAll('.submit-row input')
  for (var i = 0; i < saveButtons.length; i++) {
    saveButtons[i].addEventListener('click', saveM2MFields)
  }

  var newSectionButton = document.querySelector('.inline-navigation .add-row a')
  if (newSectionButton) {
    newSectionButton.addEventListener('click', initNewM2MFields)
  }
}

window.addEventListener('DOMContentLoaded', initM2MFields)
/* eslint-enable no-var */
