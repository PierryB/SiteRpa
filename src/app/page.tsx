import Image from "next/image";
import { ImWhatsapp } from "react-icons/im";
import { FaLinkedin } from "react-icons/fa";

export default function Inicio() {
  return (
    <div className="flex flex-col gap-16 p-60 font-[family-name:var(--font-geist-sans)]">
      <main className="flex items-center justify-center text-4xl font-[family-name:var(--font-geist-mono)]">
        RPA Boettscher
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/PierryB"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/github.svg"
            alt="GitHub icon"
            width={16}
            height={16}
          />
          GitHub
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/pierryb/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin aria-hidden width={16} height={16} />
          Linkedin
        </a>
        {/* <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://wa.me/5547997606148"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ImWhatsapp aria-hidden width={16} height={16} />
          WhatsApp
        </a> */}
      </footer>
    </div>
  );
}
