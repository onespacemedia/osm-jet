# Changelog

## Next release
* Be less specific about required Django version
* Fix small issue with edit buttons not hooking up on JetSortedManyToMany
* Fix error with adding the first item to a SortedManyToMany
* Fix a Django 2.2 incompatibility
* Make sidebar nav items flow up rather than down if they would go below the bottom of the page

## 1.1.4 - 2019-11-12
* Add CircleCI builds
* Add copy links for offline page preview URLs
* Fix being unable to re-order CompactInlines on IE11 and Edge
* Add new JetSortedManyToMany field that adds edit buttons to sortedm2m admin fields
* Generally fix an issue with admin field values being added to the hidden form on CompactInlines
* Add preview query string to 'View on site' buttons

## 1.1.3 - 2019-10-31
* Add ability to add extra links to admin login page
* Add utility templates for adding content to the top and bottom of the body respectively

## 1.1.2 - 2019-10-22
* Make side menu play nicer with permissions
* Fix a JS exception

## 1.1.1 - 2019-10-14
* Fix incorrect querySelector in related-popups.js when getting the hidden input for sortedm2ms
* Remove try catch block in related-popups.js that was suppressing errors

## 1.1.0 - 2019-10-14
* Fix rendering of model name on delete button (use `verbose_name` rather than `model_name`)
* Bring in Jet's JS locally to more cleanly make changes/fixes
* Fix issue with CompactInline where saveing with errors made an extra empty item
* Fix inline add another button on SortedM2M and DjangoM2Ms not opening in the popup iframe
* Update CSS for Checkbox fields to bring them inline stylewise with other fields
* Fix errors on login form rendering multiple times
* Adjust object-tool CSS the make it always one line of buttons

## 1.0.6 - 2019-09-03
* Fix sidebar not working for mobiles
* Hide fields named 'order' on compact inlines
* Added a 'Copy link' button to the sharing links
* Various responsive fixes

## 1.0.5 - 2019-08-01
* Fix issue with sortedM2M not getting initialised outside of CompactInlines

## 1.0.4 - 2019-07-30
* Fix for `admin/change_form.html`

## 1.0.1-1.0.3
* Packaging fixes

## 1.0.0 - 2019-07-26
* Initial release
