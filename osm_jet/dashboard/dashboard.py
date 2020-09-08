from jet.dashboard.dashboard import Dashboard as JetDashboard

from .modules import SiteMap


class Dashboard(JetDashboard):
    '''
        An override of the default Jet dashboard. Sets the default number of
        columns to 3 and ensures the user always has a single Sitemap module
        on their dashboard.
    '''

    columns = 3

    def init_with_context(self, context):
        super().init_with_context(context)

        self.children.append(SiteMap(
            'Sitemap',
            column=2,
        ))
