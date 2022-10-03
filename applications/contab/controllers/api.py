# -*- coding: utf-8 -*-

headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Max-Age': 5000,
    'Content-Length': 0,
    'Connection': 'keep-alive',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE'
}


@request.restful()
def registro():
    def GET(*args, **vars):
        if 'fecha' in vars:
            row = db(db.registro.fecha == vars['fecha']).select().first()
            return response.json(row)
        if 'range' in vars:
            from json import loads
            rows = db(db.registro.fecha.belongs(loads(vars['range']))).select()
            return response.json(rows.as_list())

    def POST(*args, **vars):
        from json import dumps
        vars['dato'] = dumps(vars['dato'])  # 'vars['dato']' is is store as JSON (String)
        db.registro.update_or_insert(db.registro.fecha == vars['fecha'], **vars)
        return response.json(dict(afectados=1))

    return locals()


@request.restful()
def config():
    def GET(*args, **vars):
        return response.json(db.config(1))

    def POST(*args, **vars):
        db.config.update_or_insert(db.config.id == vars['id'], **vars)
        return response.json(dict(afectados=1))

    return locals()
