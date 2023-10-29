"use client";

import axios from "axios";
import { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter Updated successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course video
        <Button type='button' variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>
              <span className='underline'>Cancel</span>
            </>
          ) : !initialData?.videoUrl ? (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a video
            </>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.videoUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <VideoIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <MuxPlayer
              playbackId={initialData?.muxData?.playbackId || ""}
              className='aspect-video'
            />
          </div>
        ))}
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.videoUrl && "text-slate-500 italic"
          )}
        >
          {!initialData?.videoUrl && "No video."}
        </p>
      ) : (
        <div>
          <FileUpload
            endpoint={"chapterVideo"}
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData?.videoUrl && !isEditing && (
        <div className='text-xs text-muted-foreground mt-2'>
          Video can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
export default ChapterVideoForm;