"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "image is required",
  }),
});

const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Updated successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course image
        <Button type='button' variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>
              <span className='underline'>Cancel</span>
            </>
          ) : !initialData?.imageUrl ? (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add Image
            </>
          ) : (
            <>
              <Pencil className='h-4 w-4 mr-2' />
              Edit Image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.imageUrl ? (
          <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
            <ImageIcon className='h-10 w-10 text-slate-500' />
          </div>
        ) : (
          <div className='relative aspect-video mt-2'>
            <Image
              src={initialData?.imageUrl}
              alt={"Upload"}
              fill
              className='object-cover rounded-md'
            />
          </div>
        ))}
      {!isEditing ? (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.imageUrl && "text-slate-500 italic"
          )}
        >
          {!initialData?.imageUrl && "No image."}
        </p>
      ) : (
        <div>
          <FileUpload
            endpoint={"courseImage"}
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            16:9 aspect ratio recommended.
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageForm;
