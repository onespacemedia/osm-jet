from distutils.core import setup
from setuptools import find_packages

setup(
    name='osm-jet',
    version='1.0.5',
    license='agpl-3.0',
    description='A CMS skin for Django. An extension of django-jet with some fixes and additional features',
    author='Onespacemedia',
    author_email='developers@onespacemedia.com',
    url='https://github.com/onespacemedia/osm_jet',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Django',
        'django-jet',
    ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Developers',
        'Framework :: Django :: 1.11',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Natural Language :: English',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
    ],
)
