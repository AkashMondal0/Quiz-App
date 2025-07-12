import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account settings and preferences.",
    openGraph: {
        title: "Settings",
        description: "Manage your account settings and preferences.",
        url: "/settings",
        siteName: "Your Site Name",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "Settings Page",
            },
        ],
    },
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
