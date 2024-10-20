import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export default function Inicio() {
  return (
    <div className="flex flex-col gap-16 p-60 font-[family-name:var(--font-geist-sans)]" style={{userSelect: 'none'}}>
      <main className="flex items-center justify-center text-7xl font-[family-name:var(--font-geist-mono)]">
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
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="mailto:pierryboettscherdev@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGmail aria-hidden width={16} height={16} />
          Gmail
        </a>
      </footer>
    </div>
  );
}
