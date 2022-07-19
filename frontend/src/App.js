import "./App.css";
import { Route, Switch } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import ChatsPage from "./Pages/ChatsPage";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={"/"} exact component={HomePage} />
        <Route path={"/chats"} exact component={ChatsPage} />
      </Switch>
    </div>
  );
}

export default App;
