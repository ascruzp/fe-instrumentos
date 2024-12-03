import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../src/store/store";
import { insertarCliente } from "../../../../../src/store/reducer";
import { getLocalTimeZone, now } from "@internationalized/date";

interface DetalleCliente {
	nombre_cliente: string;
	fecha_registro_cliente: string;
	usuario_cliente: string;
	password_cliente: string;
	celular_cliente: string;
	direccion_cliente: string;
	dni_cliente: string;
}

export function AgregarNuevoClienteS({ setIsNewClient, seleccionarCliente }: { seleccionarCliente: DetalleCliente; setIsNewClient: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const [valueNombreCliente, setNombreCliente] = useState(seleccionarCliente.nombre_cliente);
	const [valueUsuarioCliente, setUsuarioCliente] = useState(seleccionarCliente.usuario_cliente);
	const [valuePasswordCliente, setPasswordCliente] = useState(seleccionarCliente.password_cliente);
	const [valueCelularCliente, setCelularCliente] = useState(seleccionarCliente.celular_cliente);
	const [valueDireccionCliente, setDireccionCliente] = useState(seleccionarCliente.direccion_cliente);
	const [valueDNICliente, setDNICliente] = useState(seleccionarCliente.dni_cliente);

	const [validNombreCliente, setValidNombreCliente] = useState(false);

	useEffect(() => {
		if (!valueNombreCliente) {
			setValidNombreCliente(true);
		} else {
			setValidNombreCliente(false);
		}
	}, [valueNombreCliente]);

	const confirmar = async () => {
		if (!seleccionarCliente) return;
		setLoading(true);
		const fechaActual = now(getLocalTimeZone());
		const fechaOrdenada = `${fechaActual.year}-${String(fechaActual.month).padStart(2, "0")}-${String(fechaActual.day).padStart(2, "0")}`;
		const clienteNuevo: DetalleCliente = {
			nombre_cliente: valueNombreCliente,
			fecha_registro_cliente: fechaOrdenada,
			usuario_cliente: valueUsuarioCliente || "",
			password_cliente: valuePasswordCliente || "",
			celular_cliente: valueCelularCliente || "",
			direccion_cliente: valueDireccionCliente || "",
			dni_cliente: valueDNICliente || "",
		};

		try {
			const response = await fetch("/api/clientes/insertarCliente", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(clienteNuevo),
			});

			if (!response.ok) {
				throw new Error("Error al agregar el cliente");
			}
			setConfirmarVenta(true);
			const data = await response.json();
			dispatch(insertarCliente(data));
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
						{confirmarVenta ? <h2>Cliente Agregado</h2> : <h2>Agregar Cliente</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<Input
								isRequired
								size="sm"
								type="text"
								isInvalid={validNombreCliente}
								label="Nombre Cliente"
								placeholder="Ingrese el nombre del cliente"
								value={valueNombreCliente}
								onValueChange={setNombreCliente}
							/>
							<div className="flex gap-4">
								<Input
									size="sm"
									type="number"
									label="DNI"
									placeholder="Ingrese el DNI del cliente"
									value={valueDNICliente}
									onValueChange={setDNICliente}
								/>
								<Input
									size="sm"
									type="number"
									label="Celular"
									placeholder="Ingrese el celular del cliente"
									value={valueCelularCliente}
									onValueChange={setCelularCliente}
								/>
							</div>
							<Input
								size="sm"
								type="text"
								label="Dirección"
								placeholder="Ingrese la dirección del cliente"
								value={valueDireccionCliente}
								onValueChange={setDireccionCliente}
							/>
							<div className="flex gap-4">
								<Input
									size="sm"
									type="text"
									label="Usuario"
									placeholder="Ingrese el usuario del cliente"
									value={valueUsuarioCliente}
									onValueChange={setUsuarioCliente}
								/>
								<Input
									size="sm"
									type="text"
									label="Contraseña"
									placeholder="Ingrese la contraseña"
									value={valuePasswordCliente}
									onValueChange={setPasswordCliente}
								/>
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
											setIsNewClient(false);
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
										setIsNewClient(false);
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
