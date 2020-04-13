import React from 'react';
import Navigation from './Navigation';
import {Jumbotron} from 'react-bootstrap';

class About extends React.Component {
    render() {
        return (
            <div>
                <Navigation />
                <Jumbotron>
                    <h1>About</h1>
                    <p>
                        Designed and Developed by <a href='https://www.linkedin.com/in/ajay-raj-nelapudi/'>Ajay Raj Nelapudi</a><br/>.
                        View the source code at <a href='https://github.com/AjayRajNelapudi/COVID19-Visual-Stats'>github</a>.
                    </p>
                    <br/><br/>
                    <h3>Global Trends</h3>
                    <p>
                        Global trends plotted with time series data from&nbsp;
                        <a href='https://github.com/pomber/covid19'>https://github.com/pomber/covid19</a><br/>
                        which fetches and transforms data daily from<br/>
                        Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE).
                    </p>
                    <br/><br/>
                    <h3>India Stats</h3>
                    <p>
                        India trends rendered using data provided by&nbsp;
                        <a href='https://documenter.getpostman.com/view/10724784/SzYXXKmA?version=latest#84b3a84a-a075-4c2e-a426-d4010ceca775'>COVID19-India API</a>.<br/>
                        This API updates more frequently and provides more accuracte data.<br/>
                        This might make the global stats look obsolete.
                    </p>
                </Jumbotron>
            </div>
        );
    }
}

export default About;
