import { useEffect, useState, useRef } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getLocalTimeZone, now } from "@internationalized/date";
import { insertarFactura } from "@/src/store/reducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store/store";

type Producto = {
	key: number;
	nombre: string;
	cantidad: number;
	precio_unitario: number;
	importe: number;
};

type Compra = {
	RUC_proveedor: string;
	proveedor: string;
	direccion_proveedor: string;
	fecha_registro: string;
	metodo_pago: number;
	fecha_boleta: string;
	total_compra: number;
	productos: Producto[];
};

export function RegistrarVenta({ registrarVenta, limpiarVenta }: { registrarVenta: Compra; limpiarVenta: () => void }) {
	const imprimirBoletaRef = useRef<HTMLElement>(null);
	const [confirmarVenta, setConfirmarVenta] = useState<boolean>(false);
	const [numero_boleta, setNumeroBoleta] = useState<string | null>(null);
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
			linkImagen.download = `FACTURA_ELECTRONICA-${registrarVenta.fecha_registro.replace(/ /g, "-")}.png`;
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
			const response = await fetch("/api/compras/ultimoNumeroFactura", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			if (!response.ok) {
				throw new Error("Error al obtener el ultimo numero de factura");
			}

			const data = await response.json();
			const ultimoNumeroFactura = data[0].ultimo_numero_factura;
			return ultimoNumeroFactura;
		} catch (error) {
			console.error("Error al obtener el numero de factura:", error);
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
	useEffect(() => {
		const function2 = async () => {
			const num2 = await fetchUltimoNumeroBoleta();
			if (num2) {
				const numeroIncrementado = Number(num2.slice(3)) + 1;
				const nuevoNumeroBoleta = `FAC${numeroIncrementado.toString().padStart(3, "0")}`;
				setNumeroBoleta(nuevoNumeroBoleta);
			}
		};
		function2();
	}, []);

	const confirmar = async () => {
		// handlePrint();
		setConfirmarVenta(true);
		const fechaActual = now(getLocalTimeZone());
		const fechaOrdenada = `${String(fechaActual.day).padStart(2, "0")}/${String(fechaActual.month).padStart(2, "0")}/${fechaActual.year} ${String(fechaActual.hour).padStart(2, "0")}:${String(fechaActual.minute).padStart(2, "0")}:${String(fechaActual.second).padStart(2, "0")}`;
		const bodyCompra = {
			id_proveedor: registrarVenta.RUC_proveedor,
			id_metodo_pago: registrarVenta.metodo_pago,
			fecha_factura: fechaOrdenada,
			total_factura: registrarVenta.total_compra,
			productos: registrarVenta.productos.map((producto) => ({
				key: producto.key,
				cantidad_compra: producto.cantidad,
				precio_compra: producto.precio_unitario,
			})),
		};
		console.log(bodyCompra);
		try {
			const response = await fetch("/api/compras/subirFactura", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(bodyCompra),
			});

			if (!response.ok) {
				throw new Error("Error al registrar la venta");
			}
			const num = await fetchUltimoNumeroBoleta();
			dispatch(
				insertarFactura({
					numero_factura: num.toString(),
					direccion_proveedor: registrarVenta.direccion_proveedor,
					RUC_proveedor: registrarVenta.RUC_proveedor,
					nombre_proveedor: registrarVenta.proveedor,
					nombre_metodo_pago: metodoPagoMap[bodyCompra.id_metodo_pago],
					fecha_factura: bodyCompra.fecha_factura,
					total_factura: bodyCompra.total_factura.toString(),
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
						{confirmarVenta ? <h2>Compra Registrada</h2> : <h2>¿Confirmar registro de compra?</h2>}
					</ModalHeader>
					<ModalBody className="py-5 text-xs">
						<div
							style={{
								boxShadow: confirmarVenta ? "rgb(23 201 100) 0px 0px 15px 0px, rgb(23 201 100) 0px 0px 15px 0px" : "rgb(0 111 238) 0px 0px 15px 0px, rgb(0 111 238) 0px 0px 15px 0px",
							}}
						>
							<article
								ref={imprimirBoletaRef}
								className="flex flex-col bg-white px-5 py-10 gap-4 border border-black"
								style={{
									fontFamily: "Arial, Helvetica, sans-serif",
								}}
							>
								<div className="flex flex-rows">
									<ul className="text-start uppercase tracking-widest leading-4">
										<li className="font-bold">SilverMusic</li>
										<li>Teléfono (052) 314148</li>
										<li>Asoc. Villa Cristo Rey Mz. 15 - Lt. 1, C.P.M. Leguía, Tacna - Tacna - Tacna</li>
									</ul>
									<div className="py-1 px-5 border border-black text-center font-bold w-96">
										<h3 className="text-base uppercase tracking-normal">Factura electrónica</h3>
										<p className="text-sm tracking-widest">R.U.C. 10424720891</p>
										<p className="text-sm tracking-widest">N° 001-{numero_boleta}</p>
									</div>
								</div>
								<div className="h-[1px] bg-black w-full" />
								<section>
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
									<div className="grid grid-cols-2">
										<p className="font-semibold flex justify-between">
											Proveedor<span>:</span>
										</p>
										<p className="text-end uppercase">{registrarVenta.proveedor}</p>
									</div>
									<div className="grid grid-cols-2">
										<p className="font-semibold flex justify-between">
											RUC<span>:</span>
										</p>
										<p className="text-end uppercase">{registrarVenta.RUC_proveedor}</p>
									</div>
									{registrarVenta.direccion_proveedor && (
										<div className="grid grid-cols-2">
											<p className="font-semibold flex justify-between">
												Dirección<span>:</span>
											</p>
											<p className="text-end uppercase">{registrarVenta.direccion_proveedor}</p>
										</div>
									)}
								</section>
								<div className="h-[1px] bg-black w-full" />
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
								<div className="h-[1px] bg-black w-full" />
								<div className="text-right mt-4">
									<span className="font-semibold">Total Venta: </span> S/. {registrarVenta.total_compra.toFixed(2)} PEN
								</div>
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
