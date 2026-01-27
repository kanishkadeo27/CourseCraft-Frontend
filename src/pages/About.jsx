const About = () => {
  return (
    <section className="py-2">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6 items-center">

        {/* Image */}
        <img
          src="/image/about.jpg"
          alt="About Learning Kart"
          className="w-full h-[564px] object-cover rounded-3xl"
        />

        {/* Content */}
        <div className="flex flex-col gap-4 text-left">
          <h2 className="text-4xl font-bold text-gray-900">
            About Us
          </h2>

          <p className="text-xl text-gray-600 text-justify">
            Hello! Welcome to{" "}
            <span className="font-semibold text-gray-900">
              EduHub
            </span>
            . We're really happy to see you here.
          </p>

          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            We are delighted to have you join our esteemed community of learners.
            Taking the first step towards a mentorship program can indeed be
            overwhelming, but rest assured — you've come to the right place.
          </p>

          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            At{" "}
            <span className="font-semibold text-gray-900">
              EduHub
            </span>
            , we understand the value of seeking counsel and guidance. Our team of
            experienced mentors is dedicated to supporting you throughout your
            journey — whether it's placement preparation, interview experiences,
            mastering programming skills, or exploring different career paths.
          </p>

          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Learning should be enjoyable. That's why our programs are interactive
            and engaging, with mentors who break down complex topics using
            real-world examples.
          </p>

          <p className="text-lg text-gray-500 leading-relaxed text-justify">
            Our mission is to empower you to reach your full potential and achieve
            your dreams. If you have any questions, feel free to reach out at{" "}
            <span className="font-semibold text-gray-900">
              projectmail027@gmail.com
            </span>
            .
          </p>
        </div>

      </div>
    </section>
  );
};

export default About;