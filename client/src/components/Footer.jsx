import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-info">
        <p><strong>Mon - Fri:</strong> 8:00AM - 6:00PM</p>
        <p><strong>Phone:</strong> <a href="tel:7022345489">(702) 234-5489</a></p>
        <p><strong>Email:</strong> <a href="mailto:yybeauty@salon.com">yybeauty@salon.com</a></p>
        <p>
          <strong>Address:</strong>{' '}
          <a href="https://maps.app.goo.gl/Cvqei1CkPNSMibtw6" target="_blank" rel="noopener noreferrer">
            1820 S Rainbow Blvd Unit 100
          </a>
        </p>
      </div>
      <p className="footer-copyright">
        © {new Date().getFullYear()} Y&Y Beauty Salon • All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
