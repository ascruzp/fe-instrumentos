import { useEffect, useState, useRef } from "react";
import {
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Producto = {
	nombre_producto: string;
	cantidad_venta: number;
	precio_unitario: number;
	precio_venta: number;
};

type Venta = {
	numero_boleta: number;            // Número de la boleta
    nombre_cliente: string;           // Nombre del cliente
    celular_cliente: string;          // Número de celular del cliente
    direccion_cliente: string;        // Dirección del cliente
    fecha_registro_cliente: string;   // Fecha de registro del cliente (ISO 8601)
    fecha_boleta: string;             // Fecha de la boleta (ISO 8601)
    metodo_entrega: string;           // Método de entrega
    total_boleta: string;             // Total de la boleta (en formato string)
    nombre_metodo_pago: string;       // Nombre del método de pago
};

export function VerBoleta({
	registrarVenta,
}: {
	registrarVenta: Venta;
}) {
	const imprimirBoletaRef = useRef<HTMLElement>(null);
	const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(
                    `/api/ventas/verBoletaProductos?id_boleta=${registrarVenta.numero_boleta}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );
    
                const data = await response.json();
                setProductos(data);
                console.log(data);
                console.log(registrarVenta.numero_boleta);
            } catch (err) {
                console.log("Error al cargar inventario", err);
            }
        };
    
        fetchProductos();
    }, [registrarVenta]);
        
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
			linkImagen.download = `BOLETA_ELECTRONICA-${registrarVenta.fecha_boleta.replace(/ /g, "-")}.png`;
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
					<ModalHeader className="flex flex-col text-center uppercase border-b-1 font-bold border-gray-400 text-xl">
						<h2>Boleta Registrada</h2>
					</ModalHeader>
					<ModalBody className="py-5 text-xs self-center">
						<div>
							<article
								ref={imprimirBoletaRef}
								className="flex flex-col max-w-md bg-white px-5 py-10 gap-4"
								style={{
									fontFamily: "Arial, Helvetica, sans-serif",
								}}>
								<ul className="text-center uppercase tracking-widest leading-4">
									<li>SilverMusic</li>
									<li>R.U.C. 10424720891</li>
									<li>
										Asoc. Villa Cristo Rey Mz. 15 - Lt. 1,
										C.P.M. Leguía, Tacna - Tacna - Tacna
									</li>
									<li>Teléfono (052) 314148</li>
									<li className="py-1">
										<h3 className="text-base font-bold uppercase tracking-normal">
											Boleta de Venta electrónica
										</h3>
										<p className="text-sm tracking-widest -mt-1">
											N° 001-{registrarVenta.numero_boleta}
										</p>
									</li>
								</ul>
								<section>
									<div className="grid grid-cols-2">
										<p className="font-semibold flex justify-between">
											Cliente<span>:</span>
										</p>
										<p className="text-end uppercase">
											{registrarVenta.nombre_cliente}
										</p>
									</div>
									{registrarVenta.celular_cliente && (
										<div className="grid grid-cols-2">
											<p className="font-semibold flex justify-between">
												Celular<span>:</span>
											</p>
											<p className="text-end">
												{registrarVenta.celular_cliente}
											</p>
										</div>
									)}
									{registrarVenta.direccion_cliente && (
										<div className="grid grid-cols-2">
											<p className="font-semibold flex justify-between">
												Dirección<span>:</span>
											</p>
											<p className="text-end uppercase">
												{
													registrarVenta.direccion_cliente
												}
											</p>
										</div>
									)}
									{registrarVenta.fecha_boleta && (
										<>
											<div className="grid grid-cols-2">
												<p className="font-semibold flex justify-between">
													Fecha de Emisión
													<span>:</span>
												</p>
												<p className="text-end">
													{
														registrarVenta.fecha_boleta.split(
															" "
														)[0]
													}
												</p>
											</div>
											<div className="grid grid-cols-2">
												<p className="font-semibold flex justify-between">
													Hora de Emisión
													<span>:</span>
												</p>
												<p className="text-end">
													{
														registrarVenta.fecha_boleta.split(
															" "
														)[1]
													}
												</p>
											</div>
										</>
									)}
								</section>
								<table className="min-w-full bg-white">
									<thead>
										<tr>
											<th className="py-1 pr-0.5">
												Cant.
											</th>
											<th className="py-1 pr-0.5 text-start">
												Descripción
											</th>
											<th className="py-1 pr-0.5">
												P. Unit
											</th>
											<th className="py-1">Importe</th>
										</tr>
									</thead>
									<tbody>
										{productos.map(
											(producto, index)  => (
												<tr key={index}>
													<td className="pr-0.5 text-center">
														{producto.cantidad_venta}
													</td>
													<td className="pr-0.5">
														{producto.nombre_producto}
													</td>
													<td className="pr-0.5 text-center ">
														{producto.precio_unitario}
													</td>
													<td className="text-center">
														{producto.precio_venta}
													</td>
												</tr>
											)
										)}
									</tbody>
								</table>
								<div className="text-right mt-4">
									<span className="font-semibold">
										Total Venta:{" "}
									</span>{" "}
									S/. {registrarVenta.total_boleta}{" "}
									PEN
								</div>
								<div className="text-center mt-4">
									GRACIAS POR SU COMPRA
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
									onPress={handleDownload}>
									Descargar
								</Button>
								<Button
									className="font-bold"
									variant="flat"
									color="primary"
									onPress={handlePrint}>
									Imprimir
								</Button>
							</div>
							<div>
								<Button
									className="font-bold"
									color="secondary"
									onPress={() => {
										onClose();
									}}>
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
