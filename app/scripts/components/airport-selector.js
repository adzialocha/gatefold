import classnames from 'classnames';
import { h, Component } from 'preact';

import request from '../request';
import { debounce } from '../utils';

export default class AirportSelector extends Component {
  componentDidMount() {
    // Take first airport data from database when
    // field was already filled with value
    if (this.props.value) {
      this.fetchAirportById(this.props.value)
        .then(selection => {
          this.setState({
            selection,
          });
        });
    }
  }

  onSearchInput(event) {
    const { value } = event.target;

    this.setState({
      searchQuery: value,
    });

    if (value.length > 0) {
      this.debouncedFetchAirports(value);
    } else {
      this.setState({
        searchList: [],
      });
    }
  }

  onRemove(event) {
    event.preventDefault();

    this.setState({
      selection: undefined,
    });

    this.onChange(undefined);
  }

  onChange(value) {
    const { name } = this.props;

    this.props.onChange({
      name,
      value,
    });
  }

  renderList() {
    return this.state.searchList.map(item => {
      const onClick = () => {
        this.setState({
          searchList: [],
          searchQuery: '',
          selection: item,
        });

        this.onChange(item);
      };

      const label = `${item.name} - ${item.city}, ${item.country} [${item.iata}]`;

      return (
        <li
          className='airport-selector__search-list-item'
          key={item.id}
          onClick={onClick}
        >
          { label }
        </li>
      );
    });
  }

  renderSearch() {
    return (
      <div className='airport-selector__search'>
        <label for='airport-search'>
          <input
            autocomplete='off'
            className='airport-selector__search-input'
            disabled={this.state.isDisabled}
            id={this.props.name}
            placeholder='Enter Airport, City, Country ...'
            type='text'
            value={this.state.searchQuery}
            onInput={this.onSearchInput}
          />
        </label>

        <ul className='airport-selector__search-list'>
          { this.renderList() }
        </ul>
      </div>
    );
  }

  renderSelection() {
    if (!this.state.selection) {
      return this.renderSearch();
    }

    return (
      <div className='airport-selector__selection-name'>
        { this.state.selection.name }

        <button
          className='airport-selector__selection-button'
          onClick={this.onRemove}
        >
          Remove
        </button>
      </div>
    );
  }

  renderValue() {
    if (!this.state.selection) {
      return;
    }

    return (
      <input
        name={this.props.name}
        type='hidden'
        value={this.state.selection.id}
      />
    );
  }

  render() {
    const className = classnames('airport-selector', {
      'airport-selector--search-active': this.state.isSearchActive,
      'airport-selector--selected': this.state.selection,
    });

    return (
      <div className={className}>
        <div className='airport-selector__selection'>
          { this.renderSelection() }
        </div>

        { this.renderValue() }
      </div>
    );
  }

  fetchAirportById(id) {
    this.setState({
      isDisabled: true,
    });

    return request(['api', 'airports', id])
      .then(({ data }) => {
        this.setState({
          isDisabled: false,
        });

        return Promise.resolve(data);
      })
      .catch(() => {
        this.setState({
          isDisabled: false,
        });
      });
  }

  fetchAirports(query) {
    return request(['api', 'airports'], { query })
      .then(({ data }) => {
        this.setState({
          searchList: data,
        });

        return Promise.resolve(data);
      });
  }

  constructor(props) {
    super(props);

    this.state = {
      isDisabled: false,
      searchList: [],
      searchQuery: '',
      selection: undefined,
    };

    this.fetchAirports = this.fetchAirports.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);

    this.debouncedFetchAirports = debounce(this.fetchAirports, 250);
  }
}
