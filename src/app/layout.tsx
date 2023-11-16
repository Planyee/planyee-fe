import "@mantine/core/styles.css";
import "@/app/globals.css";
import Script from "next/script";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
          rel="stylesheet"
        />
        <Script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=jej3T0nAxd2uWgcHlRn3n7p8Kd7hDAWLHtvIkHEg"></Script>
      </head>
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
