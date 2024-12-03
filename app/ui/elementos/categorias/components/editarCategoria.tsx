import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../src/store/store";
import { updateCategorias, updateInventario } from "../../../../../src/store/reducer";

interface DetalleCategoria {
	id_categoria: number;
	nombre_categoria: string;
	estado_categoria: number;
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
export function EditarProducto({ seleccionarProducto, setIsEditProduct }: { seleccionarProducto: DetalleCategoria; setIsEditProduct: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [validNombreCategoria, setValidNombreCategoria] = useState(false);
	const [valueNombreCategoria, setNombreCategoria] = useState(seleccionarProducto.nombre_categoria);
	const [validEstadoProducto, setValidEstadoProducto] = useState(false);
	const [valueEstadoProducto, setEstadoProducto] = useState(seleccionarProducto.estado_categoria === 1 ? "Disponible" : "No Disponible");
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setEstadoProducto(e.target.value);
	};

	useEffect(() => {
		if (valueEstadoProducto === "") {
			setValidEstadoProducto(true);
		} else {
			setValidEstadoProducto(false);
		}
	}, [valueEstadoProducto]);

	useEffect(() => {
		if (valueNombreCategoria === "") {
			setValidNombreCategoria(true);
		} else {
			setValidNombreCategoria(false);
		}
	}, [valueNombreCategoria]);

	const confirmar = async () => {
		console.log(valueEstadoProducto);
		if (!seleccionarProducto) return;
		const productoActualizado = {
			id_categoria: seleccionarProducto.id_categoria,
			nombre_categoria: valueNombreCategoria,
			estado_categoria: valueEstadoProducto === "No Disponible" ? 0 : 1,
		};
		console.log(productoActualizado);
		try {
			const response = await fetch("/api/categoria/editarCategoria", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el producto");
			}
			dispatch(updateCategorias(productoActualizado));
			console.log(productoActualizado);
			setConfirmarVenta(true);
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						{confirmarVenta ? <h2>Categoría Actualizada</h2> : <h2>Editar Categoría</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col md:flex-row bg-white gap-4">
							<Input
								isRequired
								size="sm"
								type="text"
								className="col-span-1"
								isInvalid={validNombreCategoria}
								label="Nombre Categoría"
								placeholder="Ingrese el nombre de la Categoría"
								value={valueNombreCategoria}
								onValueChange={setNombreCategoria}
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
