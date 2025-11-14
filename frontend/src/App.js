import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MoodSelector from "./components/MoodSelector";
import AuthForms from "./components/AuthForms";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/mood" component={MoodSelector} />
        <Route path="/auth" component={AuthForms} />
        <Route path="/" exact component={AuthForms} />
      </Switch>
    </Router>
  );
}

export default App;
