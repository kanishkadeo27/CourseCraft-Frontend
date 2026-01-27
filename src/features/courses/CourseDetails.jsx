import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";


const CourseDetails = () => {
  const { id } = useParams(); // /courses/:id
  const [course, setCourse] = useState(null);

  // TEMP mock (replace with API later)
  useEffect(() => {
    // simulate API
    setCourse({
      id,
      courseName: "Software Training",
      trainer: "Mohd Khushhal",
      rating: 4.5,
      duration: 90,
      price: 0, // Free for now
      imageId: 1,
      description:
        "Software training is a crucial aspect of professional development...",
    });
  }, [id]);

  if (!course) return <p className="text-center mt-20">Loading...</p>;

  return (
    <section className="banner pt-2 pb-2">
      <div className="container">
        <div className="row">

          {/* LEFT – COURSE CONTENT */}
          <div className="col-lg-8">
            <div className="course_container">

              <div className="course_title mt-4">
                {course.courseName}
              </div>
              <div className="mt-3">
                <Link
                  to={`/courses/${course.id}/syllabus`}
                  className="btn bg-indigo-500 text-white px-4 py-2 rounded"
                >
                  View Syllabus
                </Link>
              </div>


              {/* INFO */}
              <div className="course_info d-flex flex-wrap align-items-center mt-3">
                <div className="course_info_item">
                  <span className="course_info_title">Teacher: </span>
                  <span className="course_info_text">{course.trainer}</span>
                </div>

                <div className="course_info_item ml-4" style={{ color: "#6674CC" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`fa ${course.rating >= star
                          ? "fa-star"
                          : "fa-star-o"
                        }`}
                    />
                  ))}
                  <span className="ml-2">({course.rating})</span>
                </div>
              </div>

              {/* TABS */}
              <div className="course_tabs_container mt-5">
                <div className="tab_panels">

                  {/* DESCRIPTION */}
                  <div className="tab_panel active">
                    <div className="tab_panel_title">
                      Software Training
                    </div>
                    <div className="tab_panel_text">
                      <p>{course.description}</p>
                    </div>
                  </div>

                  {/* CURRICULUM */}
                  <div className="tab_panel mt-5">
                    <div className="tab_panel_title">Curriculum</div>
                    <p>
                      Learn Java, Spring Boot, Microservices, AWS, Kafka and more
                      with real-world examples and hands-on projects.
                    </p>
                  </div>

                  {/* REVIEWS */}
                  <div className="tab_panel mt-5">
                    <div className="tab_panel_title">Reviews</div>
                    <p>Student reviews will be shown here.</p>
                  </div>

                  {/* STUDY MATERIAL */}
                  <div className="tab_panel mt-5">
                    <div className="tab_panel_title">Study Material</div>
                    <ul>
                      <li>
                        <a href="/pdf/study-material/spring_boot_tutorial.pdf" target="_blank" rel="noreferrer">
                          Spring Boot PDF
                        </a>
                      </li>
                    </ul>

                    <div className="mt-4" style={{ height: "400px" }}>
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/35EQXmHKZYs"
                        title="YouTube tutorial"
                        allowFullScreen
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* RIGHT – SIDEBAR */}
          <div className="col-lg-4">
            <div className="sidebar">

              <div className="sidebar_section">
                <div className="sidebar_section_title">
                  Course Feature
                </div>

                <span className="price course_price">
                  {course.price === 0 ? "FREE" : `₹${course.price}/-`}
                </span>

                <div className="feature_list mt-3">
                  <div className="feature d-flex justify-content-between">
                    <span>Duration</span>
                    <span>{course.duration} Days</span>
                  </div>
                  <div className="feature d-flex justify-content-between">
                    <span>Mode</span>
                    <span>Online</span>
                  </div>
                  <div className="feature d-flex justify-content-between">
                    <span>Students</span>
                    <span>35</span>
                  </div>
                </div>
              </div>

              {/* TRAINER */}
              <div className="sidebar_section mt-4">
                <div className="sidebar_section_title">Trainer</div>

                <div className="sidebar_teacher">
                  <img
                    src={`/image/teachers/author${course.imageId}.jpg`}
                    alt={course.trainer}
                    style={{ width: "100%" }}
                  />
                  <h4 className="mt-3">{course.trainer}</h4>
                  <p>
                    Senior Software Engineer with 10+ years experience in
                    enterprise applications.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
