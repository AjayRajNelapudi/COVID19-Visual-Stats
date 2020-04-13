import React from 'react';
import {Container, Row, Col, Dropdown, Form} from 'react-bootstrap';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import Navigation from './Navigation';

class GlobalTrends extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            country: 'India',
            searchBarText: '',
            timeSeries: {}
        };
    }

    componentWillMount() {
        fetch('https://pomber.github.io/covid19/timeseries.json')
        .then((response) => {
            return response.json();
        })
        .then((timeSeries) => {
            this.setState({
                timeSeries: timeSeries
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    updateCountry(newCountry) {
        this.setState({
            country: newCountry,
            searchBarText: ''
        });
    }

    updateSearchBarText(newText) {
        this.setState({
            searchBarText: newText
        });
    }

    renderCountries() {
        let filteredCountries = this.state.searchBarText === '' ?
            Object.keys(this.state.timeSeries) :
            Object.keys(this.state.timeSeries).filter((country) => {
                return country.toLowerCase().includes(this.state.searchBarText.toLowerCase());
            });
        let countries = filteredCountries.map((country) => {
            return (
                <Dropdown.Item key={country} onClick={(e) => this.updateCountry(country)}>
                    {country}
                </Dropdown.Item>    
            );
        })
        return countries;
    }

    getStats() {
        let countryTimeSeries = this.state.timeSeries[this.state.country];
        let currentStats = [];
        if (countryTimeSeries === undefined) {
            countryTimeSeries = [];
        } else {
            countryTimeSeries = this.reverseDates(countryTimeSeries);
            currentStats = countryTimeSeries[countryTimeSeries.length - 1];
        }
        return {countryTimeSeries, currentStats}
    }

    reverseDates(countryTimeSeries) {
        let modifiedCountryTimeSeries = countryTimeSeries.map((country) => {
            return {
                ...country,
                date: country.date.split('-').reverse().join('/'),
            }
        });
        return modifiedCountryTimeSeries;
    }

    renderAreaChart(countryTimeSeries) {
        return (
            <ResponsiveContainer width={'99%'} height={700}>
                <AreaChart width={1400} height={700} data={countryTimeSeries}
                    margin={{top: 10, right: 30, left: 30, bottom: 0}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis />
                    <Tooltip/>
                    <Area type='monotone' dataKey='confirmed' stroke='#8884d8' fill='#8884d8' />
                    <Area type='monotone' dataKey='recovered' stroke='#8884d8' fill='#82ca9d' />
                    <Area type='monotone' dataKey='deaths' stroke='#8884d8' fill='#cc0000' />
                </AreaChart>
            </ResponsiveContainer>
        );
    }

    render() {
        let countries = this.renderCountries();
        let {countryTimeSeries, currentStats} = this.getStats();
        return (
            <div>
                <Navigation />
                <Container fluid>
                    <Row>
                        <Col>
                            <Dropdown>
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    {this.state.country}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={this.state.searchBarText}    
                                        onChange={(e) => this.updateSearchBarText(e.target.value)}
                                    /> 
                                    {countries}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col>
                            <h4 style={{color: '#8884d8'}}>Confirmed: {currentStats === undefined ? 0 : currentStats.confirmed}</h4>
                        </Col>
                        <Col>
                            <h4 style={{color: '#cc0000'}}>Deaths: {currentStats === undefined ? 0 : currentStats.deaths}</h4>
                        </Col>
                        <Col>
                            <h4 style={{color: '#82ca9d'}}>Recovered: {currentStats === undefined ? 0 : currentStats.recovered}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.renderAreaChart(countryTimeSeries)}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default GlobalTrends;
