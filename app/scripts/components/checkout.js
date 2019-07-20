import { h, Component } from 'preact';

import request from '../request';

export default class Checkout extends Component {
  onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementsByTagName('form')[0]);

    this.setState({
      isLoading: true,
    });

    request(['tokens', this.props.token], formData, 'PUT')
      .then(({ data }) => {
        window.location.replace(data.redirectUrl);
      })
      .catch(err => {
        // @TODO: Inform user when something went wrong
        console.error(err);
      })
      .finally(() => {
        this.setState({
          isLoading: true,
        });
      });
  }

  render() {
    const label = this.state.isLoading ? 'Please wait ..' : 'Pay';

    return (
      <button
        className='form__submit'
        disabled={this.state.isLoading}
        type='submit'
        onClick={this.onSubmit}
      >
        { label }
      </button>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }
}
