import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import GlobalStats from './GlobalStats';
import IndiaStats from './IndiaStats';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route path="/globalstats">
							<GlobalStats />
						</Route>
						<Route path="/indiastats">
							<IndiaStats />
						</Route>
						<Route path="/">
							<GlobalStats />
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
