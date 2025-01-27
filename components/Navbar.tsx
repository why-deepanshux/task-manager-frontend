import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="w-full mt-1">
      <nav className="nav mx-auto py-1">
        <div className="logo">
          <p className=" px-2 border-2 border-[#161617] rounded-xl">Flow .</p>
        </div>
        <Link href="https://github.com/why-deepanshux">
          <Image
            src="/assets/icons/github.svg"
            height={50}
            width={50}
            alt="github logo"
          />
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
