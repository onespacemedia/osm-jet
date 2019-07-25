from cms.apps.pages.admin import (PAGE_FROM_KEY, PAGE_FROM_SITEMAP_VALUE,
                                  page_admin)
from cms.apps.pages.models import Page
from django.conf import settings
from django.core.urlresolvers import reverse
from jet.dashboard.modules import DashboardModule


def generate_sitemap(request):
    '''
        A function that takes a request and builds the sitemap for the current user from it.

        Returns a dictionary of the form with the following fields:
            canAdd:            True if the current user can add a page else False
            createHomepageUrl: The URL for adding the homepage. Used if no pages have been added yet
            moveUrl:           The AJAX POST URL used when moving items in the sitemap
            entries:           An array of dictionaries:

        The entries array contains dictionaries with the following fields:
            isOnline:        True if the page is online else False
            pageId:          The id of the page
            title:           The title of the page
            changeUrl:       The admin URL of the page
            siteUrl:         The site URL of the page
            children:        An array of dictionaries of the same form as this one for this page's children
            canChange:       If the user can edit this page.
            extra_languages: Any extra languages for the page. If there are any, this will be an array of dictionaries.

        The extra_languages array contains dictionaries with the following fields:
            changeURL: The admin URL of the page for this language
            language: The first country object for the language
    '''

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

            middleware = settings.MIDDLEWARE or settings.MIDDLEWARE_CLASSES

            if not 'cms.middleware.LocalisationMiddleware' in middleware:
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
    '''
        The sitemap module for Onespacemedia CMS.

        Renders a page tree of the site for the users to allow quick navigation to
        editing pages and to compactly display page information.

        We don't want this to be deletable but draggable is fine.
    '''

    title = 'Sitemap'
    template = 'admin/dashboard_modules/sitemap.html'
    draggable = True
    deletable = False
    collapsible = False

    def get_context_data(self):
        '''
            We need to pass the sitemap information to the context so we can render
            it out in the template.
        '''
        context = super().get_context_data()
        context['sitemap_json'] = generate_sitemap(context['request'])

        return context
