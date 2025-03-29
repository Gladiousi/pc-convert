import Header from "./components/header";
import Main from "./components/main";
import Footer from "./components/footer";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Main />
      </div>
      <Footer />
    </div>
  );
};

export default App;
