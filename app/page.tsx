"use client";
import { Card, CardBody, CardHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Bar, Pie } from "react-chartjs-2";
import { CurrencyDollarIcon, UserIcon, ShoppingCartIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { RootState } from "@/src/store/store";
import { useSelector } from "react-redux";
import { DetalleBoleta } from "@/src/store/reducer";

import { ArcElement, Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function Dashboard() {
	const { inventario, boletas, clientes, proveedores } = useSelector((state: RootState) => state.inventario);

	const totalBoletas = boletas.reduce((acc, boleta: DetalleBoleta) => acc + parseFloat(boleta.total_boleta), 0).toFixed(2);

	const stats = [
		{
			title: "Ventas Totales",
			value: `S/. ${totalBoletas}`,
			icon: <CurrencyDollarIcon className="w-6 h-6 text-green-500" />,
		},
		{
			title: "Clientes Registrados",
			value: `${clientes.length}`,
			icon: <UserIcon className="w-6 h-6 text-blue-500" />,
		},
		{
			title: "Productos en Inventario",
			value: `${inventario.length}`,
			description: "Total de productos disponibles",
			icon: <ShoppingCartIcon className="w-6 h-6 text-yellow-500" />,
		},
		{
			title: "Proveedores Activos",
			value: `${proveedores.length}`,
			icon: <PlusCircleIcon className="w-6 h-6 text-purple-500" />,
		},
	];

	const ventasPorMes = boletas.reduce((acc: { [key: string]: number }, boleta: DetalleBoleta) => {
		const fecha = new Date(boleta.fecha_boleta);
		const mes = fecha.toLocaleString("default", { month: "short" }) + " " + fecha.getFullYear();
		acc[mes] = (acc[mes] || 0) + parseFloat(boleta.total_boleta);
		return acc;
	}, {});

	const pagosPorMetodo = boletas.reduce((acc: { [key: string]: number }, boleta: DetalleBoleta) => {
		const metodoPago = boleta.nombre_metodo_pago;
		acc[metodoPago] = (acc[metodoPago] || 0) + 1;
		return acc;
	}, {});

	const pieChartData = {
		labels: Object.keys(pagosPorMetodo),
		datasets: [
			{
				data: Object.values(pagosPorMetodo),
				backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33F1FF", "#F1FF33"],
			},
		],
	};

	const pieChartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
		},
	};

	const chartData = {
		labels: Object.keys(ventasPorMes),
		datasets: [
			{
				label: "Ventas Totales",
				data: Object.values(ventasPorMes),
				backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33F1FF", "#F1FF33"],
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	const columns = [
		{
			key: "fecha_boleta",
			label: "Fecha",
		},
		{
			key: "total_boleta",
			label: "Total",
		},
	];

	const sortedBoletas = [...boletas].sort((a, b) => new Date(b.fecha_boleta).getTime() - new Date(a.fecha_boleta).getTime()).slice(0, 10);

	return (
		<main className="p-4 sm:ml-64 overflow-y-auto flex flex-col gap-4">
			<div className="flex gap-4 justify-start">
				{stats.map((item, index) => (
					<div
						className="w-full sm:w-1/2 md:w-1/4"
						key={index}
					>
						<Card
							shadow="sm"
							className="h-full"
						>
							<CardBody className="p-6 flex items-center gap-4">
								<div className="flex-shrink-0">{item.icon}</div>
								<div className="text-center">
									<h4>{item.title}</h4>
									<h5 className="text-xl font-bold">{item.value}</h5>
								</div>
							</CardBody>
						</Card>
					</div>
				))}
			</div>
			<div className="grid grid-cols-3 w-full gap-4">
				<Card
					shadow="sm"
					className="col-span-1 p-4 max-h-[30rem]"
				>
					<CardHeader>
						<h3 className="text-md font-bold">Ventas Totales Mensuales</h3>
					</CardHeader>
					<CardBody>
						<Bar
							data={chartData}
							options={chartOptions}
						/>
					</CardBody>
				</Card>
				<Card
					shadow="sm"
					className="col-span-1 p-4 max-h-[30rem]"
					>
					<CardHeader>
						<h3 className="text-md font-bold">Métodos de Pago</h3>
					</CardHeader>
					<CardBody>
						<Pie
							data={pieChartData}
							options={pieChartOptions}
						/>
					</CardBody>
				</Card>
				<Card
					shadow="sm"
					className="col-span-1 p-4 max-h-[30rem]"
					
				>
					<CardHeader>
						<h3 className="text-md font-bold">Últimas Ventas</h3>
					</CardHeader>
					<CardBody>
						<Table aria-label="Tabla de últimas ventas">
							<TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
							<TableBody
								emptyContent={"No se encontró ninguna venta."}
								items={sortedBoletas}
							>
								{(itemProducto) => (
									<TableRow key={itemProducto.numero_boleta}>
										<TableCell>
											{new Date(itemProducto.fecha_boleta).toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
										</TableCell>
										<TableCell>{itemProducto.total_boleta}</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardBody>
				</Card>
			</div>
		</main>
	);
}
