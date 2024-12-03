import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../src/store/store";
import { DetalleBoleta, updateBoleta, updateCategorias, updateInventario, updateMarcas } from "../../../../../src/store/reducer";

export interface BoletaPrincipal {
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
const estados_de_productos = [
	{ key: "Completado", label: "Completado" },
	{ key: "En Proceso", label: "En Proceso" },
];
export function ActualizarEstado({ seleccionarProducto, setIsEditProduct }: { seleccionarProducto: BoletaPrincipal; setIsEditProduct: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);

	const [valueTracking, setTracking] = useState(seleccionarProducto.tracking);
	const [validEstadoProducto, setValidEstadoProducto] = useState(false);
	const [valueEstadoProducto, setEstadoProducto] = useState(seleccionarProducto.estado_boleta === 1 ? "Completado" : "En Proceso");
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

	const confirmar = async () => {
		const productoActualizado = {
			numero_boleta: seleccionarProducto.numero_boleta,
			estado_boleta: valueEstadoProducto === "Completado" ? 1 : 2,
			tracking: valueTracking,
			nombre_cliente: seleccionarProducto.nombre_cliente,
			celular_cliente: seleccionarProducto.celular_cliente,
			direccion_cliente: seleccionarProducto.direccion_cliente,
			fecha_registro_cliente: seleccionarProducto.fecha_registro_cliente,
			metodo_entrega: seleccionarProducto.metodo_entrega,
			nombre_metodo_pago: seleccionarProducto.nombre_metodo_pago,
			fecha_boleta: seleccionarProducto.fecha_boleta,
			total_boleta: seleccionarProducto.total_boleta,
		};
		try {
			const response = await fetch("/api/ventas/actualizarEstado", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el producto");
			}
			dispatch(updateBoleta(productoActualizado));
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
						{confirmarVenta ? <h2>Estado Actualizada</h2> : <h2>Editar Estado</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<Input
								isDisabled
								size="sm"
								type="text"
								className="col-span-1"
								label="Número Boleta"
								value={seleccionarProducto.numero_boleta.toString()}
							/>
							<hr />
							<div className="flex gap-4">
								<Input
									size="sm"
									type="text"
									className="col-span-1"
									label="Tracking"
									placeholder="Ingrese tracking"
									value={valueTracking}
									onValueChange={setTracking}
								/>
								<Select
									isRequired
									size="sm"
									isInvalid={validEstadoProducto}
									label="Estado Venta"
									placeholder="Selecciona un estado para la venta"
									selectedKeys={[valueEstadoProducto]}
									onChange={handleSelectionChange}
								>
									{estados_de_productos.map((producto) => (
										<SelectItem key={producto.key}>{producto.label}</SelectItem>
									))}
								</Select>
							</div>
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
