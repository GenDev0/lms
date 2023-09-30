import Image from "next/image";

interface LogoProps {}

const Logo = (props: LogoProps) => {
  return <Image src={"/logo1.png"} alt={"logo"} width={150} height={150} />;
};
export default Logo;
