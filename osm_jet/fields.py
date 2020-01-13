from itertools import chain

from django.contrib.staticfiles.storage import staticfiles_storage
from django.db import models
from django.forms import CheckboxInput, CheckboxSelectMultiple, SelectMultiple
from django.urls import NoReverseMatch, reverse
from django.utils.encoding import force_text
from django.utils.html import conditional_escape

# Catch the case that the user doesn't have sortedM2M installed
try:
    from sortedm2m.forms import SortedMultipleChoiceField
    from sortedm2m.fields import SortedManyToManyField
except ImportError:
    class SortedMultipleChoiceField:
        pass

    class SortedManyToManyField:
        pass


class DjangoManyToManyWidget(SelectMultiple):
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


class DjangoManyToMany(models.ManyToManyField):
    '''
        A custom ManyToMany field type to bring back the old Django style
        ManyToMany fields if you're not a fan of the select2 style ManyToMany
        fields.
    '''

    def formfield(self, **kwargs):  # pylint:disable=arguments-differ
        kwargs['widget'] = DjangoManyToManyWidget
        return super().formfield(**kwargs)


class SortedManyToManyWidget(CheckboxSelectMultiple):
    '''
        A customised version of the sortedM2M SortedCheckboxSelectMultiple.

        Adds an inline edit link for each object in the widget.

        Code has been refactored a bit from the base sortedM2M
        SortedCheckboxSelectMultipleto be more up to date with widget
        rendering styles.
    '''
    template_name = 'widgets/sortedm2m_editlinks.html'

    class Media:
        js = (
            'admin/js/jquery.init.js',
            'sortedm2m/widget.js',
            'sortedm2m/jquery-ui.js',
        )
        css = {'screen': (
            'sortedm2m/widget.css',
        )}

    def __init__(self, **kwargs):
        self.model_cls = None
        super().__init__(**kwargs)

    def build_attrs(self, base_attrs, extra_attrs=None):
        attrs = dict(base_attrs or {}, **extra_attrs)

        attrs = super().build_attrs(attrs)

        classes = attrs.setdefault('class', '').split()
        classes.append('sortedm2m')
        attrs['class'] = ' '.join(classes)

        return attrs

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)

        selected, unselected = self.get_selected_and_unselected(name, value, attrs)

        context['selected'] = selected
        context['unselected'] = unselected

        return context

    def value_from_datadict(self, data, files, name):
        value = data.get(name, None)

        if isinstance(value, str):
            return [v for v in value.split(',') if v]

        return value

    def get_selected_and_unselected(self, name, value, attrs):
        if value is None:
            value = []

        has_id = attrs and 'id' in attrs
        final_attrs = self.build_attrs(attrs, extra_attrs={'name': name})

        # Normalize to strings
        str_values = [force_text(v) for v in value]

        selected = []
        unselected = []

        for i, (option_value, option_label) in enumerate(chain(self.choices)):
            # If an ID attribute was given, add a numeric index as a suffix,
            # so that the checkboxes don't all have the same ID attribute.
            if has_id:
                final_attrs = dict(final_attrs, id='%s_%s' % (attrs['id'], i))
                label_for = ' for="%s"' % conditional_escape(final_attrs['id'])
            else:
                label_for = ''

            cb = CheckboxInput(final_attrs, check_test=lambda value: value in str_values)
            option_value = force_text(option_value)
            rendered_cb = cb.render(name, option_value)
            option_label = conditional_escape(force_text(option_label))

            try:
                edit_link = reverse(
                    f'admin:{self.model_cls._meta.app_label}_{self.model_cls._meta.model_name}_change',
                    args=[option_value]
                )
            except NoReverseMatch:
                edit_link = None

            item = {
                'label_for': label_for,
                'rendered_cb': rendered_cb,
                'option_label': option_label,
                'option_value': option_value,
                'edit_link': edit_link
            }

            if option_value in str_values:
                selected.append(item)
            else:
                unselected.append(item)

        # Reorder `selected` array according str_values which is a set of `option_value`s in the
        # order they should be shown on screen
        ordered = []

        for s in str_values:
            for select in selected:
                if s == select['option_value']:
                    ordered.append(select)

        selected = ordered

        return selected, unselected


class JetSortedMultipleChoiceField(SortedMultipleChoiceField):
    widget = SortedManyToManyWidget

    def __init__(self, **kwargs):
        self.model_cls = kwargs.pop('model_cls')
        super().__init__(**kwargs)
        self.widget.model_cls = self.model_cls

class JetSortedManyToManyField(SortedManyToManyField):
    def formfield(self, **kwargs):
        defaults = {}

        if self.sorted:
            defaults['form_class'] = JetSortedMultipleChoiceField
            defaults['model_cls'] = self.remote_field.model

        defaults.update(kwargs)

        return super().formfield(**defaults)
