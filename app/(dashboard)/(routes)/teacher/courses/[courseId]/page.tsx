import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

import IconBadge from "@/components/icon-badge";

import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";

interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = async ({ params: { courseId } }: CourseIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  console.log(categories);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `${completedFields} of ${totalFields}`;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-2xl font-medium'>Course Setup</h1>
          <span className='text-sm text-slate-700'>
            complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
        <div>
          <div className='flex items-center gap-x-2'>
            <IconBadge icon={LayoutDashboard} />
            <h2 className='text-xl'>Customize your course</h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  );
};
export default CourseIdPage;
