from flask import Flask, render_template, request, jsonify  # type: ignore
import psycopg2
app = Flask(__name__)
def connect_db():
    try:
        return psycopg2.connect(
            dbname='admin_db',
            user='admin',
            password='admin',
            host='localhost',
            port='5432'
        )
    except Exception as e:
        print("Error al conectar a la base de datos:", e)
        return None
@app.route('/')
def index():
    return open("index.html").read()
@app.route('/app.js')
def serve_js():
    return open("app.js").read(), 200, {'Content-Type': 'application/javascript'}
@app.route('/datos', methods=['GET'])
def obtener_datos():
    nombre = request.args.get('nombre')
    apellido = request.args.get('apellido')
    
    with connect_db() as conn:
        if conn is None:
            return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
        cursor = conn.cursor()
        
        # Crear la consulta base
        query = "SELECT * FROM alumnos WHERE TRUE"
        params = []
        
        # Agregar condiciones para filtrado
        if nombre:
            query += " AND nombre ILIKE %s"
            params.append(f'%{nombre}%')
        if apellido:
            query += " AND apellido ILIKE %s"
            params.append(f'%{apellido}%')
        
        cursor.execute(query, params)
        datos = cursor.fetchall()
    return jsonify(datos)
@app.route('/datos/<int:id>', methods=['GET'])
def obtener_dato(id):
    with connect_db() as conn:
        if conn is None:
            return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM alumnos WHERE id=%s", (id,))
        dato = cursor.fetchone()
    return jsonify(dato)
@app.route('/datos', methods=['POST'])
def agregar_dato():
    data = request.get_json()
    with connect_db() as conn:
        if conn is None:
            return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO alumnos (nombre, apellido, fecha_nacimiento, sexo, lenguaje_favorito, "
                           "promedio_primaria, promedio_secundaria, promedio_preparatoria, promedio_actual, "
                           "salario_esperado, color_favorito, marca_ropa, marca_celular, "
                           "materia_favorita) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                           (data['nombre'], data['apellido'], data['fecha_nacimiento'], data['sexo'], 
                            data['lenguaje_favorito'], data['promedio_primaria'], data['promedio_secundaria'], 
                            data['promedio_preparatoria'], data['promedio_actual'], data['salario_esperado'], 
                            data['color_favorito'], data['marca_ropa'], data['marca_celular'], 
                            data['materia_favorita']))
            conn.commit()
            return jsonify({'message': 'Dato agregado'}), 201
        except Exception as e:
            print("Error al agregar datos:", e)
            conn.rollback()  # Deshacer cualquier cambio si hay un error
            return jsonify({'error': 'Error al agregar los datos'}), 500
@app.route('/datos/<int:id>', methods=['PUT'])
def actualizar_dato(id):
    data = request.get_json()
    with connect_db() as conn:
        if conn is None:
            return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE alumnos SET nombre=%s, apellido=%s, fecha_nacimiento=%s, sexo=%s, "
                           "lenguaje_favorito=%s, promedio_primaria=%s, promedio_secundaria=%s, "
                           "promedio_preparatoria=%s, promedio_actual=%s, salario_esperado=%s, "
                           "color_favorito=%s, marca_ropa_favorita=%s, marca_celular_favorita=%s, "
                           "materia_favorita=%s WHERE id=%s", 
                           (data['nombre'], data['apellido'], data['fecha_nacimiento'], data['sexo'], 
                            data['lenguaje_favorito'], data['promedio_primaria'], data['promedio_secundaria'], 
                            data['promedio_preparatoria'], data['promedio_actual'], data['salario_esperado'], 
                            data['color_favorito'], data['marca_ropa'], data['marca_celular'], 
                            data['materia_favorita'], id))
            conn.commit()
            return jsonify({'message': 'Dato actualizado'}), 200
        except Exception as e:
            print("Error al actualizar datos:", e)
            conn.rollback() 
            return jsonify({'error': 'Error al actualizar los datos'}), 500
@app.route('/datos/<int:id>', methods=['DELETE'])
def eliminar_dato(id):
    with connect_db() as conn:
        if conn is None:
            return jsonify({'error': 'No se pudo conectar a la base de datos'}), 500
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM alumnos WHERE id=%s", (id,))
            conn.commit()
            return jsonify({'message': 'Dato eliminado'}), 204
        except Exception as e:
            print("Error al eliminar datos:", e)
            conn.rollback() 
            return jsonify({'error': 'Error al eliminar los datos'}), 500
if __name__ == '__main__':
    app.run(debug=True)