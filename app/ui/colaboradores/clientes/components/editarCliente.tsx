import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Autocomplete, AutocompleteItem, Textarea } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../src/store/store";
import { updateClientes, updateInventario } from "../../../../../src/store/reducer";

interface DetalleCliente {
	id_cliente: number;
	nombre_cliente: string;
	fecha_registro_cliente: string;
	usuario_cliente: string;
	password_cliente: string;
	celular_cliente: string;
	direccion_cliente: string;
	dni_cliente: string;
}

export function EditarCliente({ seleccionarProducto, setIsEditProduct }: { seleccionarProducto: DetalleCliente; setIsEditProduct: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);

	const [valueDNICliente, setValueDNICliente] = useState(seleccionarProducto.dni_cliente);
	const [valueUsuarioCliente, setValueUsuarioCliente] = useState(seleccionarProducto.usuario_cliente);
	const [valueDireccionCliente, setValueDireccionCliente] = useState(seleccionarProducto.direccion_cliente);
	const [valuePasswordCliente, setValuePasswordCliente] = useState(seleccionarProducto.password_cliente);

	const [valueCelularCliente, setValueCelularCliente] = useState(seleccionarProducto.celular_cliente);
	const [valueNombreCliente, setNombreCliente] = useState(seleccionarProducto.nombre_cliente);
	const [validNombreCliente, setvalidNombreCliente] = useState(false);
	const [valueFechaRegistroCliente, setFechaRegistroCliente] = useState(seleccionarProducto.fecha_registro_cliente);

	useEffect(() => {
		if (valueNombreCliente === "") {
			setvalidNombreCliente(true);
		} else {
			setvalidNombreCliente(false);
		}
	}, [valueNombreCliente]);

	const confirmar = async () => {
		if (!seleccionarProducto) return;
		const productoActualizado = {
			id_cliente: seleccionarProducto.id_cliente,
			nombre_cliente: valueNombreCliente,
			fecha_registro_cliente: valueFechaRegistroCliente || "",
			usuario_cliente: valueUsuarioCliente || "",
			password_cliente: valuePasswordCliente || "",
			celular_cliente: valueCelularCliente || "",
			direccion_cliente: valueDireccionCliente || "",
			dni_cliente: valueDNICliente || "",
		};
		console.log(productoActualizado);
		try {
			const response = await fetch("/api/clientes/editarCliente", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(productoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el cliente");
			}
			dispatch(updateClientes(productoActualizado));
			console.log(productoActualizado);
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
						{confirmarVenta ? <h2>Cliente Actualizado</h2> : <h2>Editar Cliente</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<div className="grid grid-cols-2 gap-4">
								<Input
									isDisabled
									className="col-span-1"
									size="sm"
									type="number"
									label="ID"
									value={seleccionarProducto.id_cliente.toString()}
								/>
								<Input
									isDisabled
									size="sm"
									className="col-span-1"
									type="text"
									label="Fecha de Registro"
									value={valueFechaRegistroCliente}
									onValueChange={setFechaRegistroCliente}
								/>
							</div>
							<hr />
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
									onValueChange={setValueDNICliente}
								/>
								<Input
									size="sm"
									type="number"
									label="Celular"
									placeholder="Ingrese el número de celular"
									value={valueCelularCliente}
									onValueChange={setValueCelularCliente}
								/>
							</div>
							<Input
								size="sm"
								type="text"
								label="Dirección"
								placeholder="Ingrese la dirección del cliente"
								value={valueDireccionCliente}
								onValueChange={setValueDireccionCliente}
							/>
							<div className="flex gap-4">
								<Input
									size="sm"
									type="text"
									label="Usuario"
									placeholder="Ingrese el usuario del cliente"
									value={valueUsuarioCliente}
									onValueChange={setValueUsuarioCliente}
								/>
								<Input
									size="sm"
									type="text"
									label="Contraseña"
									placeholder="Ingrese la contraseña del cliente"
									value={valuePasswordCliente}
									onValueChange={setValuePasswordCliente}
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
