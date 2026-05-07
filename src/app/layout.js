import { Geist } from "next/font/google";
import './styles/styles.sass';

const geistSans = Geist({ subsets: ["latin"],});

export const metadata = {
  title: "Headless Blog",
};

const RootLayout = ({ children }) => (
  <html lang="en" >
    <body className={geistSans.className}>{children}</body>
  </html>
);

export default RootLayout;