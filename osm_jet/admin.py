from django.contrib import admin
from django.contrib.staticfiles.storage import staticfiles_storage
from jet.admin import CompactInline


class JetTabularInline(admin.TabularInline):
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
    class Media:
        js = [
            staticfiles_storage.url('cms/js/sortable/sortables.min.js'),
            staticfiles_storage.url('admin/edit_inline/compact_inline.js'),
        ]

        css = {
            'all': [
                staticfiles_storage.url('admin/edit_inline/compact_inline.css'),
            ],
        }
