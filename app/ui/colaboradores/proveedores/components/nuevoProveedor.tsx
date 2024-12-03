import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../src/store/store";
import { insertarProveedor } from "../../../../../src/store/reducer";
import { getLocalTimeZone, now } from "@internationalized/date";

interface DetalleProveedor {
	RUC_proveedor: string;
	nombre_proveedor: string;
	celular_proveedor: string;
	direccion_proveedor: string;
}

export function AgregarNuevoProveedor({ setIsNewProveedor, seleccionarProveedor }: { seleccionarProveedor: DetalleProveedor; setIsNewProveedor: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	// Estado para los valores de los campos
	const [valueRUCProveedor, setRUCProveedor] = useState(seleccionarProveedor.RUC_proveedor);
	const [valueNombreProveedor, setNombreProveedor] = useState(seleccionarProveedor.nombre_proveedor);
	const [valueCelularProveedor, setCelularProveedor] = useState(seleccionarProveedor.celular_proveedor);
	const [valueDireccionProveedor, setDireccionProveedor] = useState(seleccionarProveedor.direccion_proveedor);

	// Estados para las validaciones
	const [validRUCProveedor, setValidRUCProveedor] = useState(false);
	const [validCelularProveedor, setValidCelularProveedor] = useState(false);
	const [validNombreProveedor, setValidNombreProveedor] = useState(false);
	const [validDireccionProveedor, setValidDireccionProveedor] = useState(false);

	// Validación de los campos
	useEffect(() => {
		setValidRUCProveedor(!/^[0-9]{11}$/.test(valueRUCProveedor));
		setValidCelularProveedor(!/^[0-9]{9}$/.test(valueCelularProveedor));
		setValidNombreProveedor(valueNombreProveedor.trim() === "");
		setValidDireccionProveedor(valueDireccionProveedor.trim() === "");
	}, [valueRUCProveedor, valueCelularProveedor, valueNombreProveedor, valueDireccionProveedor]);

	const confirmar = async () => {
		if (!valueRUCProveedor || !valueNombreProveedor || !valueCelularProveedor || !valueDireccionProveedor) {
			return; // Validar que todos los campos estén completos
		}
		setLoading(true);
		const fechaActual = now(getLocalTimeZone());
		const fechaOrdenada = `${fechaActual.year}-${String(fechaActual.month).padStart(2, "0")}-${String(fechaActual.day).padStart(2, "0")}`;

		const proveedorNuevo: DetalleProveedor = {
			RUC_proveedor: valueRUCProveedor,
			nombre_proveedor: valueNombreProveedor,
			celular_proveedor: valueCelularProveedor,
			direccion_proveedor: valueDireccionProveedor,
		};

		try {
			const response = await fetch("/api/proveedores/insertarProveedor", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(proveedorNuevo),
			});

			if (!response.ok) {
				throw new Error("Error al agregar el proveedor");
			}
			setConfirmarVenta(true);
			const data = await response.json();
			dispatch(insertarProveedor(data));
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
						{confirmarVenta ? <h2>Proveedor Agregado</h2> : <h2>Agregar Proveedor</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<Input
								isRequired
								size="sm"
								type="text"
								isInvalid={validNombreProveedor}
								label="Nombre Proveedor"
								placeholder="Ingrese el nombre del proveedor"
								value={valueNombreProveedor}
								onValueChange={setNombreProveedor}
							/>
							<div className="flex gap-4">
								<Input
									isRequired
									size="sm"
									type="number"
									label="RUC (máx 11 dígitos)"
									placeholder="Ingrese el RUC del proveedor"
									value={valueRUCProveedor}
									onValueChange={setRUCProveedor}
									isInvalid={validRUCProveedor}
								/>
								<Input
									isRequired
									size="sm"
									type="number"
									label="Celular (máx 9 dígitos)"
									placeholder="Ingrese el celular del proveedor"
									value={valueCelularProveedor}
									onValueChange={setCelularProveedor}
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
								onValueChange={setDireccionProveedor}
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
											setIsNewProveedor(false);
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
										setIsNewProveedor(false);
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
