import classnames from 'classnames';
import { h, Component } from 'preact';

import AirportSelector from './airport-selector';

import {
  calculateCosts,
  calculateDistance,
  calculateEmission,
} from '../../../common/carbon-calculator';

export default class CarbonCalculator extends Component {
  onAirportChange(event) {
    const { name, value } = event;

    this._airports = Object.assign({}, this._airports, {
      [name]: value,
    });

    const { from, to } = this._airports;

    if (from && to) {
      this.calculateCarbonOffset(from, to);
    } else {
      this.setState({
        calculation: undefined,
      });
    }
  }

  renderAirports() {
    return (
      <div className='carbon-calculator__airports'>
        <label for='from'>
          From airport
          <AirportSelector name='from' value={this.props.from} onChange={this.onAirportChange} />
        </label>

        <label for='to'>
          To airport
          <AirportSelector name='to' value={this.props.to} onChange={this.onAirportChange} />
        </label>
      </div>
    );
  }

  renderCalculation() {
    if (!this.state.calculation) {
      return;
    }

    const { distance, costs, emission } = this.state.calculation;

    return (
      <div className='carbon-calculator__results'>
        <div className='carbon-calculator__results-distance'>
          { distance } Kilometers
        </div>

        <div className='carbon-calculator__results-emission'>
          { emission } Kilogram CO2
        </div>

        <div className='carbon-calculator__results-costs'>
          { costs } Euro
        </div>
      </div>
    );
  }

  render() {
    const className = classnames('carbon-calculator');

    return (
      <div className={className}>
        { this.renderAirports() }
        { this.renderCalculation() }
      </div>
    );
  }

  calculateCarbonOffset(from, to) {
    const distance = calculateDistance(from.lat, from.lon, to.lat, to.lon);
    const emission = calculateEmission(distance);
    const costs = calculateCosts(emission);

    this.setState({
      calculation: {
        costs: costs.toFixed(2),
        distance: distance.toFixed(2),
        emission: emission.toFixed(2),
      },
    });
  }

  constructor(props) {
    super(props);

    this._airports = {
      from: undefined,
      to: undefined,
    };

    this.state = {
      calculation: undefined,
    };

    this.onAirportChange = this.onAirportChange.bind(this);
  }
}
