import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";

interface Iparams {
  params: {
    courseId: string;
  };
}

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
);

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

export async function DELETE(req: Request, { params: { courseId } }: Iparams) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!courseId) {
      return new NextResponse("courseId is Missing...!", { status: 400 });
    }

    const course = await db.course.findUnique({
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

    if (!course) {
      return new NextResponse("Course not found.", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
        userId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("DELETE_COURSE_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
