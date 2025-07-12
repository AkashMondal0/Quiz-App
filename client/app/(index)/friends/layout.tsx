import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Register Page",
    keywords: ["register", "authentication", "nextjs"],
    description: "Register page for the application",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    // const cook = await cookies();
    // const token = cook.get("token");
    //
    // if (token) {
    //     return redirect("/");
    // };

    return (
        <>
            {children}
        </>
    );
}
