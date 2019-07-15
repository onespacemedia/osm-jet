/* eslint-disable no-var, prefer-template, no-undef */
function activateTinymce (element) {
  // Generate base settings
  var settings = {
    selector: '#' + element.getAttribute('id')
  }

  // Merge global settings with base
  django.jQuery.extend(settings, JSON.parse(element.dataset.wysiwygSettings))

  // Init editor
  tinymce.init(settings)
};

function stackedCleanSelect2 () {
  var hiddenField = document.querySelector(".inline-group .inline-related[id$='-empty']")
  var select2Containers = hiddenField.querySelectorAll('.select2')

  for (var i = 0; i < select2Containers.length; i++) {
    select2Containers[i].parentNode.removeChild(select2Containers[i])
  }

  var tinymceFields = document.querySelectorAll(".inline-related:not([id$='-empty']) .wysiwyg")
  for (var i = 0; i < tinymceFields.length; i++) {
    activateTinymce(tinymceFields[i])
  }
}

document.addEventListener('DOMContentLoaded', function () {
  stackedCleanSelect2()

  document.querySelector('.add-row a').addEventListener('click', function () {
    /* We want to ensure the JS that re-inits select2 runs before this does. */
    window.jet.jQuery('select').select2({theme: 'jet', width: 'auto'})
    window.setTimeout(stackedCleanSelect2, 0)
  })
})
/* eslint-enable no-var, prefer-template, no-undef */
