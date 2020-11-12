from cms.apps.pages.templatetags.admin_pages import can_add_versions
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
    change = context['change']
    is_popup = context['is_popup']
    # Using save as new because ModelAdmin defaults to save_as = False
    save_as = context.get('save_as_new', change)
    has_add_permission = context['has_add_permission']
    has_change_permission = context['has_change_permission']
    has_delete_permission = context['has_delete_permission']
    show_delete = context.get('show_delete', change)  # show_delete is not set on creation pages
    show_return = context.get('show_return', True)
    save_as_version = context.get('save_as_version', True) and can_add_versions(context)

    context.update({
        'show_delete_link': has_delete_permission and not is_popup and show_delete,
        'show_save_and_add_another': not is_popup and has_add_permission and change and save_as,
        'show_save_and_return': has_change_permission and not is_popup and (save_as or show_return),
        'show_save_as_version': save_as_version,
    })

    return context
