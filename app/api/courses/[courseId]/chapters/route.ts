import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface Iparams {
  params: {
    courseId: string;
  };
}

export async function POST(req: Request, { params: { courseId } }: Iparams) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapters = await db.chapter.create({
      data: {
        title,
        courseId,
        position: courseOwner.chapters.length + 1,
      },
    });

    return NextResponse.json(chapters);
  } catch (error) {
    console.log("POST_COURSE_ID_CHAPTERS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
