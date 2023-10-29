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
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!courseOwner) {
      return new NextResponse("Not found.", { status: 404 });
    }

    const hasPublishedChapter = courseOwner.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !hasPublishedChapter ||
      !courseOwner.title ||
      !courseOwner.description ||
      !courseOwner.imageUrl ||
      !courseOwner.categoryId
    ) {
      return new NextResponse("Missing required fields.", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("Publish_COURSE_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
