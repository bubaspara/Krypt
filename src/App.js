import { useContext } from "react";
import { Navbar, Welcome, Footer, Services, Transactions } from "./components";
import { TransactionContext } from "./context/TransactionContext";

function App() {
  const { isWrongNetwork, switchToRopsten } = useContext(TransactionContext);
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        {isWrongNetwork && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
            role="alert"
          >
            <button
              onClick={switchToRopsten}
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 text-center inline-flex items-center dark:bg-red-800 dark:hover:bg-red-900"
            >
              Switch to Ropsten Test Network
            </button>
          </div>
        )}
        <Navbar />
        <Welcome />
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  );
}

export default App;
