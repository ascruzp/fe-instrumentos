"use client";
import { comfortaa } from "./ui/fonts";
import "./ui/global.css";
import { Provider } from "react-redux";
import store from "../src/store/store";
import Verification from "./Verification";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<html lang="en">
				<title>SilverMusic</title>
				<body className={`${comfortaa.className} antialiased`}>
					<Verification>{children}</Verification>
				</body>
			</html>
		</Provider>
	);
}
