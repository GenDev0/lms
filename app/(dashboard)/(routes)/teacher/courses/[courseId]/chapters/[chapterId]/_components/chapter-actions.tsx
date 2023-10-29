"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

const ChapterActions = ({
  chapterId,
  courseId,
  disabled,
  isPublished,
}: ChapterActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onPublish = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter Unpublished !");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter Published successfully!");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter Deleted successfully!");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant={"outline"}
        size={"sm"}
      >
        {isPublished ? "unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} variant={"destructive"} size={"icon"}>
          <Trash />
        </Button>
      </ConfirmModal>
    </div>
  );
};
export default ChapterActions;
