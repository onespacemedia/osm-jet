from distutils.core import setup

setup(
  name = 'osm_jet',
  packages = ['osm_jet'],
  version = '0.0.3',
  license='agpl-3.0',
  description = 'A CMS skin for Django. An extension of django-jet with some fixes and additional features',
  author = 'Onespacemedia',
  author_email = 'developers@onespacemedia.com',
  url = 'https://github.com/onespacemedia/osm_jet',
  download_url = 'https://github.com/onespacemedia/osm_jet/archive/v_01.tar.gz',
  keywords = ['django', 'cms', 'skin', 'jet'],
  install_requires=[
          'Django',
          'django-jet',
      ],
  classifiers=[
    'Development Status :: 3 - Alpha',
    'Intended Audience :: Developers',
    'Topic :: Software Development :: CMS Skin',
    'License :: OSI Approved :: GNU Affero General Public License v3.0',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3.6',
  ],
)
