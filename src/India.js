import React from 'react';
import Navigation from './Navigation';
import {Container, Row, Col, Dropdown, Form} from 'react-bootstrap';
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class India extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            state: 'All States',
            searchBarText: '',
            stateBreakout: [],
            districtBreakout: {}
        }
    }

    componentWillMount() {
        fetch('https://api.covid19india.org/data.json')
        .then((response) => {
            return response.json();
        })
        .then((indiaData) => {
            this.setState({
                stateBreakout: indiaData.statewise
            });
        })
        .catch((error) => {
            console.log(error);
        });

        fetch('https://api.covid19india.org/state_district_wise.json')
        .then((response) => {
            return response.json();
        })
        .then((indiaData) => {
            this.setState({
                districtBreakout: indiaData
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateState(newState) {
        this.setState({
            state: newState,
            searchBarText: ''
        });
    }

    updateSearchBarText(newText) {
        this.setState({
            searchBarText: newText
        });
    }

    renderStates() {
        let filteredStates = this.state.searchBarText === '' ? 
            Object.keys(this.state.districtBreakout) : Object.keys(this.state.districtBreakout).filter((state) => {
                return state.toLowerCase().includes(this.state.searchBarText.toLowerCase());
            });
        filteredStates.unshift('All States');
        let states = filteredStates.map((state) => {
            return (
                <Dropdown.Item key={state} onClick={(e) => this.updateState(state)}>
                    {state}
                </Dropdown.Item>
            );
        });
        return states;
    }

    renderStackedBarChart(data) {
        if (data === undefined || data.length == 0) {
            return <span></span>;
        }
        return (
            <ResponsiveContainer width={'99%'} height={700}>
                <BarChart data={data}
                    margin={{top: 20, right: 30, left: 20, bottom: 0}}
                >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='state' interval='preserveStartEnd'/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='confirmed' stackId='a' fill='#8884d8' />
                    {data[0].deaths === undefined ? <span></span> : <Bar dataKey='deaths' stackId='a' fill='#cc0000' />}
                    {data[0].recovered === undefined ? <span></span> : <Bar dataKey='recovered' stackId='a' fill='#82ca9d' />}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    getStats() {
        let stats = [], currentStats = {};
        if (this.state.state === 'All States') {
            if (Object.keys(this.state.stateBreakout).length === 0 && this.state.stateBreakout.constructor === Object) {
                return {stats, currentStats};
            }

            currentStats = this.state.stateBreakout.shift();
            stats = this.state.stateBreakout.slice();
            this.state.stateBreakout.unshift(currentStats);
        } else {
            if (Object.keys(this.state.districtBreakout).length === 0 && this.state.districtBreakout.constructor === Object) {
                return {stats, currentStats};
            }
            currentStats.confirmed = 0;
            let districtData = this.state.districtBreakout[this.state.state].districtData;
            stats = Object.keys(districtData).map((district) => {
                currentStats.confirmed += districtData[district].confirmed;
                return ({
                    state: district,
                    confirmed: districtData[district].confirmed
                });
            });
        }
        return {stats, currentStats};
    }

    render() {
        let states = this.renderStates();
        let {stats, currentStats} = this.getStats();
        return (
            <div>
                <Navigation />
                <Container fluid>
                    <Row>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    {this.state.state}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Form.Control type="text" placeholder="Search" onChange={(e) => this.updateSearchBarText(e.target.value)} /> 
                                    {states}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <h4 style={{color: '#8884d8'}}>Confirmed: {currentStats === undefined || currentStats.confirmed === undefined ? 'N/A' : currentStats.confirmed}</h4>
                        </Col>
                        <Col>
                            <h4 style={{color: '#cc0000'}}>Deaths: {currentStats === undefined || currentStats.deaths === undefined ? 'N/A' : currentStats.deaths}</h4>
                        </Col>
                        <Col>
                            <h4 style={{color: '#82ca9d'}}>Recovered: {currentStats === undefined || currentStats.recovered === undefined ? 'N/A' : currentStats.recovered}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.renderStackedBarChart(stats)}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }   
}
export default India;
