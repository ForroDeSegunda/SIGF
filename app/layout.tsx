import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Toaster } from "sonner";
import RecoilWrapper from "./components/RecoilWrapper";
import tw from "tailwind-styled-components";
import { Suspense } from "react";

const Body = tw.body`min-h-screen ag-theme-quartz bg-background flex flex-col items-center`;

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
          <Body id="__modal">{children}</Body>
        </RecoilWrapper>
      </Suspense>
    </html>
  );
}
