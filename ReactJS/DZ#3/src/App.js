import { Route, Switch } from "react-router";
import { BrowserRouter as Router, Link } from "react-router-dom";

import Planets from "pages/Planets";
import PlanetDetails from "pages/PlanetDetails";
import Movies from "pages/Movies";
import MovieDetails from "pages/MovieDetails";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";

const App = () => {
  return (
    <div className="container">
      <Router>
        <div>
          <Header />

          <Switch>
            <Route path="/films">
              <ErrorBoundary>
                <Movies />
              </ErrorBoundary>
            </Route>
            <Route path="/film/:id">
              <ErrorBoundary>
                <MovieDetails />
              </ErrorBoundary>
            </Route>
            <Route path="/(planets)?" exact>
              <ErrorBoundary>
                <Planets />
              </ErrorBoundary>
            </Route>
            <Route path="/planet/:id">
              <ErrorBoundary>
                <PlanetDetails />
              </ErrorBoundary>
            </Route>

            <Route>
              <>
                <p>Resource Not Found</p>
                <p>
                  <Link to="/">go Home</Link>
                </p>
              </>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
