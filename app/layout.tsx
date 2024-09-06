import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Suspense } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster } from "sonner";
import RecoilWrapper from "./components/RecoilWrapper";
import "./globals.css";

export const metadata = {
  title: "SIGF",
  description: "Sistema de Gerenciamento do Forró de Segunda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <Toaster theme="light" richColors visibleToasts={2} />
        <RecoilWrapper>
          <body
            className="min-h-screen ag-theme-quartz bg-background flex flex-col items-center"
            id="__modal"
          >
            {children}
          </body>
        </RecoilWrapper>
      </Suspense>
    </html>
  );
}
