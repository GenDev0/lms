import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

interface CoursesPageProps {}

const CoursesPage = async (props: CoursesPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return <div>You must be logged in to view this page</div>;
  }
  const courses = await db.course.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className='p-6'>
      <Link href={"/teacher/create"}>
        <Button>New Course</Button>
      </Link>
      <div className='flex flex-col gap-y-2 mt-4 justify-center items-start'>
        {courses.map((course) => (
          <Link key={course.id} href={`/teacher/courses/${course.id}`}>
            {course.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
export default CoursesPage;
