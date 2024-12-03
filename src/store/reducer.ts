// src/store/reducers/exampleReducer.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DetalleCliente {
	id_cliente: number;
	nombre_cliente: string;
	celular_cliente: string;
	direccion_cliente: string;
	fecha_registro_cliente: string;
	usuario_cliente: string;
	password_cliente: string;
	dni_cliente: string;
}
export interface DetalleProveedor {
	RUC_proveedor: string;
	nombre_proveedor: string;
	celular_proveedor: string;
	direccion_proveedor: string;
}

export interface DetalleProducto {
	id_producto: number;
	id_categoria: number;
	id_marca: number;
	nombre_producto: string;
	precio_unitario: string;
	stock_disponible: number;
	stock_alerta: number;
	estado_producto: string;
	nombre_categoria: string;
	nombre_marca: string;
	descripcion_producto: string;
	url_producto: string;
}
export interface DetalleCategoria {
	id_categoria: number;
	nombre_categoria: string;
	estado_categoria: number;
}
export interface DetalleSubCategoria {
	id_subcategoria: number;
	nombre_subcategoria: string;
	id_categoria: number;
	nombre_categoria: string;
	estado_subcategoria: number;
}
export interface DetalleMarca {
	id_marca: number;
	nombre_marca: string;
	estado_marca: number;
}

export interface MetodoPago {
	value: number;
	label: string;
}

export interface DetalleEmpleado {
	DNI_empleado: string;
	nombre_empleado: string;
	apellido_empleado: string;
	celular_empleado: string;
	direccion_empleado: string;
	sexo: string;
	estado_empleado: string;
	usuario_empleado: string;
	contrasena_empleado: string;
	estado_cargo: string;
}

export interface DetalleBoleta {
	numero_boleta: number;
	nombre_cliente: string;
	celular_cliente: string;
	direccion_cliente: string;
	fecha_registro_cliente: string;
	fecha_boleta: string;
	metodo_entrega: string;
	total_boleta: string;
	nombre_metodo_pago: string;
	estado_boleta: number;
	tracking: string;
}

export interface DetalleFactura {
	numero_factura: string;
	direccion_proveedor: string;
	RUC_proveedor: string;
	nombre_proveedor: string;
	nombre_metodo_pago: string;
	fecha_factura: string;
	total_factura: string;
}

export interface InventarioState {
	inventario: DetalleProducto[];
	categorias: DetalleCategoria[];
	subcategorias: DetalleSubCategoria[];
	clientes: DetalleCliente[];
	marcas: DetalleMarca[];
	metodosPago: MetodoPago[];
	proveedores: DetalleProveedor[];
	empleados: DetalleEmpleado[];
	isOpenSideBar: boolean;
	boletas: DetalleBoleta[];
	facturas: DetalleFactura[];
	isAdmin: "0" | "1" | "2";
}

const initialState: InventarioState = {
	inventario: [],
	categorias: [],
	subcategorias: [],
	clientes: [],
	marcas: [],
	empleados: [],
	metodosPago: [],
	proveedores: [],
	isOpenSideBar: true,
	boletas: [],
	facturas: [],
	isAdmin: "0",
};

const exampleSlice = createSlice({
	name: "example",
	initialState,
	reducers: {
		setInventario: (state, action) => {
			state.inventario = action.payload;
		},
		setUserStatus: (state, action) => {
			state.isAdmin = action.payload;
		},
		setCategorias: (state, action) => {
			state.categorias = action.payload;
		},
		setEmpleados: (state, action) => {
			state.empleados = action.payload;
		},
		setSubCategorias: (state, action) => {
			state.subcategorias = action.payload;
		},
		setProveedores: (state, action) => {
			state.proveedores = action.payload;
		},
		setClientes: (state, action) => {
			state.clientes = action.payload;
		},
		setMarcas: (state, action) => {
			state.marcas = action.payload;
		},
		setIsOpenSidebar: (state, action) => {
			state.isOpenSideBar = action.payload;
		},
		setBoletas: (state, action) => {
			state.boletas = action.payload;
		},
		setFacturas: (state, action) => {
			state.facturas = action.payload;
		},
		updateBoleta: (state, action: PayloadAction<DetalleBoleta>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.boletas.findIndex((producto) => producto.numero_boleta === nuevoProducto.numero_boleta);

			if (productoIndex !== -1) {
				state.boletas[productoIndex] = nuevoProducto;
			}
		},
		updateInventario: (state, action: PayloadAction<DetalleProducto>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.inventario.findIndex((producto) => producto.id_producto === nuevoProducto.id_producto);

			if (productoIndex !== -1) {
				state.inventario[productoIndex] = nuevoProducto;
				state.inventario[productoIndex].estado_producto = state.inventario[productoIndex].estado_producto.replace(" ", "_");
			}
		},
		updateCategorias: (state, action: PayloadAction<DetalleCategoria>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.categorias.findIndex((categoria) => categoria.id_categoria === nuevoProducto.id_categoria);

			if (productoIndex !== -1) {
				state.categorias[productoIndex] = nuevoProducto;
			}
		},
		updateClientes: (state, action: PayloadAction<DetalleCliente>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.clientes.findIndex((categoria) => categoria.id_cliente === nuevoProducto.id_cliente);

			if (productoIndex !== -1) {
				state.clientes[productoIndex] = nuevoProducto;
			}
		},
		updateProveedores: (state, action: PayloadAction<DetalleProveedor>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.proveedores.findIndex((categoria) => categoria.RUC_proveedor === nuevoProducto.RUC_proveedor);

			if (productoIndex !== -1) {
				state.proveedores[productoIndex] = nuevoProducto;
			}
		},
		updateSubCategorias: (state, action: PayloadAction<DetalleSubCategoria>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.subcategorias.findIndex((categoria) => categoria.id_subcategoria === nuevoProducto.id_subcategoria);

			if (productoIndex !== -1) {
				state.subcategorias[productoIndex] = nuevoProducto;
			}
		},
		updateMarcas: (state, action: PayloadAction<DetalleMarca>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.marcas.findIndex((categoria) => categoria.id_marca === nuevoProducto.id_marca);

			if (productoIndex !== -1) {
				state.marcas[productoIndex] = nuevoProducto;
			}
		},
		updateEmpleados: (state, action: PayloadAction<DetalleEmpleado>) => {
			const nuevoProducto = action.payload;
			const productoIndex = state.empleados.findIndex((categoria) => categoria.DNI_empleado === nuevoProducto.DNI_empleado);

			if (productoIndex !== -1) {
				state.empleados[productoIndex] = nuevoProducto;
			}
		},
		insertarInventario: (state, action: PayloadAction<DetalleProducto>) => {
			state.inventario.push(action.payload);
		},
		insertarProveedor: (state, action: PayloadAction<DetalleProveedor>) => {
			state.proveedores.push(action.payload);
		},
		insertarCategoria: (state, action: PayloadAction<DetalleCategoria>) => {
			state.categorias.push(action.payload);
		},
		insertarCliente: (state, action: PayloadAction<DetalleCliente>) => {
			state.clientes.push(action.payload);
		},
		insertarSubCategoria: (state, action: PayloadAction<DetalleSubCategoria>) => {
			state.subcategorias.push(action.payload);
		},
		insertarEmpleado: (state, action: PayloadAction<DetalleEmpleado>) => {
			state.empleados.push(action.payload);
		},
		insertarMarca: (state, action: PayloadAction<DetalleMarca>) => {
			state.marcas.push(action.payload);
		},
		insertarBoleta: (state, action: PayloadAction<DetalleBoleta>) => {
			state.boletas.push(action.payload);
		},
		insertarFactura: (state, action: PayloadAction<DetalleFactura>) => {
			state.facturas.push(action.payload);
		},
		setMetodosPago: (state, action: PayloadAction<MetodoPago[]>) => {
			state.metodosPago = action.payload;
		},
	},
});

export const {
	setInventario,
	setMetodosPago,
	updateInventario,
	insertarInventario,
	setIsOpenSidebar,
	setBoletas,
	setFacturas,
	setCategorias,
	updateCategorias,
	insertarCategoria,
	setMarcas,
	updateMarcas,
	insertarMarca,
	updateSubCategorias,
	setSubCategorias,
	insertarSubCategoria,
	setClientes,
	updateClientes,
	insertarCliente,
	setProveedores,
	insertarProveedor,
	updateProveedores,
	setEmpleados,
	insertarEmpleado,
	updateEmpleados,
	setUserStatus,
	updateBoleta,
	insertarBoleta,
	insertarFactura,
} = exampleSlice.actions;
export default exampleSlice.reducer;
