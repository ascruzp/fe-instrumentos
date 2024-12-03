import { useEffect, useState, useRef } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getLocalTimeZone, now } from "@internationalized/date";

type Producto = {
	nombre: string;
	cantidad: number;
	precio_unitario: number;
	importe: number;
};

interface DetalleFactura {
	numero_factura: string;
	direccion_proveedor: string;
	RUC_proveedor: string;
	nombre_proveedor: string;
	nombre_metodo_pago: string;
	fecha_factura: string;
	total_factura: string;
}

export function VerFactura({ registrarVenta }: { registrarVenta: DetalleFactura }) {
	const imprimirBoletaRef = useRef<HTMLElement>(null);
	const [productos, setProductos] = useState<Producto[]>([]);

	const handlePrint = useReactToPrint({
		content: () => imprimirBoletaRef.current,
	});

	useEffect(() => {
		const fetchProductos = async () => {
			try {
				const response = await fetch(`/api/compras/verFacturaProductos?id_factura=${registrarVenta.numero_factura}`, {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				});

				const data = await response.json();
				setProductos(data);
				console.log(data);
			} catch (err) {
				console.log("Error al cargar inventario", err);
			}
		};

		fetchProductos();
	}, [registrarVenta]);

	const handleDownload = async () => {
		if (imprimirBoletaRef.current) {
			const canvas = await html2canvas(imprimirBoletaRef.current, {
				scale: 2,
			}); // Puedes ajustar el valor de scale para cambiar la resolución
			const imgData = canvas.toDataURL("image/png", 1.0); // Cambia a JPEG y ajusta la calidad (1.0 es la mejor calidad)

			const linkImagen = document.createElement("a");
			linkImagen.href = imgData;
			linkImagen.download = `FACTURA_ELECTRONICA-${registrarVenta.fecha_factura.replace(/ /g, "-")}.png`;
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

	return (
		<ModalContent>
			{(onClose) => (
				<>
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">FACTURA REGISTRADA</ModalHeader>
					<ModalBody className="py-5 text-xs">
						<div>
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
										<p className="text-sm tracking-widest">N° 001-{registrarVenta.numero_factura}</p>
									</div>
								</div>
								<div className="h-[1px] bg-black w-full" />
								<section>
									{registrarVenta.fecha_factura && (
										<>
											<div className="grid grid-cols-2">
												<p className="font-semibold flex justify-between">
													Fecha de Emisión
													<span>:</span>
												</p>
												<p className="text-end">{registrarVenta.fecha_factura.split(" ")[0]}</p>
											</div>
											<div className="grid grid-cols-2">
												<p className="font-semibold flex justify-between">
													Hora de Emisión
													<span>:</span>
												</p>
												<p className="text-end">{registrarVenta.fecha_factura.split(" ")[1]}</p>
											</div>
										</>
									)}
									<div className="grid grid-cols-2">
										<p className="font-semibold flex justify-between">
											Proveedor<span>:</span>
										</p>
										<p className="text-end uppercase">{registrarVenta.nombre_proveedor}</p>
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
										{productos.length > 0 &&
											productos.map((producto, index) => (
												<tr key={index}>
													<td className="pr-0.5 text-center">{producto.cantidad}</td>
													<td className="pr-0.5">{producto.nombre}</td>
													<td className="pr-0.5 text-center ">{producto.precio_unitario}</td>
													<td className="text-center">{producto.importe}</td>
												</tr>
											))}
									</tbody>
								</table>
								<div className="h-[1px] bg-black w-full" />
								<div className="text-right mt-4">
									<span className="font-semibold">Total Venta: </span> S/. {registrarVenta.total_factura} PEN
								</div>
							</article>
						</div>
					</ModalBody>
					<ModalFooter className="border-t-1 border-gray-400">
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
									}}
								>
									Finalizar
								</Button>
							</div>
						</div>
					</ModalFooter>
				</>
			)}
		</ModalContent>
	);
}
