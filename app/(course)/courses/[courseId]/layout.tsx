import { getprogress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/course-sidebar";

interface CourseLayoutProps {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}
export default async function CourseLayout({
  children,
  params: { courseId },
}: CourseLayoutProps) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getprogress(userId, course.id);

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className='md:pl-80 h-full'>{children}</main>
    </div>
  );
}
