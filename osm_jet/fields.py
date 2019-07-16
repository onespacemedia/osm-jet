from django.contrib.staticfiles.storage import staticfiles_storage
from django.db import models
from django.forms import SelectMultiple


class JetManyToManyWidget(SelectMultiple):
    '''
        The widget for the old-style ManyToMany field.
    '''

    template_name = 'widgets/select_multiple.html'

    class Media:
        css = {
            'all': [
                staticfiles_storage.url('admin/widgets/many2many.css'),
            ],
        }

        js = [
            'admin/widgets/many2many.js'
        ]


class JetManyToMany(models.ManyToManyField):
    '''
        A custom ManyToMany field type to bring back the old Django style
        ManyToMany fields if you're not a fan of the select2 style ManyToMany
        fields.
    '''

    def formfield(self, **kwargs):
        kwargs['widget'] = JetManyToManyWidget
        return super().formfield(**kwargs)
