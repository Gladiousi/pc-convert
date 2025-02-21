const Footer = () => {
    return (
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-24">
          <div data-aos="fade-up-right" className="text-center md:text-left w-[30%]">
            <h2 className="text-2xl font-semibold text-gray-800">PC Compare</h2>
          </div>
  
          <div data-aos="fade-up" className="flex space-x-4 my-4 md:my-0 w-[30%] justify-center">
            <a href="#" className="text-gray-600 hover:text-blue-500 transition">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-400 transition">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-red-500 transition">
              <i className="fab fa-youtube text-xl"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition">
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
  
          <div data-aos="fade-up-left" className="text-center md:text-right w-[30%]">
            <p className="text-gray-600 text-sm">Нужна помощь? Свяжитесь с нами:</p>
            <a href="mailto:support@pccompare.com" className="text-blue-500 hover:underline text-sm">
              support@pccompare.com
            </a>
          </div>
        </div>
  
        <div className="mt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} PC Compare. Все права защищены.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  