import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-4 sm:ml-64 overflow-y-auto flex flex-col">
      {children}
    </main>
  );
}
