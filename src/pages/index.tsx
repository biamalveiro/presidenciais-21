import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import nextI18nConfig from "../../next-i18next.config.mjs";
import Embedding from "~/components/Embedding";
import Search from "~/components/Search";
import Panel from "~/components/Panel";
import Legend from "~/components/Legend";
import { cn } from "~/lib/utils";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "pt",
      "en",
    ])),
  },
});

export default function Home({ locale }: { locale: string }) {
  const { t } = useTranslation("common");
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={`${t("title")} - ${t("subtitle")}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="absolute right-0 top-0 mx-8 my-6 flex gap-2 text-right text-sm underline">
          {["pt", "en"].map((lang) => {
            return (
              <Link
                key={lang}
                href={"/"}
                locale={lang}
                className={"hover:text-slate-600"}
              >
                {lang === "en" ? "English" : "Português"}
              </Link>
            );
          })}
        </div>
        <div className="container mx-auto flex w-10/12 flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex w-1/2 flex-col items-center justify-center gap-2 ">
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
              {t("title")}
            </h1>
            <h2 className="uppercase text-slate-500">{t("subtitle")}</h2>
            <p className="text-center text-sm ">{t("intro-text")}</p>
          </div>
          <div className="w-2/3">
            <Search />
          </div>
          <div className="flex h-[40vh] w-full gap-12">
            <Embedding />
            <Panel />
          </div>
          <div className="w-2/3">
            <Legend />
          </div>
        </div>
      </main>
    </>
  );
}
