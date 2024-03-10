import { AppLogo } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1
          className={`${title({
            color: "yellow",
          })} flex flex-col items-center`}
        >
          <span>
            <AppLogo width={80} height={80} className="text-orange-600" />
          </span>
          <span className={title({ color: "yellow" })}>BotForge</span>
        </h1>

        <div className="my-6">
          <h2 className={title()}>
            Craft content <span className="text-orange-600">bots</span> in
            seconds!
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
      </div>
    </section>
  );
}
