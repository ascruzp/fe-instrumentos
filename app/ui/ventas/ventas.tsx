"use client";
import {
	Input,
	Select,
	SelectItem,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Tooltip,
	Button,
	DatePicker,
	getKeyValue,
	Autocomplete,
	AutocompleteItem,
	Modal,
	useDisclosure,
} from "@nextui-org/react";
import { DeleteIcon } from "../components/DeleteIcon";
import { now, getLocalTimeZone } from "@internationalized/date";
import { useAsyncList } from "@react-stately/data";
import { useState, useEffect, ChangeEvent } from "react";
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { RegistrarVenta } from "./components/registrarVenta";
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store/store";
type SWCharacter = {
	id_producto: number;
	name: string;
	precio_unitario: number;
};

type Producto = {
	key: number;
	nombre: string;
	cantidad: number;
	precio_unitario: number;
	importe: number;
};

type Venta = {
	cliente: string;
	celular_cliente?: string;
	direccion_cliente?: string;
	fecha_registro: string;
	metodo_pago: number;
	fecha_boleta: string;
	metodo_entrega: number;
	total_venta: number;
	productos: Producto[];
};

type MetodoPago = {
	value: number;
	label: string;
};

export default function ContentVentas() {
	const longitudCliente = 80;
	const longitudCelular = 15;
	const longitudDireccion = 100;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const { metodosPago } = useSelector((state: RootState) => state.inventario);

	const metodosEntrega = [
		{ value: 1, label: "En Tienda" },
		{ value: 2, label: "Envío" },
	];

	const [validName, setValidName] = useState(false);
	const [validCantidad, setValidCantidad] = useState(false);

	const [idProducto, setSelectedIdProducto] = useState<number | null>(null);
	const [selectedName, setSelectedName] = useState("");
	const [valueCantidad, setValueCantidad] = useState("1");
	const [selectedPrecioUnitario, setSelectedPrecioUnitario] =
		useState("0.00");
	const [importe, setImporte] = useState("0.00");

	const [showDireccionCelular, setShowDireccionCelular] = useState(false);
	const [showCelular, setShowCelular] = useState(false);

	const [validCliente, setValidCliente] = useState(false);
	const [validMetodoEntrega, setValidMetodoEntrega] = useState(false);
	const [validDireccion, setValidDireccion] = useState(false);
	const [validCelular, setValidCelular] = useState(false);

	const [valueCliente, setValueCliente] = useState("");
	const [valueDireccion, setValueDireccion] = useState("");
	const [valueCelular, setValueCelular] = useState("");
	const [valueMetodoPago, setValueMetodoPago] = useState(1);
	const [valueMetodoEntrega, setValueMetodoEntrega] = useState(1);
	const [ventaTotal, setVentaTotal] = useState("0.00");
	const [productosSeleccionados, setProductosSeleccionados] = useState<
		Producto[]
	>([]);

	const [venta, setVenta] = useState<Venta>({
		cliente: "",
		fecha_registro: "",
		metodo_pago: 0,
		fecha_boleta: "",
		metodo_entrega: 0,
		total_venta: 0,
		productos: [],
	});

	useEffect(() => {
		const calcularImporte = (): string => {
			if (valueCantidad) {
				const cantidad = Number(valueCantidad);
				if (cantidad >= 0 && cantidad <= 1000) {
					const nuevoImporte =
						cantidad * parseFloat(selectedPrecioUnitario);
					return nuevoImporte.toFixed(2).toString();
				}
			}
			return "0.00";
		};

		const nuevoImporte = calcularImporte();
		setImporte(nuevoImporte);
	}, [valueCantidad, selectedPrecioUnitario]);

	useEffect(() => {
		let suma = 0;
		productosSeleccionados.forEach((producto) => {
			suma += producto.importe;
		});
		setVentaTotal(suma.toFixed(2).toString());
	}, [productosSeleccionados]);

	const handleValueCantidadChange = (value: string) => {
		if (Number(value) > 0 && Number(value) <= 1000) {
			setValueCantidad(value);
			setValidCantidad(false);
		}
	};

	const handleValueCliente = (value: string) => {
		if (value.length <= longitudCliente) {
			setValueCliente(value);
			setValidCliente(false);
		}
	};

	const handleValueDireccion = (value: string) => {
		if (value.length <= longitudDireccion) {
			setValueDireccion(value);
			setValidDireccion(false);
		}
	};

	const handleValueCelular = (value: string) => {
		if (value.length <= longitudCelular) {
			setValueCelular(value);
			setValidCelular(false);
		}
	};

	const handleValueProductoChange = (key: string | number | null) => {
		const selectedProduct = list.items.find((item) => item.name === key);
		if (selectedProduct) {
			setSelectedIdProducto(selectedProduct.id_producto);
			setSelectedName(selectedProduct.name);
			setSelectedPrecioUnitario(
				selectedProduct.precio_unitario.toString()
			);
			setValidName(false);
		}
	};

	const agregarProducto = () => {
		if (selectedName === "") {
			setValidName(true);
			return;
		}
		if (!Number(valueCantidad)) {
			setValidCantidad(true);
			return;
		}
		const nuevoProducto: Producto = {
			key: idProducto || 0,
			nombre: selectedName,
			cantidad: Number(valueCantidad),
			precio_unitario: parseFloat(selectedPrecioUnitario),
			importe: parseFloat(importe),
		};
		const nuevosProductos = [...productosSeleccionados, nuevoProducto];
		setProductosSeleccionados(nuevosProductos);
		list.setFilterText("");
		setSelectedName("");
		setSelectedPrecioUnitario("0.00");
		setImporte("0.00");
	};

	const eliminarProducto = (key: number) => {
		setProductosSeleccionados((prevProductos) => {
			const nuevoArray = prevProductos.filter(
				(objeto) => objeto.key !== key
			);
			return nuevoArray;
		});
	};

	const [open, setOpen] = useState(false);
	const agregarVenta = () => {
		if (valueCliente === "") {
			setValidCliente(true);
			return;
		}
		if (valueMetodoEntrega === 0) {
			setValidMetodoEntrega(true);
			return;
		}
		if (valueMetodoEntrega === 2) {
			if (valueDireccion === "") {
				setValidDireccion(true);
				return;
			}
			if (!Number(valueCelular)) {
				setValidCelular(true);
				return;
			}
		}
		if (
			valueMetodoEntrega !== 2 &&
			(metodosPago as any).find(
				(metodo: MetodoPago) => metodo.value === valueMetodoPago
			).label === "Yape"
		) {
			if (!Number(valueCelular)) {
				setValidCelular(true);
				return;
			}
		}

		if (productosSeleccionados.length === 0) {
			setOpen(true);
			return;
		}
		const fechaActual = now(getLocalTimeZone());
		const fechaOrdenada = `${String(fechaActual.day).padStart(2, "0")}/${String(fechaActual.month).padStart(2, "0")}/${fechaActual.year} ${String(fechaActual.hour).padStart(2, "0")}:${String(fechaActual.minute).padStart(2, "0")}:${String(fechaActual.second).padStart(2, "0")}`;
		const nuevaVenta: Venta = {
			cliente: valueCliente,
			celular_cliente: valueCelular?.toString(),
			direccion_cliente: valueDireccion,
			fecha_registro: fechaOrdenada,
			metodo_pago: valueMetodoPago,
			fecha_boleta: fechaOrdenada,
			metodo_entrega: valueMetodoEntrega,
			total_venta: parseFloat(ventaTotal),
			productos: productosSeleccionados,
		};
		setVenta(nuevaVenta);
		onOpen();
	};

	const cancelarVenta = () => {
		// Resetting all the states to their initial values
		setValidName(false);
		setValidCantidad(false);

		setSelectedIdProducto(null);
		setSelectedName("");
		setValueCantidad("1");
		setSelectedPrecioUnitario("0.00");
		setImporte("0.00");

		setShowDireccionCelular(false);
		setShowCelular(false);

		setValidCliente(false);
		setValidMetodoEntrega(false);
		setValidDireccion(false);
		setValidCelular(false);

		setValueCliente("");
		setValueDireccion("");
		setValueCelular("");
		setValueMetodoPago(1);
		setValueMetodoEntrega(1);
		setVentaTotal("0.00");
		setProductosSeleccionados([]);

		console.log("Venta cancelada");
	};

	const columns = [
		{
			key: "producto",
			label: "PRODUCTO",
		},
		{
			key: "cantidad",
			label: "CANTIDAD",
		},
		{
			key: "precio_unitario",
			label: "P. UNIT",
		},
		{
			key: "importe",
			label: "IMPORTE",
		},
		{
			key: "eliminar",
			label: (
				<span className="text-lg">
					<DeleteIcon />
				</span>
			),
		},
	];

	let list = useAsyncList<SWCharacter>({
		async load({ signal, filterText }) {
			let res = await fetch(
				`/api/ventas/buscarProducto?search=${filterText}`,
				{
					signal,
				}
			);
			let json = await res.json();

			return {
				items: json.results,
			};
		},
	});

	return (
		<>
			<Modal
				hideCloseButton
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				placement="center"
				scrollBehavior="inside">
				<RegistrarVenta
					registrarVenta={venta}
					limpiarVenta={cancelarVenta}
				/>
			</Modal>
			<Grow in={open} className="absolute bottom-0 left-0 z-50 m-4">
				<Alert
					severity="error"
					variant="filled"
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							size="small"
							onClick={() => {
								setOpen(false);
							}}>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					}>
					Debe agregar al menos un producto para poder registrar la
					venta.
				</Alert>
			</Grow>
			<section className="flex flex-col rounded-md bg-white">
				<header className="rounded-tl-md rounded-tr-md bg-pink-500 p-4 ">
					<h2 className="font-bold uppercase text-white">
						Registro de ventas
					</h2>
				</header>
				<article className="flex flex-col gap-4 p-4">
					<form className="flex flex-col gap-4 xl:grid xl:grid-cols-7">
						<div className="xl:col-span-3">
							<Autocomplete
								isRequired
								isInvalid={validName}
								errorMessage="Debe seleccionar un producto"
								inputValue={list.filterText}
								isLoading={list.isLoading}
								items={list.items}
								placeholder="Busca un producto"
								name="producto"
								label="Producto"
								size="sm"
								onInputChange={(value) => {
									list.setFilterText(value);
									if (value === "") {
										setSelectedName("");
										setSelectedPrecioUnitario("0.00");
									}
								}}
								onSelectionChange={handleValueProductoChange}>
								{(item) => (
									<AutocompleteItem
										key={item.name}
										textValue={item.name}>
										{item.name}
									</AutocompleteItem>
								)}
							</Autocomplete>
						</div>
						<div className="flex flex-col gap-4 xl:col-span-3 xl:grid xl:grid-cols-3">
							<div className="xl:col-span-1">
								<Input
									isRequired
									isInvalid={validCantidad}
									errorMessage="Debe ingresar una cantidad"
									type="number"
									size="sm"
									label="Cantidad"
									name="cantidad"
									placeholder="Ingresa la cantidad"
									value={valueCantidad}
									onValueChange={handleValueCantidadChange}
								/>
							</div>
							<div className="flex flex-row gap-4 xl:col-span-2 xl:grid xl:grid-cols-2">
								<Input
									isReadOnly
									type="text"
									label="Precio unitario"
									color="primary"
									placeholder="0.00"
									name="precio_unitario"
									size="sm"
									className="xl:col-span-1"
									value={selectedPrecioUnitario.toString()}
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-small text-default-400">
												S/.
											</span>
										</div>
									}
								/>
								<Input
									isReadOnly
									type="text"
									label="Importe"
									color="secondary"
									name="importe"
									placeholder="0.00"
									size="sm"
									className="xl:col-span-1"
									value={importe}
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-small text-default-400">
												S/.
											</span>
										</div>
									}
								/>
							</div>
						</div>
						<Button
							color="danger"
							className="font-bold xl:col-span-1"
							size="lg"
							onClick={agregarProducto}>
							Agregar
						</Button>
					</form>
					<section className="">
						<Table aria-label="Tabla de productos a comprar">
							<TableHeader columns={columns}>
								{(column) => (
									<TableColumn key={column.key}>
										{column.label}
									</TableColumn>
								)}
							</TableHeader>
							<TableBody
								emptyContent={"No se agregó ningún producto."}
								items={productosSeleccionados}>
								{(itemProducto) => (
									<TableRow key={itemProducto.key}>
										<TableCell>
											{itemProducto.nombre}
										</TableCell>
										<TableCell>
											{itemProducto.cantidad}
										</TableCell>
										<TableCell>
											{itemProducto.precio_unitario}
										</TableCell>
										<TableCell>
											{itemProducto.importe}
										</TableCell>
										<TableCell>
											<span
												className="cursor-pointer text-lg text-danger active:opacity-50"
												onClick={() =>
													eliminarProducto(
														itemProducto.key
													)
												}>
												<DeleteIcon />
											</span>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</section>
					<form className="flex flex-col gap-4">
						<div className="flex flex-col gap-4 xl:grid xl:grid-cols-4 2xl:grid-cols-5">
							<div className="flex flex-col gap-2 xl:col-span-2 2xl:col-span-3">
								<div className="flex flex-col gap-4 md:flex-row">
									<Input
										isRequired
										size="sm"
										type="text"
										isInvalid={validCliente}
										errorMessage="Debe ingresar el nombre del cliente"
										label="Cliente"
										placeholder="Ingresa el nombre del Cliente"
										value={valueCliente}
										onValueChange={handleValueCliente}
									/>
									<Select
										isRequired
										size="sm"
										label="Método de Entrega"
										isInvalid={validMetodoEntrega}
										errorMessage="Debe seleccionar un método de entrega"
										placeholder="Selecciona el método de entrega"
										defaultSelectedKeys={["1"]}
										onChange={(
											e: ChangeEvent<HTMLSelectElement>
										) => {
											const value = e.target.value;
											if (value === "2") {
												setShowDireccionCelular(true);
											} else {
												setValueDireccion("");
												setValueCelular("");
												setShowDireccionCelular(false);
											}
											setValueMetodoEntrega(
												Number(value)
											);
											setValidMetodoEntrega(false);
										}}>
										{metodosEntrega.map(
											(opcion: {
												value: number;
												label: string;
											}) => (
												<SelectItem
													key={opcion.value}
													value={opcion.value}>
													{opcion.label}
												</SelectItem>
											)
										)}
									</Select>
								</div>
								{showDireccionCelular && (
									<div className="grid grid-cols-1 gap-4 md:grid-cols-7">
										<Input
											isRequired
											type="text"
											size="sm"
											label="Dirección"
											className="md:col-span-4"
											isInvalid={validDireccion}
											errorMessage="Debe ingresar una dirección"
											value={valueDireccion}
											onValueChange={handleValueDireccion}
											placeholder="Ingresa la dirección del Cliente"
										/>
										<Input
											isRequired
											type="number"
											size="sm"
											label="Celular"
											className="md:col-span-3"
											isInvalid={validCelular}
											errorMessage="Debe ingresar un número celular"
											value={valueCelular}
											onValueChange={handleValueCelular}
											placeholder="Ingresa el número celular del Cliente"
										/>
									</div>
								)}
							</div>
							<div className="flex flex-col gap-4 xl:col-span-1">
								<Select
									isRequired
									size="sm"
									items={metodosPago}
									label="Método de pago"
									placeholder="Selecciona el método pago"
									defaultSelectedKeys={["1"]}
									onChange={(
										e: ChangeEvent<HTMLSelectElement>
									) => {
										const value = Number(e.target.value);
										const selectedMetodoPago =
											metodosPago.find(
												(metodo) =>
													(metodo as any).value ===
													value
											);
										if (selectedMetodoPago) {
											if (
												(selectedMetodoPago as any)
													.label === "Yape"
											) {
												setShowCelular(true);
											} else {
												setValueCelular("");
												setShowCelular(false);
											}
											setValueMetodoPago(
												(selectedMetodoPago as any)
													.value
											);
										}
									}}>
									{(animal: {
										value: number;
										label: string;
									}) => (
										<SelectItem key={animal.value}>
											{animal.label}
										</SelectItem>
									)}
								</Select>
								{showDireccionCelular == false &&
									showCelular && (
										<Input
											isRequired
											type="number"
											size="sm"
											label="Celular"
											isInvalid={validCelular}
											errorMessage="Debe ingresar un número celular"
											value={valueCelular}
											onValueChange={handleValueCelular}
											className="md:col-span-3"
											placeholder="Ingresa el número celular del Cliente"
										/>
									)}
							</div>
							<div className="flex flex-col gap-4 md:flex-row xl:col-span-1 xl:flex-col">
								<DatePicker
									isReadOnly
									label="Fecha"
									size="sm"
									hideTimeZone
									color="primary"
									showMonthAndYearPickers
									defaultValue={now(getLocalTimeZone())}
								/>
								<Input
									isReadOnly
									type="text"
									label="Total"
									size="sm"
									color="success"
									placeholder="0.00"
									value={ventaTotal}
									endContent={
										<div className="pointer-events-none flex items-center">
											<span className="text-small text-default-400">
												S/.
											</span>
										</div>
									}
								/>
							</div>
						</div>
						<div className="flex flex-col justify-end gap-4 lg:flex-row">
							<Button
								className="font-bold"
								variant="flat"
								color="warning"
								size="lg"
								onClick={cancelarVenta}>
								Cancelar Venta
							</Button>
							<Button
								className="font-bold"
								color="success"
								size="lg"
								onClick={agregarVenta}>
								Registrar Venta
							</Button>
						</div>
					</form>
				</article>
			</section>
		</>
	);
}
