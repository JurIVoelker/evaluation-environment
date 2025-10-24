import { Button } from "@/components/ui/button";
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
        <Button>Hallo</Button>
      </main>
    </div>
  );
}
