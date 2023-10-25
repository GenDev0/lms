interface ChapterIdPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterIdPage = ({
  params: { chapterId, courseId },
}: ChapterIdPageProps) => {
  return (
    <div>
      ChapterId {chapterId} Page of courseId {courseId}
    </div>
  );
};
export default ChapterIdPage;
