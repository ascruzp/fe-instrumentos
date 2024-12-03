const columns = [
	{ name: "RUC", uid: "RUC_proveedor", sortable: true },
	{ name: "Nombre", uid: "nombre_proveedor", sortable: true },
	{ name: "Dirección", uid: "direccion_proveedor", sortable: true },
	{ name: "Celular", uid: "celular_proveedor", sortable: true },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Disponible", uid: "Disponible" },
	{ name: "No Disponible", uid: "No_Disponible" },
];

export { columns, statusOptions };
