"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  File,
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  Trash,
  X,
} from "lucide-react";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Attachement, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface AttachementFormProps {
  initialData: Course & { attachments: Attachement[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1, {
    message: "image is required",
  }),
});

const AttachementForm = ({ initialData, courseId }: AttachementFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Attachement added successfully!");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachement Deleted successfully!");
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachements
        <Button type='button' variant={"ghost"} onClick={toggleEdit}>
          {isEditing && (
            <>
              <span className='underline'>Cancel</span>
            </>
          )}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>
              No attachements yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachement) => (
                <div
                  key={attachement.id}
                  className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />
                  <p className='text-xs line-clamp-1'>{attachement.name}</p>
                  {deletingId === attachement.id ? (
                    <Loader2 className='h-4 w-4 ml-auto animate-spin' />
                  ) : (
                    <X
                      className='h-4 w-4 ml-auto text-red-500'
                      onClick={() => onDelete(attachement.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint={"courseAttachment"}
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Attachements needed to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
export default AttachementForm;
