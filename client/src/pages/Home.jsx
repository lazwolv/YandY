import ImageSlider from '../components/ImageSlider';
import './Home.css';

const Home = () => {
  const salonImages = [
    '/images/Salon/salon1.jpg',
    '/images/Salon/salon2.jpg',
    '/images/Salon/salon3.jpg',
    '/images/Salon/salon4.jpg',
  ];

  const nailImages = [
    '/images/Nails/nails1.jpg',
    '/images/Nails/nails2.jpg',
    '/images/Nails/nails3.jpg',
    '/images/Nails/nails4.jpg',
  ];

  const teamImages = [
    '/images/Team/team 1.jpg',
    '/images/Team/team 2.jpg',
    '/images/Team/team 3.jpg',
    '/images/Team/team 4.jpg',
  ];

  return (
    <main className="home">
      <div className="side-by-side">
        <section id="our-mission">
          <h2>Our Mission</h2>
          <p>
            At Y&Y Beauty Salon, we are dedicated to empowering women to express their unique beauty and
            resilience through personalized nail designs and exceptional services. Our salon serves as a
            tranquil sanctuary where clients can indulge in self-care, from luxurious manicures and
            pedicures to hair and lash treatments, all crafted to enhance well-being and serenity. With a
            commitment to excellence and personalized attention, we strive to exceed expectations, creating
            an environment where every visit offers renewal, comfort, and lasting memories.
          </p>
        </section>

        <section id="our-expectations">
          <h2>Our Expectations</h2>
          <p>
            At Y&Y Beauty Salon, we value every client interaction and aim to create an atmosphere of mutual
            respect and professionalism. We kindly ask our patrons to arrive on time for appointments to
            ensure exceptional service, while fostering an environment of warmth and courtesy for both staff
            and customers. Open communication and feedback are encouraged, helping us continually refine our
            services. By upholding respect, punctuality, and collaboration, we strive to make every visit
            rejuvenating and reflective of our commitment to excellence in beauty and hospitality.
          </p>
        </section>
      </div>

      <div className="sliders-container">
        <section id="our-place">
          <h2>Our Place</h2>
          <ImageSlider images={salonImages} alt="Salon" />
        </section>

        <section id="our-work">
          <h2>Our Work</h2>
          <ImageSlider images={nailImages} alt="Nails" />
        </section>

        <section id="our-team">
          <h2>Our Team</h2>
          <ImageSlider images={teamImages} alt="Team" />
        </section>
      </div>

      <section id="our-services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Manicures</h3>
            <p>Professional nail care and beautiful designs</p>
          </div>
          <div className="service-card">
            <h3>Pedicures</h3>
            <p>Relaxing foot treatments and nail styling</p>
          </div>
          <div className="service-card">
            <h3>Hair Services</h3>
            <p>Cuts, styling, and treatments</p>
          </div>
          <div className="service-card">
            <h3>Lash Extensions</h3>
            <p>Beautiful, natural-looking lashes</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
