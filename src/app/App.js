import Navbar from '../components/Navbar';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      {/* <main>
          <Route path="/" exact>
            <div className="nav-img mb-3 ">
              <div className="opacity">
                <div className="slider-text">
                  <h1 className="text-center light">Greetings to all!</h1>
                </div>
              </div>
            </div>
            <div className="container card-con border shadow-sm content">
              <div className="row mt-3">
                <Cards news={news} />
            </div>
            </div>
          </Route>
          <Route path="/about" exact>
            <About />
          </Route>
          <Route path="/contacts" exact>
            <Contacts />
          </Route>
          <Route path="/register" exact>
            <Register />
          </Route>
          <Route path="/items/:id" exact>
            <div>
              <Detail news={news} />
            </div>
          </Route>
        </main> */}
    </div>
  );
}

export default App;
