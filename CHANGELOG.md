# Changelog

## 1.2.0 2021-05-19
* Add support for OSM CMS versioning
* Add initial Django 3.2 support

## 1.1.12 2020-10-28
* Get the location of the icon font using {% static %} tags

## 1.1.11 2020-10-19
* Refactor the save buttons templatetag and template for CMS versioning

## 1.1.10 2020-09-23
* Fix the 'yarn dev' command
* Fix compact-inline.js throwing console errors when there are non CompactInlines on the page

## 1.1.9 2020-09-08
* Fix js console error from compact-inline.js.
* Reduce padding of sitemap items.
* Fix changelist table overflows if there are lots of fields in list_display.
* Fix Toolbar layout breaking if there are no items in it.
* Highlight help-text links.
* Evenly space fields when there is more than one in a row.

## 1.1.8 2020-07-06
* Fix error being thrown if no 'Add' button was present for a DjangoManyToManyField

## 1.1.7 2020-01-13
* Fix issue with Django 2.22 and JetSortedManyToManyField.

## 1.1.6 2019-12-09
* Fix a bug where only a the first compact inline would be sortable on a page
* Remove osm_jet/static/edit_inline/compact_inline.js and add the functionality in osm_jet/static/jet/js/src/features/compact-inline.js

## 1.1.5 - 2019-12-04
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
