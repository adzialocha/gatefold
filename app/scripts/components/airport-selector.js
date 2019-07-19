import { h, Component } from 'preact';

export default class AirportSelector extends Component {
  render() {
    return (
      <input name={this.props.name} className='airport-selector' />
    );
  }
}
