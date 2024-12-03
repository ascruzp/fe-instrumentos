import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../src/store/store";
import { insertarCategoria } from "@/src/store/reducer";

interface DetalleMarca {
	nombre_marca: string;
	estado_marca: number;
}

const estados_de_categorias = [
	{ key: "Disponible", label: "Disponible" },
	{ key: "No Disponible", label: "No Disponible" },
];
export function AgregarNuevoProducto({ setIsNewProduct, seleccionarProducto }: { seleccionarProducto: DetalleMarca; setIsNewProduct: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);

	const [validCategoria, setValidCategria] = useState(false);
	const [valueEstadoCategoria, setEstadoCategoria] = useState(seleccionarProducto.estado_marca === 1 ? "Disponible" : "No Disponible");

	const [validNombreCategoria, setValidNombreCategoria] = useState(false);
	const [valueNombreCategoria, setNombreCategoria] = useState(seleccionarProducto.nombre_marca);
	const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setEstadoCategoria(e.target.value);
	};
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (valueEstadoCategoria === "") {
			setValidCategria(true);
		} else {
			setValidCategria(false);
		}
	}, [valueEstadoCategoria]);

	useEffect(() => {
		if (valueNombreCategoria === "") {
			setValidNombreCategoria(true);
		} else {
			setValidNombreCategoria(false);
		}
	}, [valueNombreCategoria]);

	const confirmar = async () => {
		if (!seleccionarProducto) return;
		setLoading(true);
		const productoActualizado: DetalleMarca = {
			nombre_marca: valueNombreCategoria,
			estado_marca: valueEstadoCategoria === "Disponible" ? 1 : 0,
		};
		try {
			const response = await fetch("/api/marcas/insertarMarca", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al agregar marca");
			}
			setConfirmarVenta(true);
			const data = await response.json();
			dispatch(insertarCategoria(data));
			setLoading(false);
		} catch (error: any) {
			console.error(error.message);
			setLoading(false);
		}
	};

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						{confirmarVenta ? <h2>Marca agregado</h2> : <h2>Agregar Marca</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col md:flex-row bg-white gap-4">
							<Input
								isRequired
								size="sm"
								type="text"
								className="col-span-1"
								isInvalid={validNombreCategoria}
								label="Nombre Marca"
								placeholder="Ingrese el nombre de la Marca"
								value={valueNombreCategoria}
								onValueChange={setNombreCategoria}
							/>
							<Select
								isRequired
								size="sm"
								isInvalid={validCategoria}
								label="Estado Categoría"
								placeholder="Selecciona un estado para la marca"
								selectedKeys={[valueEstadoCategoria]}
								onChange={handleSelectionChange}
							>
								{estados_de_categorias.map((producto) => (
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
											setIsNewProduct(false);
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
									isLoading={loading}
									onPress={confirmar}
								>
									Confirmar
								</Button>
								<Button
									className="font-bold"
									color="danger"
									onPress={() => {
										onClose();
										setIsNewProduct(false);
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
