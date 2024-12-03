const columns = [
	{ name: "ID", uid: "DNI_empleado", sortable: true },
	{ name: "Nombre", uid: "nombre_empleado", sortable: true },
	{ name: "Apellido", uid: "apellido_empleado", sortable: true },
	{ name: "Celular", uid: "celular_empleado", sortable: true },
	{ name: "Dirección", uid: "direccion_empleado", sortable: true },
	{ name: "Sexo", uid: "sexo" },
	{ name: "Estado", uid: "estado_empleado" },
	{ name: "Usuario", uid: "usuario_empleado" },
	{ name: "Contraseña", uid: "contrasena_empleado" },
	{ name: "Cargo", uid: "estado_cargo" },
	{ name: "Acciones", uid: "actions" },
];

const statusOptions = [
	{ name: "Activo", uid: "Activo" },
	{ name: "Inactivo", uid: "Inactivo" },
];

export { columns, statusOptions };
