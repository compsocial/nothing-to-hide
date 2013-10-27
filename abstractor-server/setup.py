#!/usr/bin/env python

from distutils.core import setup

setup(name='Vague-ify',
      version='1.0',
      description='Flask server that provides a service to make text vague.',
      author='Eric Gilbert',
      author_email='gilbert@cc.gatech.edu',
      url='https://github.com/climatewarrior/nothing-to-hide',
      packages=['abstractor'],
      install_requires=('flask', 'ner')
     )
