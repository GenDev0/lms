import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

interface IParams {
  params: {
    courseId: string;
  };
}
export async function PUT(req: Request, { params: { courseId } }: IParams) {
  try {
    const { userId } = auth();
    const { updateData } = await req.json();

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

    for (let item of updateData) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("PUT_CHAPTERS_REORDER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
