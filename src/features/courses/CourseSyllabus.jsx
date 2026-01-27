import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const CourseSyllabus = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  // TEMP mock data (replace with API later)
  useEffect(() => {
    setCourse({
      id,
      courseName: "Software Training",
      courseDescription:
        "Learn Java, Spring Boot, Microservices, AWS, Kafka with real projects.",
      duration: 90,
      trainer: "Mohd Khushhal",
      price: 0, // Free for now
    });
  }, [id]);

  if (!course) {
    return <p className="text-center mt-20">Loading syllabus...</p>;
  }

  return (
    <section className="banner pt-2 pb-2">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">

            <div className="card p-4">
              <h3 className="text-center text-info mb-4">
                Course Syllabus
              </h3>

              <ul className="list-group">

                <li className="list-group-item">
                  <strong>Course Name:</strong>
                  <br />
                  {course.courseName}
                </li>

                <li className="list-group-item">
                  <strong>Description:</strong>
                  <br />
                  {course.courseDescription}
                </li>

                <li className="list-group-item">
                  <strong>Duration:</strong>
                  <br />
                  {course.duration} Days
                </li>

                <li className="list-group-item">
                  <strong>Trainer:</strong>
                  <br />
                  {course.trainer}
                </li>

                <li className="list-group-item">
                  <strong>Price:</strong>
                  <br />
                  {course.price === 0 ? "FREE" : `₹${course.price}`}
                </li>

              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseSyllabus;
