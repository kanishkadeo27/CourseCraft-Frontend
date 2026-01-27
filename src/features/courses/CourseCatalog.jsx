import CourseCard from "../../components/course/CourseCard.jsx";
import { useAuth } from "../../context/AuthContext";

const dummyCourses = [
  {
    id: 1,
    courseName: "React Fundamentals",
    courseDescription: "Learn React from scratch",
    trainer: "Abdur Rehman",
    rating: 4.5,
    price: 0,
    duration: 30,
    imageId: 1,
    isEnrolled: false,
  },
];

const CourseCatalog = () => {
  const { user } = useAuth();

  return (
    <section className="banner courses archive section">
      <h1 className="text-center text-gray-600 text-2xl mb-10">
        All Courses
      </h1>

      <div className="container">
        <div className="row">
          {dummyCourses.map((course) => (
            <div key={course.id} className="col-lg-4 col-md-6 col-12">
              <CourseCard course={course} user={user} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCatalog;
