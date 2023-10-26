import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

interface IParams {
  params: {
    courseId: string;
    chapterId: string;
  };
}
export async function PATCH(
  req: Request,
  { params: { courseId, chapterId } }: IParams
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      },
    });

    // Todo : Handle video Upload

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("PATCH_CHAPTER_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
