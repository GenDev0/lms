import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface Iparams {
  params: {
    courseId: string;
    attachmentId: string;
  };
}

export async function DELETE(
  req: Request,
  { params: { courseId, attachmentId } }: Iparams
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedAttachement = await db.attachement.delete({
      where: {
        id: attachmentId,
        courseId,
      },
    });

    return NextResponse.json(deletedAttachement);
  } catch (error) {
    console.log("Delete_COURSE_ID_ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
