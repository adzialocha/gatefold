import { h, Component } from 'preact';

import request from '../request';

export default class TokensList extends Component {
  componentDidMount() {
    this.fetchTokens();
  }

  renderMessage(token) {
    if (!token.payment.message) {
      return;
    }

    return <p>{ token.payment.message }</p>;
  }

  renderList() {
    return this.state.list.map(token => {
      const { airports, payment, calculations } = token;

      return (
        <li
          className='tokens-list__item'
          key={token.id}
        >
          <p>{ payment.name } paid for { token.name }</p>
          { this.renderMessage(token) }
          <p>{ airports.from.city } - { airports.to.city }</p>
          <p>{ calculations.distance } km { calculations.emission } kg CO2</p>
          <p><strong>{ calculations.costs } Euro</strong></p>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className='tokens-list'>
        { this.renderList() }
      </ul>
    );
  }

  fetchTokens() {
    this.setState({
      isLoading: true,
    });

    return request(['api', 'tokens'])
      .then(({ data }) => {
        this.setState({
          isLoading: false,
          list: data,
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
      });
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      list: [],
    };
  }
}
