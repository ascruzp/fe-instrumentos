import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import {
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Input,
	Select,
	SelectItem,
	Autocomplete,
	AutocompleteItem,
	Textarea,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../src/store/store";
import { updateInventario } from "../../../../../src/store/reducer";

interface DetalleProducto {
	id_producto: number;
	id_categoria: number;
	id_marca: number;
	nombre_producto: string;
	precio_unitario: string;
	stock_disponible: number;
	stock_alerta: number;
	estado_producto: string;
	nombre_categoria: string;
	url_producto: string;
	descripcion_producto: string;
	nombre_marca: string;
}

type SWCharacter1 = {
	id_marca: number;
	nombre_marca: string;
};

type SWCharacter2 = {
	id_categoria: number;
	nombre_categoria: string;
};

const estados_de_productos = [
	{ key: "Disponible", label: "Disponible" },
	{ key: "No Disponible", label: "No Disponible" },
];
export function EditarProducto({
	seleccionarProducto,
	setIsEditProduct,
}: {
	seleccionarProducto: DetalleProducto,
	setIsEditProduct: Dispatch<SetStateAction<boolean>>,
}) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);

	const [valueIdCategoria, setValueIdCategoria] = useState(
		seleccionarProducto.id_categoria
	);
	const [valueIdMarca, setValueIdMarca] = useState(
		seleccionarProducto.id_marca
	);
	const [valueIdCategoriaText, setValueIdCategoriaText] = useState(
		seleccionarProducto.nombre_categoria
	);
	const [valueIdMarcaText, setValueIdMarcaText] = useState(
		seleccionarProducto.nombre_marca
	);
	const [validUrlProducto, setValidUrlProducto] = useState(false);
	const [valueUrlProducto, setValueUrlProducto] = useState(
		seleccionarProducto.url_producto
	);

	const [validDescripcionProducto, setValidDescripcionProducto] = useState(false);
	const [valueDescripcionProducto, setValueDescripcionProducto] = useState(
		seleccionarProducto.descripcion_producto
	);

	const [validProducto, setValidProducto] = useState(false);
	const [valueNombreProducto, setNombreProducto] = useState(
		seleccionarProducto.nombre_producto
	);
	const [validPrecioUnitario, setValidPrecioUnitario] = useState(false);
	const [valuePrecioUnitario, setPrecioUnitario] = useState(
		seleccionarProducto.precio_unitario
	);
	const [validStockDisponible, setValidStockDisponible] = useState(false);
	const [valueStockDisponible, setStockDisponible] = useState(
		seleccionarProducto.stock_disponible.toString()
	);
	const [validStockAlerta, setValidStockAlerta] = useState(false);
	const [valueStockAlerta, setStockAlerta] = useState(
		seleccionarProducto.stock_alerta.toString()
	);
	const [validEstadoProducto, setValidEstadoProducto] = useState(false);
	const [valueEstadoProducto, setEstadoProducto] = useState(
		seleccionarProducto.estado_producto.replace("_", " ")
	);
	const [validNombreCategoria, setValidNombreCategoria] = useState(false);
	const [valueNombreCategoria, setNombreCategoria] = useState(
		seleccionarProducto.nombre_categoria
	);
	const [validNombreMarca, setValidNombreMarca] = useState(false);
	const [valueNombreMarca, setNombreMarca] = useState(
		seleccionarProducto.nombre_marca
	);
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setEstadoProducto(e.target.value);
	};

	useEffect(() => {
		if (!valueNombreProducto) {
			setValidProducto(true);
		} else {
			setValidProducto(false);
		}
	}, [valueNombreProducto]);

	useEffect(() => {
		if (!valueUrlProducto) {
			setValidUrlProducto(true);
		} else {
			setValidUrlProducto(false);
		}
	}, [valueUrlProducto]);

	useEffect(() => {
		if (!valueDescripcionProducto) {
			setValidDescripcionProducto(true);
		} else {
			setValidDescripcionProducto(false);
		}
	}, [valueDescripcionProducto]);

	useEffect(() => {
		if (!valuePrecioUnitario) {
			setValidPrecioUnitario(true);
		} else {
			setValidPrecioUnitario(false);
		}
	}, [valuePrecioUnitario]);

	useEffect(() => {
		if (!valueStockDisponible) {
			setValidStockDisponible(true);
		} else {
			setValidStockDisponible(false);
		}
	}, [valueStockDisponible]);

	useEffect(() => {
		if (!valueStockAlerta) {
			setValidStockAlerta(true);
		} else {
			setValidStockAlerta(false);
		}
	}, [valueStockAlerta]);

	useEffect(() => {
		if (valueEstadoProducto === "") {
			setValidEstadoProducto(true);
		} else {
			setValidEstadoProducto(false);
		}
	}, [valueEstadoProducto]);

	const handleValueMarca = (key: string | number | null) => {
		const selectedProduct = list1.items.find(
			(item) => item.id_marca === Number(key)
		);
		if (selectedProduct) {
			setValueIdMarca(Number(key));
			setValueIdMarcaText(selectedProduct.nombre_marca);
		}
	};
	const handleValueCategoria = (key: string | number | null) => {
		const selectedProduct = list2.items.find(
			(item) => item.id_categoria === Number(key)
		);
		if (selectedProduct) {
			setValueIdCategoria(Number(key));
			setValueIdCategoriaText(selectedProduct.nombre_categoria);
		}
	};

	let list1 = useAsyncList<SWCharacter1>({
		async load({ signal, filterText }) {
			let res = await fetch(
				`/api/inventario/buscarMarca?search=${filterText}`,
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

	let list2 = useAsyncList<SWCharacter2>({
		async load({ signal, filterText }) {
			let res = await fetch(
				`/api/inventario/buscarCategoria?search=${filterText}`,
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

	const confirmar = async () => {
		console.log(valueEstadoProducto)
		if (!seleccionarProducto) return;
		const productoActualizado = {
			id_producto: seleccionarProducto.id_producto,
			nombre_producto: valueNombreProducto,
			precio_unitario: valuePrecioUnitario,
			stock_disponible: Number(valueStockDisponible),
			stock_alerta: Number(valueStockAlerta),
			estado_producto: valueEstadoProducto,
			id_categoria: valueIdCategoria,
			nombre_categoria: valueIdCategoriaText,
			url_producto: valueUrlProducto,
			descripcion_producto: valueDescripcionProducto,
			nombre_marca: valueIdMarcaText,
			id_marca: valueIdMarca,
		};
		console.log(productoActualizado);
		try {
			const response = await fetch("/api/inventario/editarProducto", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el producto");
			}
			dispatch(updateInventario(productoActualizado));
			console.log(productoActualizado)
			setConfirmarVenta(true);

			const data = await response.json();
			console.log(data.message);
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						{confirmarVenta ? (
							<h2>Producto Actualizado</h2>
						) : (
							<h2>Editar Producto</h2>
						)}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<div className="grid grid-cols-7 gap-4">
								<Input
									isDisabled
									className="col-span-1"
									size="sm"
									type="number"
									label="ID"
									value={seleccionarProducto.id_producto.toString()}
								/>
								<Autocomplete
									isRequired
									className="col-span-3"
									isDisabled={confirmarVenta}
									inputValue={
										list1.filterText || valueIdMarcaText
									}
									isLoading={list1.isLoading}
									items={list1.items}
									placeholder="Busca una Marca"
									name="marca"
									label="Marca"
									size="sm"
									onInputChange={(value) => {
										list1.setFilterText(value);
									}}
									onSelectionChange={handleValueMarca}>
									{(item) => (
										<AutocompleteItem
											key={item.id_marca}
											textValue={item.nombre_marca}>
											{item.nombre_marca}
										</AutocompleteItem>
									)}
								</Autocomplete>
								<Autocomplete
									isRequired
									className="col-span-3"
									inputValue={
										list2.filterText || valueIdCategoriaText
									}
									isDisabled={confirmarVenta}
									isLoading={list2.isLoading}
									items={list2.items}
									placeholder="Busca una Categoria"
									name="categoria"
									label="Categoria"
									size="sm"
									onInputChange={(value) => {
										list2.setFilterText(value);
									}}
									onSelectionChange={handleValueCategoria}>
									{(item) => (
										<AutocompleteItem
											key={item.id_categoria}
											textValue={item.nombre_categoria}>
											{item.nombre_categoria}
										</AutocompleteItem>
									)}
								</Autocomplete>
							</div>
							<hr />
							<Input
								isRequired
								size="sm"
								type="text"
								isInvalid={validProducto}
								label="Nombre Producto"
								placeholder="Ingrese el nombre del producto"
								value={valueNombreProducto}
								onValueChange={setNombreProducto}
							/>
							<div className="flex gap-4">
								<Input
									isRequired
									size="sm"
									type="number"
									isInvalid={validPrecioUnitario}
									label="Precio Unitario"
									placeholder="Ingrese el precio unitario"
									value={valuePrecioUnitario}
									onValueChange={setPrecioUnitario}
								/>
								<Input
									isRequired
									size="sm"
									type="number"
									isInvalid={validStockDisponible}
									label="Stock Disponible"
									placeholder="Ingrese el stock disponible"
									value={valueStockDisponible}
									onValueChange={setStockDisponible}
								/>
								<Input
									isRequired
									size="sm"
									type="number"
									isInvalid={validStockAlerta}
									label="Stock Alerta"
									placeholder="Ingrese el stock de alerta"
									value={valueStockAlerta}
									onValueChange={setStockAlerta}
								/>
							</div>
							<Select
								isRequired
								size="sm"
								isInvalid={validEstadoProducto}
								label="Estado Producto"
								placeholder="Selecciona un estado para el producto"
								selectedKeys={[valueEstadoProducto]}
								onChange={handleSelectionChange}>
								{estados_de_productos.map((producto) => (
									<SelectItem key={producto.key}>
										{producto.label}
									</SelectItem>
								))}
							</Select>
							<Input
								isRequired
								size="sm"
								type="text"
								isInvalid={validUrlProducto}
								label="Url del producto"
								placeholder="Ingrese la url del producto"
								value={valueUrlProducto}
								onValueChange={setValueUrlProducto}
							/>
							<Textarea
								isRequired
								size="sm"
								type="text"
								isInvalid={validDescripcionProducto}
								label="Descripcion del producto"
								placeholder="Ingrese la descripcion del producto"
								value={valueDescripcionProducto}
								onValueChange={setValueDescripcionProducto}
							/>
						</article>
					</ModalBody>
					<ModalFooter className="border-t-1 border-gray-400">
						{confirmarVenta ? (
							<div className="flex justify-between w-full">
								<div>
									<Button
										className="font-bold"
										color="secondary"
										onPress={() => {
											onClose();
											setIsEditProduct(false);
										}}>
										Finalizar
									</Button>
								</div>
							</div>
						) : (
							<>
								<Button
									className="font-bold"
									variant="flat"
									color="success"
									onPress={confirmar}>
									Confirmar
								</Button>
								<Button
									className="font-bold"
									color="danger"
									onPress={() =>{
										onClose();
										setIsEditProduct(false);
									}}>
									Cancelar
								</Button>
							</>
						)}
					</ModalFooter>
				</>
			)}
		</ModalContent>
	);
}
