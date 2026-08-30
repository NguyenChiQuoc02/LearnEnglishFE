import LearningSession from "./components/LearningSession";

export default async function LearnPage(props: PageProps<"/learn/[courseId]">) {
  const { courseId } = await props.params;
  return <LearningSession courseId={courseId} />;
}
