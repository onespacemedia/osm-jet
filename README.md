# OSM Jet
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://github.com/onespacemedia/osm_jet/blob/master/LICENSE)

This is the [Django][django-project] admin and [Jet][jet-repo] overrides used by the [Onespacemedia][osm-site] team.

### Requirements
OSM Jet currently requires the following pip packages:

| Package | Version | PyPy page | Repo |
| ------ | ------ | ------ | ------ |
| Django | 1.11.x | https://pypi.org/project/Django/ | https://github.com/django/django |
| Django Jet | 1.0.8 | https://pypi.org/project/django-jet/ | https://github.com/geex-arts/django-jet |

In addition, the [Onespacemedia CMS][osm-cms] is required if you want to use the sitemap dashboard module.

### Installation

Install `osm_jet`
```
pip install osm_jet
```

Add `osm_jet` to your project's installed apps. If you're using the [Onespacemedia CMS][osm-cms], ensure `osm_jet` is before `cms`:
```
INSTALLED_APPS = [
    ...
    'osm_jet',
    ...
]
```

Add the following settings to your `settings/base.py`:
```
JET_CHANGE_FORM_SIBLING_LINKS = False  # Hide the next and previous object arrows
JET_DEFAULT_THEME = 'osm'              # Sets the theme to be OSM and doesn't show theme selector
JET_WIDGET_SELECTOR = False            # Hides the widget selector.
```

### Usage
`osm_jet` provides wrappers and extensions for some of the default [Django][django-project] and [Jet][jet-repo] classes. These are:

#### Admin wrappers
* `osm_jet.admin.JetTabularInline` - A wrapper for the default Django TabularInline class that fixes some Jet issues.
* `osm_jet.admin.JetStackedInline` - A wrapper for the default Django StackedInline class that fixes some Jet issues.
* `osm_jet.admin.JetCompactInline` - A wrapper for the Jet CompactInline that fixes some issues and also adds re-ordering functionality.

#### Fields
* `osm_jet.fields.DjangoManyToMany` - Brings back the default Django style of ManyToMany widgets if you're not a fan of Jet's select2 version.
* Fixes and style overrides for Jazzband's [sortedM2M][sortedm2m]

#### Dashboard
* `osm_jet.dashboard.Dashboard` - This should only be used if you're also using the [Onespacemedia CMS][osm-cms]. This adds the sitemap module to the dashboard. For more information on usage, see the [Jet docs](https://jet.readthedocs.io/en/latest/dashboard_custom.html#set-up-custom-dashboard) on creating custom Dashboards.

#### Template overrides
In addition to the above, `osm_jet` overrides multiple Django and Jet templates to improve their styling and layout. It also provides some utility templates you can use the customise the admin. These are:

* `templates/admin/nav_links.html` - For adding links to the top of your sidebar on all admin pages.
* `templates/admin/sharing_links.html` - For adding buttons to share any object from its change form.

[django-project]: <https://www.djangoproject.com/>
[jet-repo]: <https://github.com/geex-arts/django-jet>
[osm-site]: <https://onespacemedia.com>
[osm-cms]: <https://github.com/onespacemedia/cms>
[sortedm2m]: <https://github.com/jazzband/django-sortedm2m>
