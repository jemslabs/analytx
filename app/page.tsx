import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/signup"}>
      <Button>Signup</Button>
      </Link>
      <Link href={"/login"}>
      <Button>Login</Button>
      </Link>
      <Link href={"/brand"}>
      <Button>Brand</Button>
      </Link>
      <Link href={"/creator"}>
      <Button>Creator</Button>
      </Link>
    </div>
  );
}
