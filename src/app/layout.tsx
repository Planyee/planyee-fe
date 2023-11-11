import "@mantine/core/styles.css";
import "@/app/globals.css";

import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { RecoilRoot } from "recoil";
import RecoilRootProvider from "@/components/RocoilRootProvier";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>{/* <ColorSchemeScript /> */}</head>
      <body>
        <RecoilRootProvider>
          <MantineProvider>
            <Container size={600}>{children}</Container>
          </MantineProvider>
        </RecoilRootProvider>
      </body>
    </html>
  );
}
