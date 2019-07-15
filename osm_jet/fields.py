from django.contrib.staticfiles.storage import staticfiles_storage
from django.db import models
from django.forms import SelectMultiple


class JetManyToManyWidget(SelectMultiple):
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
    def formfield(self, **kwargs):
        kwargs['widget'] = JetManyToManyWidget
        return super().formfield(**kwargs)
