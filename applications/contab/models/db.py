# -*- coding: utf-8 -*-

db = DAL('sqlite://storage.sqlite')
db.define_table(
    'registro',
    Field('fecha', 'date'),
    Field('dato', 'string')
)

db.define_table(
    'config',
    Field('usuario', 'string'),
    Field('organizacion', 'string'),
    Field('scanner', 'integer')
)
