import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../src/store/store";
import { setBoletas, setCategorias, setClientes, setEmpleados, setFacturas, setInventario, setMarcas, setMetodosPago, setProveedores, setSubCategorias } from "../src/store/reducer"; // Manteniendo el nombre original
export const FetchMetodosPago = () => {
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchMetodosPago = async () => {
			try {
				const response = await fetch("/api/ventas/metodosPago", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();
				dispatch(setMetodosPago(data));
			} catch (err) {
				console.log("Error al cargar metodos de pago");
			}
		};

		fetchMetodosPago();
	}, [dispatch]);

	return null;
};

export const FetchInventario = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchInventario = async () => {
			try {
				const response = await fetch("/api/inventario/detallesInventario", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();
				const modifiedData = data.map((item: any) => ({
					...item,
					estado_producto: item.estado_producto === "No Disponible" ? "No_Disponible" : item.estado_producto,
				}));

				dispatch(setInventario(modifiedData));
			} catch (err) {
				console.log("Error al cargar inventario");
			}
		};

		fetchInventario();
	}, [dispatch]);

	return null;
};

export const FetchBoletaGeneral = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchBoletaGeneral = async () => {
			try {
				const response = await fetch("/api/ventas/verBoletaGeneral", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();
				dispatch(setBoletas(data));
			} catch (err) {
				console.log("Error al cargar boleta general");
			}
		};

		fetchBoletaGeneral();
	}, [dispatch]);

	return null;
};

export const FetchFacturaGeneral = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchFacturaGeneral = async () => {
			try {
				const response = await fetch("/api/compras/verFacturaGeneral", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();
				dispatch(setFacturas(data || ""));
			} catch (err) {
				console.log("Error al cargar factura general");
			}
		};

		fetchFacturaGeneral();
	}, [dispatch]);

	return null;
};

export const FetchCategorias = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchCategorias = async () => {
			try {
				const response = await fetch("/api/categoria/detallesCategoria", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();

				dispatch(setCategorias(data));
			} catch (err) {
				console.log("Error al cargar categorias");
			}
		};

		fetchCategorias();
	}, [dispatch]);

	return null;
};

export const FetchMarcas = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchMarcas = async () => {
			try {
				const response = await fetch("/api/marcas/detallesMarca", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();

				dispatch(setMarcas(data));
			} catch (err) {
				console.log("Error al cargar marcas");
			}
		};

		fetchMarcas();
	}, [dispatch]);

	return null;
};

export const FetchSubCategorias = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchSubCategorias = async () => {
			try {
				const response = await fetch("/api/subcategoria/detallesSubCategoria", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();

				dispatch(setSubCategorias(data));
			} catch (err) {
				console.log("Error al cargar categorias");
			}
		};

		fetchSubCategorias();
	}, [dispatch]);

	return null;
};

export const FetchClientes = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchClientes = async () => {
			try {
				const response = await fetch("/api/clientes/detallesCliente", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();

				dispatch(setClientes(data));
			} catch (err) {
				console.log("Error al cargar clientes");
			}
		};

		fetchClientes();
	}, [dispatch]);

	return null;
};

export const FetchProveedores = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchProveedores = async () => {
			try {
				const response = await fetch("/api/proveedores/detallesProveedor", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();

				dispatch(setProveedores(data));
			} catch (err) {
				console.log("Error al cargar proveedores");
			}
		};

		fetchProveedores();
	}, [dispatch]);

	return null;
};

export const FetchEmpleados = () => {
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => {
		const fetchEmpleados = async () => {
			try {
				const response = await fetch("/api/empleados/detallesEmpleado", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();

				dispatch(setEmpleados(data));
			} catch (err) {
				console.log("Error al cargar proveedores");
			}
		};

		fetchEmpleados();
	}, [dispatch]);

	return null;
};
