import Image from "next/image";
import Link from "next/link";

interface LogoProps {}

const Logo = (props: LogoProps) => {
  return (
    <Link href={"/"}>
      <Image src={"/logo1.png"} alt={"logo"} width={150} height={150} />
    </Link>
  );
};
export default Logo;
