from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from jet.admin import CompactInline


class JetTabularInline(admin.TabularInline):
    '''
        An override of the default Django TabularInline with some extra styles
        and some fixes for things that are broken about the Jet implementation.

        In this case, the js fixes:
            - Select2 gets initialised twice when you add a new field.

        In this case, the css fixes:
            - The hidden form is visible by default.
    '''

    class Media:
        js = [
            staticfiles_storage.url('admin/edit_inline/tabular_inline.js'),
        ]

        css = {
            'all': [
                staticfiles_storage.url('admin/edit_inline/tabular_inline.css'),
            ],
        }


class JetStackedInline(admin.StackedInline):
    '''
        An override of the default Django StackedInline with some extra styles
        and some fixes for things that are broken about the Jet implementation.

        In this case, the js fixes:
            - Select2 gets initialised twice when you add a new field.
            - If using the Onespacemedia CMS, the rich text fields do not get
              initialised on page load. (This is also an issue on TabularInlines
              however rich text fields should not be used in those)

        In this case, the css fixes:
            - The hidden form is visible by default.
    '''

    class Media:
        js = [
            staticfiles_storage.url('admin/edit_inline/stacked_inline.js'),
        ]

        css = {
            'all': [
                staticfiles_storage.url('admin/edit_inline/stacked_inline.css'),
            ],
        }


class JetCompactInline(CompactInline):
    '''
        An override of the default Jet CompactInline with some extra styles
        and some fixes for things that are broken about the Jet implementation
        along with some improvements.

        In this case, the js fixes:
            - An issue with RawIdFields that caused them to not be updated on
              new inlines when using the lookup.
            - An issue with ForeignKeyFields that caused the options to not get
              updated if a new object was added.
            - If using the Onespacemedia CMS, the rich text fields do not get
              initialised on page load.
        The js also adds:
            - The ability to order the CompactInline inlines.
            - Indicates clearly the incorrect inline in case of errors.

        In this case, the css adds:
            - Styles for the new re-ordering functionality.
    '''

    class Media:
        js = [
            staticfiles_storage.url('admin/sortable/sortables.min.js'),
            staticfiles_storage.url('admin/edit_inline/compact_inline.js'),
        ]

        css = {
            'all': [
                staticfiles_storage.url('admin/edit_inline/compact_inline.css'),
            ],
        }
