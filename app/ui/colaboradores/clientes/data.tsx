const columns = [
	{ name: "ID", uid: "id_cliente", sortable: true },
	{ name: "Nombre", uid: "nombre_cliente", sortable: true },
	{ name: "Fecha Registro", uid: "fecha_registro_cliente", sortable: true },
	{ name: "Usuario", uid: "usuario_cliente" },
	{ name: "Contraseña", uid: "password_cliente" },
	{ name: "Dirección", uid: "direccion_cliente", sortable: true },
	{ name: "Celular", uid: "celular_cliente", sortable: true },
	{ name: "DNI", uid: "dni_cliente" },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Disponible", uid: "Disponible" },
	{ name: "No Disponible", uid: "No_Disponible" },
];

export { columns, statusOptions };
