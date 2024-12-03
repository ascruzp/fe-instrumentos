import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../src/store/store";
import { updateCategorias, updateInventario, updateSubCategorias } from "../../../../../src/store/reducer";

export interface DetalleSubCategoria {
	id_subcategoria: number;
	id_categoria: number;
	nombre_subcategoria: string;
	nombre_categoria: string;
	estado_subcategoria: number;
}

type SWCharacter2 = {
	id_categoria: number;
	nombre_categoria: string;
};

const estados_de_productos = [
	{ key: "Disponible", label: "Disponible" },
	{ key: "No Disponible", label: "No Disponible" },
];
export function EditarProducto({ seleccionarProducto, setIsEditProduct }: { seleccionarProducto: DetalleSubCategoria; setIsEditProduct: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [validNombreSubCategoria, setValidNombreSubCategoria] = useState(false);
	const [valueNombreSubCategoria, setNombreSubCategoria] = useState(seleccionarProducto.nombre_subcategoria);
	const [validEstadoProducto, setValidEstadoProducto] = useState(false);
	const [valueEstadoProducto, setEstadoProducto] = useState(seleccionarProducto.estado_subcategoria === 1 ? "Disponible" : "No Disponible");
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setEstadoProducto(e.target.value);
	};
	const [valueIdCategoriaText, setValueIdCategoriaText] = useState(seleccionarProducto.nombre_categoria);
	const [valueIdCategoria, setValueIdCategoria] = useState(seleccionarProducto.id_categoria);

	useEffect(() => {
		if (valueEstadoProducto === "") {
			setValidEstadoProducto(true);
		} else {
			setValidEstadoProducto(false);
		}
	}, [valueEstadoProducto]);

	useEffect(() => {
		if (valueNombreSubCategoria === "") {
			setValidNombreSubCategoria(true);
		} else {
			setValidNombreSubCategoria(false);
		}
	}, [valueNombreSubCategoria]);

	const handleValueCategoria = (key: string | number | null) => {
		const selectedProduct = list2.items.find((item) => item.id_categoria === Number(key));
		if (selectedProduct) {
			setValueIdCategoria(Number(key));
			setValueIdCategoriaText(selectedProduct.nombre_categoria);
		}
	};

	const confirmar = async () => {
		if (!seleccionarProducto) return;
		const productoActualizado = {
			id_subcategoria: seleccionarProducto.id_subcategoria,
			id_categoria: valueIdCategoria,
			nombre_subcategoria: valueNombreSubCategoria,
			nombre_categoria: valueIdCategoriaText,
			estado_subcategoria: valueEstadoProducto === "No Disponible" ? 0 : 1,
		};
		try {
			const response = await fetch("/api/subcategoria/editarSubCategoria", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el producto");
			}
			console.log(productoActualizado);
			dispatch(updateSubCategorias(productoActualizado));
			setConfirmarVenta(true);
		} catch (error: any) {
			console.error(error.message);
		}
	};

	let list2 = useAsyncList<SWCharacter2>({
		async load({ signal, filterText }) {
			let res = await fetch(`/api/inventario/buscarCategoria?search=${filterText}`, {
				signal,
			});
			let json = await res.json();

			return {
				items: json.results,
			};
		},
	});

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						{confirmarVenta ? <h2>Sub-Categoría Actualizada</h2> : <h2>Editar Sub-Categoría</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<Autocomplete
							isRequired
							className="col-span-4"
							inputValue={list2.filterText || valueIdCategoriaText}
							isLoading={list2.isLoading}
							isDisabled={confirmarVenta}
							items={list2.items}
							placeholder="Busca una Categoria"
							name="categoria"
							label="Categoria"
							size="sm"
							onInputChange={(value) => {
								list2.setFilterText(value);
							}}
							onSelectionChange={handleValueCategoria}
						>
							{(item) => (
								<AutocompleteItem
									key={item.id_categoria}
									textValue={item.nombre_categoria}
								>
									{item.nombre_categoria}
								</AutocompleteItem>
							)}
						</Autocomplete>
						<article className="flex flex-col md:flex-row bg-white gap-4">
							<Input
								isRequired
								size="sm"
								type="text"
								className="col-span-1"
								isInvalid={validNombreSubCategoria}
								label="Nombre Sub-Categoría"
								placeholder="Ingrese el nombre de la Sub-Categoría"
								value={valueNombreSubCategoria}
								onValueChange={setNombreSubCategoria}
							/>
							<hr />
							<Select
								isRequired
								size="sm"
								isInvalid={validEstadoProducto}
								label="Estado Categoría"
								placeholder="Selecciona un estado para la categoría"
								selectedKeys={[valueEstadoProducto]}
								onChange={handleSelectionChange}
							>
								{estados_de_productos.map((producto) => (
									<SelectItem key={producto.key}>{producto.label}</SelectItem>
								))}
							</Select>
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
										}}
									>
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
									onPress={confirmar}
								>
									Confirmar
								</Button>
								<Button
									className="font-bold"
									color="danger"
									onPress={() => {
										onClose();
										setIsEditProduct(false);
									}}
								>
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
