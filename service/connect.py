## import psycopg2


def get_connection():
    hostname = 'db_keygm.postgres.database.azure.com'
    database = 'postgres'
    username = 'db_keygm'
    pwd = 'BusinessKeyGM23'
    port_id = 5432

    return psycopg2.connect(
        host=hostname,
        dbname=database,
        user=username,
        password=pwd,
        port=port_id)



def get_connection_local():
    hostname = 'localhost'
    database = 'db_keygm'
    username = 'postgres'
    pwd = 'Idranoide11'
    port_id = 5432

    return psycopg2.connect(
        host=hostname,
        dbname=database,
        user=username,
        password=pwd,
        port=port_id)
