import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface IParams {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export async function PUT(
  req: Request,
  { params: { chapterId, courseId } }: IParams
) {
  try {
    const { userId } = auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("PUT_COURSES_CHAPTER_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
