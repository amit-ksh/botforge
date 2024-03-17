import { AppLogo } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { Button, Link, Skeleton } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <section className="relative h-[90vh] flex flex-col max-w-lg text-center justify-center items-center">
        <div className="absolute top-0 -left-[25%] from-red-500 to-purple-600 blur-[128px] rounded-full w-[300px] h-[180px] bg-gradient-to-r"></div>
        <div className="absolute bottom-0 -right-[30%] from-orange-500 to-yellow-600 blur-[128px] rounded-full w-[300px] h-[180px]  bg-gradient-to-r"></div>

        <h1 className="flex flex-col items-center justify-center text-4xl text-orange-600 font-semibold">
          <span>
            <AppLogo width={80} height={80} className="text-orange-600" />
          </span>
          <span>BotForge</span>
        </h1>
        <div className="my-6">
          <h2 className={title()}>
            Craft content{" "}
            <span className="text-orange-600">bots in seconds!</span>
            <br />
            for your websites!
          </h2>
          <p className={subtitle({ class: "mt-4" })}>
            Transform your content into dynamic bots in mere seconds for an
            instant online buzz!
          </p>
        </div>

        <Button
          as={Link}
          href="/dashboard"
          className={`text-xl font-medium tracking-wide bg-orange-600 rounded-md`}
        >
          Get Started
        </Button>
      </section>
    </main>
  );
}
