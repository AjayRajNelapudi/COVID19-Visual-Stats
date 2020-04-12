import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import Graph from './Graph';
import India from './India';

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route path="/graphs">
							<Graph />
						</Route>
						<Route path="/india">
							<India />
						</Route>
						<Route path="/">
							<Graph />
						</Route>
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
