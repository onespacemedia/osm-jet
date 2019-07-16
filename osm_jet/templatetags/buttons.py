from django import template

register = template.Library()


@register.inclusion_tag('admin/submit_line.html', takes_context=True)
def save_buttons(context):
    '''
        An extension of the default Django save_buttons templatetag.

        We've moved the 'view on site' button to also be inline with the save buttons
        and have made 'Save and continue editing' the default save option. The other
        save options are made into a dropdown to avoid a large amount of clutter at the
        bottom of the page.
    '''
    opts = context['opts']
    change = context['change']
    is_popup = context['is_popup']
    save_as = context['save_as']
    original = context.get('original', False)
    return {
        'onclick_attrib': (change and 'onclick="submitOrderForm();"' or ''),
        'show_delete_link': (not is_popup and context['has_delete_permission'] and (change or context.get('show_delete', False))), # show_delete is not set on creation pages
        'show_save_as_new': not is_popup and change and save_as,
        'show_save_and_add_another': context['has_add_permission'] and not is_popup and (not save_as or context['add']),
        'show_save_and_continue': not is_popup and context['has_change_permission'],
        'is_popup': is_popup,
        'show_save': True,
        'opts': opts,
        'original': original,
        'model_name': original._meta.model_name if original else '',
    }
