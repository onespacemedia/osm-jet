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
    has_add_permission = context['has_add_permission']
    has_change_permission = context['has_change_permission']
    has_delete_permission = context['has_delete_permission']
    show_delete = context.get('show_delete', False) # show_delete is not set on creation pages
    show_add = context.get('add', False)
    show_return = context.get('show_return', False)

    return {
        'show_delete_link': has_delete_permission and not is_popup and (change or show_delete),
        'show_save_and_add_another': has_add_permission and not is_popup and (not save_as or show_add),
        'show_save_and_return': has_change_permission and not is_popup and (not save_as or show_return),
        'is_popup': is_popup,
        'opts': opts,
        'original': original,
    }
