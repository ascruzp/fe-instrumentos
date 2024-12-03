import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../src/store/store";
import { updateProveedores } from "../../../../../src/store/reducer";

interface DetalleProveedor {
	RUC_proveedor: string;
	nombre_proveedor: string;
	celular_proveedor: string;
	direccion_proveedor: string;
}

export function EditarProveedor({ seleccionarProveedor, setIsEditProduct }: { seleccionarProveedor: DetalleProveedor; setIsEditProduct: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);

	const [valueRUCProveedor, setValueRUCProveedor] = useState(seleccionarProveedor.RUC_proveedor);
	const [valueNombreProveedor, setValueNombreProveedor] = useState(seleccionarProveedor.nombre_proveedor);
	const [valueDireccionProveedor, setValueDireccionProveedor] = useState(seleccionarProveedor.direccion_proveedor);
	const [valueCelularProveedor, setValueCelularProveedor] = useState(seleccionarProveedor.celular_proveedor);

	const [validRUCProveedor, setValidRUCProveedor] = useState(false);
	const [validNombreProveedor, setValidNombreProveedor] = useState(false);
	const [validCelularProveedor, setValidCelularProveedor] = useState(false);
	const [validDireccionProveedor, setValidDireccionProveedor] = useState(false);

	const validateRUC = (ruc: string) => {
		const isValid = /^[0-9]{11}$/.test(ruc);
		setValidRUCProveedor(!isValid);
	};

	const validateNombre = (nombre: string) => {
		setValidNombreProveedor(nombre.trim() === "");
	};

	const validateCelular = (celular: string) => {
		const isValid = /^[0-9]{9}$/.test(celular);
		setValidCelularProveedor(!isValid);
	};

	const validateDireccion = (direccion: string) => {
		setValidDireccionProveedor(direccion.trim() === "");
	};

	useEffect(() => {
		validateRUC(valueRUCProveedor);
		validateNombre(valueNombreProveedor);
		validateCelular(valueCelularProveedor);
		validateDireccion(valueDireccionProveedor);
	}, [valueRUCProveedor, valueNombreProveedor, valueCelularProveedor, valueDireccionProveedor]);

	const confirmar = async () => {
		const proveedorActualizado = {
			RUC_proveedor: valueRUCProveedor,
			nombre_proveedor: valueNombreProveedor,
			celular_proveedor: valueCelularProveedor || "",
			direccion_proveedor: valueDireccionProveedor || "",
		};

		try {
			const response = await fetch("/api/proveedores/editarProveedor", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(proveedorActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el proveedor");
			}
			dispatch(updateProveedores(proveedorActualizado));
			setConfirmarVenta(true);
			const data = await response.json();
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						{confirmarVenta ? <h2>Proveedor Actualizado</h2> : <h2>Editar Proveedor</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<Input
								isDisabled
								className="col-span-1"
								size="sm"
								type="number"
								label="RUC"
								value={valueRUCProveedor}
								onChange={(e) => setValueRUCProveedor(e.target.value)}
								isInvalid={validRUCProveedor}
							/>
							<hr />
							<Input
								isRequired
								size="sm"
								type="text"
								isInvalid={validNombreProveedor}
								label="Nombre Proveedor"
								placeholder="Ingrese el nombre del proveedor"
								value={valueNombreProveedor}
								onChange={(e) => setValueNombreProveedor(e.target.value)}
							/>
							<div className="flex gap-4">
								<Input
									isRequired
									size="sm"
									type="number"
									label="Celular (máx 9 dígitos)"
									placeholder="Ingrese el número de celular"
									value={valueCelularProveedor}
									onChange={(e) => setValueCelularProveedor(e.target.value)}
									isInvalid={validCelularProveedor}
								/>
							</div>
							<Input
								isRequired
								size="sm"
								type="text"
								label="Dirección"
								placeholder="Ingrese la dirección del proveedor"
								value={valueDireccionProveedor}
								onChange={(e) => setValueDireccionProveedor(e.target.value)}
								isInvalid={validDireccionProveedor}
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
