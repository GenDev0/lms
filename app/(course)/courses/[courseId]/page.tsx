interface CourseIdPageProps {
  params: {
    courseId: string;
  };
}

const CourseIdPage = ({ params: { courseId } }: CourseIdPageProps) => {
  return <div>Course Id {courseId} Page</div>;
};
export default CourseIdPage;
