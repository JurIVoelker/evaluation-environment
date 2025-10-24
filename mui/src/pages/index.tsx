import Button from "@mui/material/Button";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

export default function Home() {
  return (
    <div className={font.className}>
      <main className="flex justify-center items-center w-full h-screen">
        <Button variant="contained">Hallo</Button>
      </main>
    </div>
  );
}
