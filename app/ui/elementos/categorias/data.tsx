const columns = [
	{ name: "ID", uid: "id_categoria", sortable: true },
	{ name: "Categoría", uid: "nombre_categoria" },
	{ name: "Estado", uid: "estado_categoria" },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Disponible", uid: "1" },
	{ name: "No Disponible", uid: "0" },
];

export { columns, statusOptions };
