import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Main = lazy(() => import("./routes/main"));

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Header />
      </header>
      <main className="flex-grow">
        <Suspense fallback={<div className="flex-grow text-center py-8">Загрузка...</div>}>
          <Main />
        </Suspense>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;