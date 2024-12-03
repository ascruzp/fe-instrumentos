const columns = [
	{ name: "ID", uid: "numero_boleta", sortable: true },
	{ name: "Cliente", uid: "nombre_cliente", sortable: true },
	{ name: "Entrega", uid: "metodo_entrega", sortable: true },
	{ name: "Pago", uid: "nombre_metodo_pago", sortable: true },
	{ name: "Estado", uid: "estado_boleta", sortable: true },
	{ name: "Tracking", uid: "tracking", sortable: true },
	{ name: "Fecha", uid: "fecha_boleta", sortable: true },
	{ name: "Total", uid: "total_boleta", sortable: true },
	{ name: "Acciones", uid: "actions" },
];
const statusOptions = [
	{ name: "Efectivo", uid: "Efectivo" },
	{ name: "Tarjeta de Crédito", uid: "Tarjeta de Crédito" },
	{ name: "Tarjeta de Débito", uid: "Tarjeta de Débito" },
	{ name: "Transferencia Bancaria", uid: "Transferencia Bancaria" },
	{ name: "Paypal", uid: "Paypal" },
	{ name: "Yape", uid: "Yape" },
];

export { columns, statusOptions };
