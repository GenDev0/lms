import Image from "next/image";
import Link from "next/link";

import IconBadge from "@/components/icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
}

const CourseCard = ({
  id,
  title,
  category,
  progress,
  price,
  imageUrl,
  chaptersLength,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full'>
        <div className='relative w-full aspect-video rounded-md overflow-hidden'>
          <Image src={imageUrl} alt={title} fill className='object-cover' />
        </div>
        <div className='flex flex-col pt-2'>
          <div className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'>
            {title}
          </div>
          <p className='text-xs text-muted-foreground'>{category}</p>
          <div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
            <div className='flex items-center gap-x-1 text-slate-500'>
              <IconBadge icon={BookOpen} size={"sm"} />
              <span>
                {chaptersLength} Chapter{chaptersLength > 1 && "s"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              value={progress}
              size='sm'
              variant={progress === 100 ? "success" : "default"}
            />
          ) : (
            <p className='text-base md:text-sm font-medium text-slate-700'>
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
export default CourseCard;
