const columns = [
	{ name: "ID", uid: "numero_factura", sortable: true },
	{ name: "Proveedor", uid: "nombre_proveedor", sortable: true },
	{ name: "Pago", uid: "nombre_metodo_pago", sortable: true },
	{ name: "Fecha", uid: "fecha_factura", sortable: true },
	{ name: "Total", uid: "total_factura", sortable: true },
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
