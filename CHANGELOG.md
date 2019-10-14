# Changelog

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
* Fix for `admin/change_form.html`.

## 1.0.1-1.0.3
* Packaging fixes

## 1.0.0 - 2019-07-26
* Initial release
