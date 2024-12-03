"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});
			const data = await response.json();
			if (data.error) {
				setError(data.error);
			} else {
				localStorage.setItem("isAdmin", data.valid);

				if (data.valid) {
					localStorage.setItem("redirectTo", data.redirectTo);
				}
				if (data.valid) {
					router.push(data.redirectTo);
				} else {
					router.push("/login");
				}
			}
		} catch (err) {
			setError("Hubo un error al realizar el login.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100/50">
			<img src="/fondo_login.jpg" className="absolute top-0 left-0 object-contain w-full" alt="fondo-img"/>
			<Card className="w-full sm:w-96 p-10">
				<CardHeader className="text-center">
					<h3 className="text-2xl font-semibold text-center w-full">Iniciar sesión</h3>
				</CardHeader>
				<CardBody>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<Input
								fullWidth
								size="lg"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="mb-6">
							<Input
								size="lg"
								placeholder="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<Button
							type="submit"
							size="lg"
							color="success"
							fullWidth
							className="font-bold"
							disabled={loading}
						>
							{loading ? "Cargando..." : "Iniciar Sesión"}
						</Button>
					</form>
					{error && <p className="text-red-500 text-center mt-4">{error}</p>}
				</CardBody>
			</Card>
		</div>
	);
}
