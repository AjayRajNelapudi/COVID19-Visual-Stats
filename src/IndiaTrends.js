import React from 'react';
import Navigation from './Navigation';
import {Container, Row, Col, Dropdown, Form} from 'react-bootstrap';
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList} from 'recharts';

class IndiaTrends extends React.Component {
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

    renderDeltaConfirmed(props) {
        const {x, y, width, value} = props;
        const radius = 15;
        return (
            <g>
                <text x={x + width / 2} y={y - radius} fill='#8884d8' textAnchor='middle' dominantBaseline='middle'>
                    +{value}
                </text>
            </g>
        );
    }

    renderStackedBarChart(data) {
        if (data === undefined || data.length === 0) {
            return <span></span>;
        }
        return (
            <ResponsiveContainer width={'99%'} height={700}>
                <BarChart data={data}
                    margin={{top: 50, right: 30, left: 20, bottom: 0}}
                >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='state' interval='preserveStartEnd'/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='confirmed' stackId='a' fill='#8884d8'>
                        {
                            data[0].recovered === undefined ?
                                <LabelList dataKey='deltaconfirmed' content={this.renderDeltaConfirmed} /> : <span></span>
                        }
                    </Bar>
                    {data[0].deaths !== undefined ? <Bar dataKey='deaths' stackId='a' fill='#cc0000' /> : <span></span>}
                    {
                        data[0].recovered !== undefined ?
                            (
                                <Bar dataKey='recovered' stackId='a' fill='#82ca9d'>
                                    <LabelList dataKey='deltaconfirmed' content={this.renderDeltaConfirmed} />
                                </Bar>
                            ) :
                            <span></span>
                    }
                </BarChart>
            </ResponsiveContainer>
        );
    }

    getStats() {
        let stats = [];
        let currentStats = {
            confirmed: 'N/A',
            deaths: 'N/A',
            recovered: 'N/A',
            deltaconfirmed: 'N/A',
            deltadeaths: 'N/A',
            deltarecovered: 'N/A'
        };
        if (this.state.state === 'All States') {
            if (Object.keys(this.state.stateBreakout).length === 0) {
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
            currentStats.deltaconfirmed = 0;
            let districtData = this.state.districtBreakout[this.state.state].districtData;
            stats = Object.keys(districtData).map((district) => {
                currentStats.confirmed += districtData[district].confirmed;
                currentStats.deltaconfirmed += districtData[district].delta.confirmed;
                return ({
                    state: district,
                    confirmed: districtData[district].confirmed,
                    deltaconfirmed: districtData[district].delta.confirmed
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
                                <Dropdown.Toggle variant='dark' id='dropdown-basic'>
                                    {this.state.state}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Form.Control
                                        type='text'
                                        placeholder='Search'
                                        value={this.state.searchBarText}
                                        onChange={(e) => this.updateSearchBarText(e.target.value)}
                                    /> 
                                    {states}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <h4 style={{color: '#8884d8'}}>
                                Confirmed: {currentStats.confirmed}
                                , +{currentStats.deltaconfirmed} today
                            </h4>
                        </Col>
                        <Col>
                            <h4 style={{color: '#cc0000'}}>
                                Deaths: {currentStats.deaths}
                                {
                                    currentStats.deltadeaths !== 'N/A' ?
                                        ', +' + currentStats.deltadeaths + ' today' :
                                        <span></span>
                                }
                            </h4>
                        </Col>
                        <Col>
                            <h4 style={{color: '#82ca9d'}}>
                                Recovered: {currentStats.recovered}
                                {
                                    currentStats.deltarecovered !== 'N/A' ?
                                        ', +' + currentStats.deltarecovered + ' today' :
                                        <span></span>
                                }
                            </h4>
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
export default IndiaTrends;
