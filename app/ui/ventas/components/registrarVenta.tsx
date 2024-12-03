import { useEffect, useState, useRef } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { insertarBoleta, insertarCliente } from "@/src/store/reducer";
import { AppDispatch } from "@/src/store/store";
import { useDispatch } from "react-redux";

type Producto = {
	key: number;
	nombre: string;
	cantidad: number;
	precio_unitario: number;
	importe: number;
};

type Venta = {
	cliente: string;
	celular_cliente?: string;
	direccion_cliente?: string;
	fecha_registro: string;
	metodo_pago: number;
	fecha_boleta: string;
	metodo_entrega: number;
	total_venta: number;
	productos: Producto[];
};

export function RegistrarVenta({ registrarVenta, limpiarVenta }: { registrarVenta: Venta; limpiarVenta: () => void }) {
	const imprimirBoletaRef = useRef<HTMLElement>(null);
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [numero_boleta, setNumeroBoleta] = useState<number | null>(null);
	const dispatch = useDispatch<AppDispatch>();
	const handlePrint = useReactToPrint({
		content: () => imprimirBoletaRef.current,
	});

	const handleDownload = async () => {
		if (imprimirBoletaRef.current) {
			const canvas = await html2canvas(imprimirBoletaRef.current, {
				scale: 2,
			}); // Puedes ajustar el valor de scale para cambiar la resolución
			const imgData = canvas.toDataURL("image/png", 1.0); // Cambia a JPEG y ajusta la calidad (1.0 es la mejor calidad)

			const linkImagen = document.createElement("a");
			linkImagen.href = imgData;
			linkImagen.download = `BOLETA_ELECTRONICA-${registrarVenta.fecha_registro.replace(/ /g, "-")}.png`;
			document.body.appendChild(linkImagen);
			linkImagen.click();
			document.body.removeChild(linkImagen);
			/*
            const pdf = new jsPDF();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("boleta.pdf");
            */
		}
	};

	useEffect(() => {
		fetchUltimoNumeroBoleta();
	}, []);

	const fetchUltimoNumeroBoleta = async () => {
		try {
			const response = await fetch("/api/ventas/ultimoNumeroBoleta", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				throw new Error("Error al obtener los métodos de pago");
			}

			const data = await response.json();
			const ultimoNumeroBoleta = data[0].ultimo_numero_boleta;
			return ultimoNumeroBoleta;
		} catch (error) {
			console.error("Error al obtener los métodos de pago:", error);
		}
	};

	const fetchUltimoIDCliente = async () => {
		try {
			const response = await fetch("/api/ventas/ultimoIDCliente", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				throw new Error("Error al obtener el id cliente");
			}

			const data = await response.json();
			const ultimoNumeroBoleta = data[0].ultimo_id_cliente;
			return ultimoNumeroBoleta;
		} catch (error) {
			console.error("Error ultimoIDClienteÑ", error);
		}
	};
	const metodoPagoMap: { [key: number]: string } = {
		1: "Efectivo",
		2: "Tarjeta de Crédito",
		3: "Tarjeta de Débito",
		4: "Transferencia Bancaria",
		5: "Paypal",
		6: "Yape",
	};

	const confirmar = async () => {
		// handlePrint();
		setConfirmarVenta(true);
		const num2 = await fetchUltimoNumeroBoleta();
		setNumeroBoleta(num2);
		console.log(registrarVenta);
		try {
			const response = await fetch("/api/ventas/subirVenta", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registrarVenta),
			});

			if (!response.ok) {
				throw new Error("Error al registrar la venta");
			}
			const num = await fetchUltimoNumeroBoleta();
			dispatch(
				insertarBoleta({
					numero_boleta: num,
					nombre_cliente: registrarVenta.cliente,
					celular_cliente: registrarVenta.celular_cliente || "",
					direccion_cliente: registrarVenta.direccion_cliente || "",
					fecha_registro_cliente: registrarVenta.fecha_registro,
					fecha_boleta: registrarVenta.fecha_boleta,
					metodo_entrega: registrarVenta.metodo_entrega === 1 ? "En Tienda" : "Envío",
					total_boleta: registrarVenta.total_venta.toString(),
					nombre_metodo_pago: metodoPagoMap[registrarVenta.metodo_pago],
					estado_boleta: 1,
					tracking: "",
				})
			);
			dispatch(
				insertarCliente({
					id_cliente: await fetchUltimoIDCliente(),
					nombre_cliente: registrarVenta.cliente,
					celular_cliente: registrarVenta.celular_cliente || "",
					direccion_cliente: registrarVenta.direccion_cliente || "",
					fecha_registro_cliente: registrarVenta.fecha_registro,
					usuario_cliente: "",
					password_cliente: "",
					dni_cliente: "",
				})
			);
		} catch (error: any) {
			console.error(error.message);
		}
	};

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						{confirmarVenta ? <h2>Venta Registrada</h2> : <h2>¿Confirmar registro de venta?</h2>}
					</ModalHeader>
					<ModalBody className="py-5 text-xs">
						<div
							style={{
								boxShadow: confirmarVenta ? "rgb(23 201 100) 0px 0px 15px 0px, rgb(23 201 100) 0px 0px 15px 0px" : "rgb(0 111 238) 0px 0px 15px 0px, rgb(0 111 238) 0px 0px 15px 0px",
							}}
						>
							<article
								ref={imprimirBoletaRef}
								className="flex flex-col max-w-md bg-white px-5 py-10 gap-4"
								style={{
									fontFamily: "Arial, Helvetica, sans-serif",
								}}
							>
								<ul className="text-center uppercase tracking-widest leading-4">
									<li>SilverMusic</li>
									<li>R.U.C. 10424720891</li>
									<li>Asoc. Villa Cristo Rey Mz. 15 - Lt. 1, C.P.M. Leguía, Tacna - Tacna - Tacna</li>
									<li>Teléfono (052) 314148</li>
									<li className="py-1">
										<h3 className="text-base font-bold uppercase tracking-normal">Boleta de Venta electrónica</h3>
										<p className="text-sm tracking-widest -mt-1">N° 001-{Number(numero_boleta) + 1}</p>
									</li>
								</ul>
								<section>
									<div className="grid grid-cols-2">
										<p className="font-semibold flex justify-between">
											Cliente<span>:</span>
										</p>
										<p className="text-end uppercase">{registrarVenta.cliente}</p>
									</div>
									{registrarVenta.celular_cliente && (
										<div className="grid grid-cols-2">
											<p className="font-semibold flex justify-between">
												Celular<span>:</span>
											</p>
											<p className="text-end">{registrarVenta.celular_cliente}</p>
										</div>
									)}
									{registrarVenta.direccion_cliente && (
										<div className="grid grid-cols-2">
											<p className="font-semibold flex justify-between">
												Dirección<span>:</span>
											</p>
											<p className="text-end uppercase">{registrarVenta.direccion_cliente}</p>
										</div>
									)}
									{registrarVenta.fecha_boleta && (
										<>
											<div className="grid grid-cols-2">
												<p className="font-semibold flex justify-between">
													Fecha de Emisión
													<span>:</span>
												</p>
												<p className="text-end">{registrarVenta.fecha_boleta.split(" ")[0]}</p>
											</div>
											<div className="grid grid-cols-2">
												<p className="font-semibold flex justify-between">
													Hora de Emisión
													<span>:</span>
												</p>
												<p className="text-end">{registrarVenta.fecha_boleta.split(" ")[1]}</p>
											</div>
										</>
									)}
								</section>
								<table className="min-w-full bg-white">
									<thead>
										<tr>
											<th className="py-1 pr-0.5">Cant.</th>
											<th className="py-1 pr-0.5 text-start">Descripción</th>
											<th className="py-1 pr-0.5">P. Unit</th>
											<th className="py-1">Importe</th>
										</tr>
									</thead>
									<tbody>
										{registrarVenta.productos.map((producto) => (
											<tr key={producto.key}>
												<td className="pr-0.5 text-center">{producto.cantidad}</td>
												<td className="pr-0.5">{producto.nombre}</td>
												<td className="pr-0.5 text-center ">{producto.precio_unitario.toFixed(2)}</td>
												<td className="text-center">{producto.importe.toFixed(2)}</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className="text-right mt-4">
									<span className="font-semibold">Total Venta: </span> S/. {registrarVenta.total_venta.toFixed(2)} PEN
								</div>
								<div className="text-center mt-4">GRACIAS POR SU COMPRA</div>
							</article>
						</div>
					</ModalBody>
					<ModalFooter className="border-t-1 border-gray-400">
						{confirmarVenta ? (
							<div className="flex justify-between w-full">
								<div className="flex gap-2">
									<Button
										className="font-bold"
										variant="flat"
										color="secondary"
										onPress={handleDownload}
									>
										Descargar
									</Button>
									<Button
										className="font-bold"
										variant="flat"
										color="primary"
										onPress={handlePrint}
									>
										Imprimir
									</Button>
								</div>
								<div>
									<Button
										className="font-bold"
										color="secondary"
										onPress={() => {
											onClose();
											limpiarVenta();
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
									onPress={onClose}
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
