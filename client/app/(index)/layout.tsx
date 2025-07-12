import type { Metadata } from "next";
import { AuthProvider } from "@/provider/auth-provider";

export const metadata: Metadata = {
  title: "FunQuiz",
  description: "Create and manage quizzes for your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
