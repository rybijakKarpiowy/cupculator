export default function Regulations({
    searchParams,
}: {
    searchParams: { cup: string; lang: string };
}) {
    const lang = searchParams.lang || "1";

    return (
        <div className="px-[16%] pt-8 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">
                {lang === "1"
                    ? "Warunki Współpracy dla Agencji Reklamowych"
                    : "Terms of Cooperation for Advertising Agencies"}
            </h1>
            <p>
                {lang === "1"
                    ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis accumsan ultrices, turpis risus porta metus, quis luctus urna sem et urna. Sed euismod, diam quis accumsan ultrices, turpis risus porta metus, quis luctus urna sem et urna."
                    : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis accumsan ultrices, turpis risus porta metus, quis luctus urna sem et urna. Sed euismod, diam quis accumsan ultrices, turpis risus porta metus, quis luctus urna sem et urna."}
            </p>
        </div>
    );
}
