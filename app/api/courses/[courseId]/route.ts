import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface Iparams {
  params: {
    courseId: string;
  };
}

export async function PATCH(req: Request, { params: { courseId } }: Iparams) {
  try {
    const { userId } = auth();
    const values = await req.json();
    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!courseId) {
      return new NextResponse("courseId is Missing...!", { status: 400 });
    }
    if (!values) {
      return new NextResponse("Values are required.", { status: 400 });
    }

    const updatedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.log("PATCH_COURSE_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
