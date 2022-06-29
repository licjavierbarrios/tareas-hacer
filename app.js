require('colors');

const Tareas = require('./models/tareas');
const {
	inquirerMenu,
	pausa,
	leerInput,
	listadoTareasBorrar,
	confirmar,
	mostrarListadoChecklist,
} = require('./helpers/inquirer');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');

const main = async () => {
	let opt = '';
	const tareas = new Tareas();

	const tareasDB = leerDB();
	if (tareasDB) {
		// cargarTareas
		tareas.cargarTareasFromArray(tareasDB);
	}

	do {
		// Imprimir el menú
		opt = await inquirerMenu();
		switch (opt) {
			case '1': // Crear Tareas
				// crear opciones
				const desc = await leerInput('Descripción:');
				tareas.crearTarea(desc);
				break;
			case '2': // Listar tareas
				tareas.listadoCompleto();
				//console.log(tareas.listadoArr);
				break;
			case '3': // Listar completadas
				tareas.listarPendientesCompletadas();
				break;
			case '4': // Listar Pendientes
				tareas.listarPendientesCompletadas(false);
				break;
			case '5': // Completado | pendiente
				const ids = await mostrarListadoChecklist(tareas.listadoArr);
				tareas.toggleCompletadas(ids);
				break;
			case '6': // Borrar
				const id = await listadoTareasBorrar(tareas.listadoArr);
				if (id !== '0') {
					const ok = await confirmar('¿Está seguro?');
					if (ok) {
						tareas.borrarTareas(id);
						console.log('Tarea borrada');
					}
				}

				break;
		}

		guardarDB(tareas.listadoArr);

		if (opt !== '0') await pausa();
	} while (opt !== '0');
	//pausa();
};

main();
