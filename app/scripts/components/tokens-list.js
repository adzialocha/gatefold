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

    return <p className='tokens-list__item-message'>{ token.payment.message }</p>;
  }

  renderList() {
    return this.state.list.map(token => {
      const { airports, payment, calculations } = token;

      return (
        <li
          className='tokens-list__item'
          key={token.id}
        >
          <p><strong>{ payment.name }</strong> paid <strong>{calculations.costs} Euro</strong> carbon offset for <strong>{ token.name }</strong>.</p>

          <p>Return-flight from <strong>{ airports.from.city }</strong> to <strong>{ airports.to.city }</strong>.</p>

          { this.renderMessage(token) }
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
