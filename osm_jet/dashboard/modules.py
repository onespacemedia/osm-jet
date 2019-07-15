from cms.apps.pages.admin import (PAGE_FROM_KEY, PAGE_FROM_SITEMAP_VALUE,
                                  page_admin)
from cms.apps.pages.models import Page
from django.conf import settings
from django.core.urlresolvers import reverse
from jet.dashboard.modules import DashboardModule


def generate_sitemap(request):
    homepage = request.pages.homepage

    # Compile the initial data.
    data = {
        'canAdd': page_admin.has_add_permission(request),
        'createHomepageUrl': reverse('admin:pages_page_add') + '?{0}={1}'.format(PAGE_FROM_KEY, PAGE_FROM_SITEMAP_VALUE),
        'moveUrl': reverse('admin:pages_page_move_page') or None,
    }

    # Add in the page data.
    if homepage:
        def sitemap_entry(page):
            children = []
            for child in page.children:
                children.append(sitemap_entry(child))

            outcome_dict = {
                'isOnline': page.is_online,
                'pageId': page.id,
                'title': str(page),
                'changeUrl': reverse('admin:pages_page_change', args=[page.id]) + '?{0}={1}'.format(PAGE_FROM_KEY, PAGE_FROM_SITEMAP_VALUE),
                'siteUrl': page.get_absolute_url(),
                'children': children,
                'canChange': page_admin.has_change_permission(request, page),
                'extra_languages': []
            }

            if not 'cms.middleware.LocalisationMiddleware' in settings.MIDDLEWARE_CLASSES:
                return outcome_dict

            # Get all of the language pages
            extra_language_pages = Page.objects.filter(
                owner=page,
                is_content_object=True
            ).order_by('-country_group')

            outcome_dict['extra_languages'] = [{
                'changeURL': reverse('admin:pages_page_change', args=[page.id]) + '?{0}={1}'.format(PAGE_FROM_KEY, PAGE_FROM_SITEMAP_VALUE),
                'language': page.country_group.country_set.first()
            } for page in extra_language_pages]

            return outcome_dict

        data['entries'] = [sitemap_entry(homepage)]
    else:
        data['entries'] = []

    return data


class SiteMap(DashboardModule):
    title = 'Sitemap'
    template = 'admin/dashboard_modules/sitemap.html'
    draggable = True
    deletable = False
    collapsible = False

    def get_context_data(self):
        context = super().get_context_data()
        context['sitemap_json'] = generate_sitemap(context['request'])

        return context
