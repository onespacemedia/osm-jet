/* eslint-disable no-var, object-shorthand, prefer-template */
function tabularCleanSelect2 () {
  var hiddenField = document.querySelector(".inline-group .form-row[id$='-empty']")
  var select2Containers = hiddenField.querySelectorAll('.select2')

  for (var i = 0; i < select2Containers.length; i++) {
    select2Containers[i].parentNode.removeChild(select2Containers[i])
  }
}

document.addEventListener('DOMContentLoaded', function () {
  tabularCleanSelect2()

  document.querySelector('.add-row a').addEventListener('click', function () {
    /* We want to ensure the JS that re-inits select2 runs before this does. */
    window.setTimeout(tabularCleanSelect2, 0)
  })
})
/* eslint-enable no-var, object-shorthand, prefer-template */
