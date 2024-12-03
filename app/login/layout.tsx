import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-4 mt-14 sm:ml-64 overflow-y-auto flex flex-col" style={{ height: "calc(100vh - 4rem" }}>
      {children}
    </main>
  );
}
