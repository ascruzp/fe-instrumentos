const columns = [
	{ name: "ID", uid: "id_subcategoria", sortable: true },
	{ name: "Sub-Categoría", uid: "nombre_subcategoria" },
	{ name: "Categoría", uid: "nombre_categoria" },
	{ name: "Estado", uid: "estado_subcategoria" },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Disponible", uid: "1" },
	{ name: "No Disponible", uid: "0" },
];

export { columns, statusOptions };
