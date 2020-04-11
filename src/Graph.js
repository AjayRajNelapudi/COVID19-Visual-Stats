import React from 'react';
import {Container, Row, Col, Dropdown, Form, Button} from 'react-bootstrap';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer} from 'recharts';
import Navigation from './Navigation';

class Graph extends React.Component {
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

    getCountryTimeSeries() {
        let countryTimeSeries = this.state.timeSeries[this.state.country];
        if (countryTimeSeries === undefined) {
            return [];
        }
        return countryTimeSeries;
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

    render() {
        let countries = this.renderCountries();
        let countryTimeSeries = this.getCountryTimeSeries();
        countryTimeSeries = this.reverseDates(countryTimeSeries);
        return (
            <div>
                <Navigation />
                <Container fluid>
                    <Row>
                        <Col md={{span: 0, offset: 1}}>
                            <Dropdown>
                                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                                    {this.state.country}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Form.Control type="text" placeholder={this.state.searchBarText} onChange={(e) => this.updateSearchBarText(e.target.value)} /> 
                                    {countries}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ResponsiveContainer width={'99%'} height={700}>
                                <AreaChart width={1400} height={700} data={countryTimeSeries}
                                    margin={{top: 10, right: 30, left: 30, bottom: 0}}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="date"/>
                                    <YAxis />
                                    <Tooltip/>
                                    <Area type='monotone' dataKey='confirmed' stroke='#8884d8' fill='#8884d8' />
                                    <Area type='monotone' dataKey='deaths' stroke='#8884d8' fill='#cc0000' />
                                    <Area type='monotone' dataKey='recovered' stroke='#8884d8' fill='#82ca9d' />
                                    <LabelList content={['hello', 'world']} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Graph;
