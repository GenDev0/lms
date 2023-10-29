import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

interface IParams {
  params: {
    courseId: string;
  };
}

export async function PATCH(req: Request, { params: { courseId } }: IParams) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Not found.", { status: 404 });
    }

    const unpublishCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishCourse);
  } catch (error) {
    console.log("Unpublish_Course_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
