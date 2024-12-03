const columns = [
	{ name: "ID", uid: "id_producto", sortable: true },
	{ name: "Nombre", uid: "nombre_producto", sortable: true },
	{ name: "Precio", uid: "precio_unitario", sortable: true },
	{ name: "Stock", uid: "stock_disponible", sortable: true },
	{ name: "Alerta", uid: "stock_alerta", sortable: true },
	{ name: "Estado", uid: "estado_producto" },
	{ name: "Categoría", uid: "nombre_categoria" },
	{ name: "Marca", uid: "nombre_marca" },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Disponible", uid: "Disponible" },
	{ name: "No Disponible", uid: "No_Disponible" },
];

export { columns, statusOptions };
