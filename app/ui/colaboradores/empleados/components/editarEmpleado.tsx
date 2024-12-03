import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../../src/store/store";
import { updateEmpleados } from "../../../../../src/store/reducer";

interface DetalleEmpleado {
	DNI_empleado: string;
	nombre_empleado: string;
	apellido_empleado: string;
	celular_empleado: string;
	direccion_empleado: string;
	sexo: string;
	estado_empleado: string;
	usuario_empleado: string;
	contrasena_empleado: string;
	estado_cargo: string;
}

const estados_de_empleados = [
	{ key: "Activo", label: "Activo" },
	{ key: "Inactivo", label: "Inactivo" },
];

const estados_de_cargo = [
	{ key: "1", label: "Empleado" },
	{ key: "2", label: "Administrador" },
];

export function EditarEmpleado({ seleccionarEmpleado, setIsEditEmpleado }: { seleccionarEmpleado: DetalleEmpleado; setIsEditEmpleado: Dispatch<SetStateAction<boolean>> }) {
	const dispatch = useDispatch<AppDispatch>();
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [validDNI, setValidDNI] = useState(false);
	const [validNombre, setValidNombre] = useState(false);
	const [validApellido, setValidApellido] = useState(false);
	const [validCelular, setValidCelular] = useState(false);
	const [validDireccion, setValidDireccion] = useState(false);
	const [validSexo, setValidSexo] = useState(false);
	const [validEstadoEmpleado, setValidEstadoEmpleado] = useState(false);
	const [validUsuario, setValidUsuario] = useState(false);
	const [validContrasena, setValidContrasena] = useState(false);
	const [validEstadoCargo, setValidEstadoCargo] = useState(false);

	const [valueDNI, setDNI] = useState(seleccionarEmpleado.DNI_empleado);
	const [valueNombre, setNombre] = useState(seleccionarEmpleado.nombre_empleado);
	const [valueApellido, setApellido] = useState(seleccionarEmpleado.apellido_empleado);
	const [valueCelular, setCelular] = useState(seleccionarEmpleado.celular_empleado);
	const [valueDireccion, setDireccion] = useState(seleccionarEmpleado.direccion_empleado);
	const [valueSexo, setSexo] = useState(seleccionarEmpleado.sexo);
	const [valueEstadoEmpleado, setEstadoEmpleado] = useState(seleccionarEmpleado.estado_empleado);
	const [valueUsuario, setUsuario] = useState(seleccionarEmpleado.usuario_empleado);
	const [valueContrasena, setContrasena] = useState(seleccionarEmpleado.contrasena_empleado);
	const [valueEstadoCargo, setEstadoCargo] = useState(seleccionarEmpleado.estado_cargo);

	const maxLength = {
		DNI: 8,
		nombre: 50,
		apellido: 30,
		celular: 15,
		direccion: 100,
		usuario: 45,
		contrasena: 45,
	};

	useEffect(() => {
		setValidDNI(valueDNI.length > maxLength.DNI);
	}, [valueDNI]);

	useEffect(() => {
		setValidNombre(valueNombre.length > maxLength.nombre);
	}, [valueNombre]);

	useEffect(() => {
		setValidApellido(valueApellido.length > maxLength.apellido);
	}, [valueApellido]);

	useEffect(() => {
		setValidCelular(valueCelular.length > maxLength.celular);
	}, [valueCelular]);

	useEffect(() => {
		setValidDireccion(valueDireccion.length > maxLength.direccion);
	}, [valueDireccion]);

	useEffect(() => {
		setValidSexo(valueSexo === "");
	}, [valueSexo]);

	useEffect(() => {
		setValidEstadoEmpleado(valueEstadoEmpleado === "");
	}, [valueEstadoEmpleado]);

	useEffect(() => {
		setValidUsuario(valueUsuario.length > maxLength.usuario);
	}, [valueUsuario]);

	useEffect(() => {
		setValidContrasena(valueContrasena.length > maxLength.contrasena);
	}, [valueContrasena]);

	useEffect(() => {
		setValidEstadoCargo(valueEstadoCargo === "");
	}, [valueEstadoCargo]);

	const handleEstadoCargoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setEstadoCargo(e.target.value);
	};

	const confirmar = async () => {
		if (validDNI || validNombre || validApellido || validCelular || validDireccion || validSexo || validEstadoEmpleado || validUsuario || validContrasena || validEstadoCargo) {
			return;
		}

		const empleadoActualizado = {
			DNI_empleado: valueDNI,
			nombre_empleado: valueNombre,
			apellido_empleado: valueApellido,
			celular_empleado: valueCelular,
			direccion_empleado: valueDireccion,
			sexo: valueSexo,
			estado_empleado: valueEstadoEmpleado,
			usuario_empleado: valueUsuario,
			contrasena_empleado: valueContrasena,
			estado_cargo: valueEstadoCargo,
		};

		try {
			const response = await fetch("/api/empleados/editarEmpleado", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(empleadoActualizado),
			});

			if (!response.ok) {
				throw new Error("Error al editar el empleado");
			}
			dispatch(updateEmpleados(empleadoActualizado));
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
						{confirmarVenta ? <h2>Usuario Actualizado</h2> : <h2>Editar Usuario</h2>}
					</ModalHeader>
					<ModalBody className="p-5 text-xs">
						<article className="flex flex-col bg-white gap-4">
							<Input
								isDisabled
								className="col-span-1"
								size="sm"
								label={`DNI (max ${maxLength.DNI} dígitos)`}
								placeholder="Ingrese el DNI"
								value={valueDNI}
								onChange={(e) => setDNI(e.target.value)}
								isInvalid={validDNI}
								maxLength={maxLength.DNI}
							/>
							<div className="flex gap-4">
								<Input
									isRequired
									className="col-span-1"
									size="sm"
									label={`Nombre (max ${maxLength.nombre} caracteres)`}
									placeholder="Ingrese el nombre"
									value={valueNombre}
									onChange={(e) => setNombre(e.target.value)}
									isInvalid={validNombre}
									maxLength={maxLength.nombre}
								/>
								<Input
									isRequired
									className="col-span-1"
									size="sm"
									label={`Apellido (max ${maxLength.apellido} caracteres)`}
									placeholder="Ingrese el apellido"
									value={valueApellido}
									onChange={(e) => setApellido(e.target.value)}
									isInvalid={validApellido}
									maxLength={maxLength.apellido}
								/>
							</div>
							<div className="flex gap-4">
								<Input
									isRequired
									className="col-span-1"
									size="sm"
									label={`Celular (max ${maxLength.celular} dígitos)`}
									placeholder="Ingrese el número de celular"
									value={valueCelular}
									onChange={(e) => setCelular(e.target.value)}
									isInvalid={validCelular}
									maxLength={maxLength.celular}
								/>
								<Select
									isRequired
									className="col-span-1"
									size="sm"
									label="Estado Cargo"
									selectedKeys={[valueEstadoCargo]}
									onChange={handleEstadoCargoChange}
									isInvalid={validEstadoCargo}
								>
									{estados_de_cargo.map((estado) => (
										<SelectItem key={estado.key}>{estado.label}</SelectItem>
									))}
								</Select>
							</div>
							<Textarea
								isRequired
								className="col-span-1"
								size="sm"
								label={`Dirección (max ${maxLength.direccion} caracteres)`}
								placeholder="Ingrese la dirección"
								value={valueDireccion}
								onChange={(e) => setDireccion(e.target.value)}
								isInvalid={validDireccion}
								maxLength={maxLength.direccion}
							/>
							<div className="flex gap-4">
								<Select
									isRequired
									className="col-span-1"
									size="sm"
									label="Sexo"
									selectedKeys={[valueSexo]}
									onChange={(e) => setSexo(e.target.value)}
									isInvalid={validSexo}
								>
									<SelectItem key="M">Masculino</SelectItem>
									<SelectItem key="F">Femenino</SelectItem>
								</Select>
								<Select
									isRequired
									className="col-span-1"
									size="sm"
									label={`Estado Empleado`}
									selectedKeys={[valueEstadoEmpleado]}
									onChange={(e) => setEstadoEmpleado(e.target.value)}
									isInvalid={validEstadoEmpleado}
								>
									{estados_de_empleados.map((estado) => (
										<SelectItem key={estado.key}>{estado.label}</SelectItem>
									))}
								</Select>
							</div>
							<div className="flex gap-4">
								<Input
									isRequired
									className="col-span-1"
									size="sm"
									label={`Usuario (max ${maxLength.usuario} caracteres)`}
									placeholder="Ingrese el nombre de usuario"
									value={valueUsuario}
									onChange={(e) => setUsuario(e.target.value)}
									isInvalid={validUsuario}
									maxLength={maxLength.usuario}
								/>
								<Input
									isRequired
									className="col-span-1"
									size="sm"
									label={`Contraseña (max ${maxLength.contrasena} caracteres)`}
									placeholder="Ingrese la contraseña"
									value={valueContrasena}
									onChange={(e) => setContrasena(e.target.value)}
									isInvalid={validContrasena}
									maxLength={maxLength.contrasena}
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
											setIsEditEmpleado(false);
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
										setIsEditEmpleado(false);
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
