from jet.dashboard.dashboard import Dashboard as JetDashboard
from jet.dashboard.models import UserDashboardModule

from osm_jet.dashboard.modules import SiteMap


class Dashboard(JetDashboard):
    columns = 3

    def load_modules(self):
        module_models = UserDashboardModule.objects.filter(
            app_label=self.app_label,
            user=self.context['request'].user.pk
        ).all()
        module_models = [x for x in module_models]

        if not module_models:
            module_models = self.create_initial_module_models(self.context['request'].user)

        sitemaps = UserDashboardModule.objects.filter(
            module='osm_jet.dashboard.modules.SiteMap',
            user=self.context['request'].user.pk
        )

        if not sitemaps:
            module_models.append(UserDashboardModule.objects.create(
                title='Sitemap',
                app_label=self.app_label,
                user=self.context['request'].user.pk,
                module='osm_jet.dashboard.modules.SiteMap',
                column=self.columns - 1,
                order=0,
                settings='',
                children=''
            ))

        if len(sitemaps) > 1:
            module_models = [x for x in module_models if not isinstance(x, SiteMap)]
            first_sitemap = sitemaps.first()
            module_models.append(first_sitemap)
            for sitemap in sitemaps.exclude(pk=first_sitemap.pk):
                sitemap.delete()

        loaded_modules = []

        for module_model in module_models:
            module_cls = module_model.load_module()
            if module_cls is not None:
                module = module_cls(model=module_model, context=self.context)
                loaded_modules.append(module)

        self.modules = loaded_modules
