import classnames from 'classnames';
import { h, Component } from 'preact';

import AirportSelector from './airport-selector';

export default class CarbonCalculator extends Component {
  componentDidUpdate(prevProps, prevState) {
    const { from, to } = this.state.airports;

    if (from && to) {
      this.calculateCarbonOffset(from, to);
    }
  }

  onAirportChange(event) {
    const { name, value } = event;

    this.setState({
      airports: Object.assign({}, this.state.airports, {
        [name]: value,
      }),
    });

    if (!value) {
      this.setState({
        calculation: undefined,
      });
    }
  }

  render() {
    const className = classnames('carbon-calculator');

    return (
      <div className={className}>
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
      </div>
    );
  }

  calculateCarbonOffset(from, to) {
    // @TODO
  }

  constructor(props) {
    super(props);

    this.state = {
      airports: {
        from: undefined,
        to: undefined,
      },
      calculation: undefined,
    };

    this.onAirportChange = this.onAirportChange.bind(this);
  }
}
