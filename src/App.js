import React from 'react';
// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import GlobalTrends from './GlobalTrends';
import IndiaTrends from './IndiaTrends';
import About from './About';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route path="/globaltrends">
							<GlobalTrends />
						</Route>
						<Route path="/indiatrends">
							<IndiaTrends />
						</Route>
						<Route path="/about">
							<About />
						</Route>
						<Route path="/">
							<GlobalTrends />
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
