import GenerateQuizPage from "@/components/page/GenerateQuiz";
import { use } from "react";

export default function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);

  return <GenerateQuizPage eventId={id} />
}
