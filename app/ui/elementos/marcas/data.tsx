const columns = [
	{ name: "ID", uid: "id_marca", sortable: true },
	{ name: "Marca", uid: "nombre_marca" },
	{ name: "Estado", uid: "estado_marca" },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Disponible", uid: "1" },
	{ name: "No Disponible", uid: "0" },
];

export { columns, statusOptions };
