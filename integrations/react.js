const CONTEXT_TYPES = {
  store: () => {}
};

export const connect = (selector) => ComponentToWrap => {
  class StoreComponent extends React.Component {
		state = {};

    componentDidMount() {
      const {subscribe} = this.context.store;
      this.unsubscribe = subscribe(storeState => {
        this.setState({
					state: selector(storeState, this.props)
				});
      });
    }

    componentWillUnMount() {
      this.unsubscribe();
    }

    render() {
      return <ComponentToWrap {...this.props} {...this.state} dispatch={this.context.store.dispatch} />;
    }
  }
  StoreComponent.contextTypes = CONTEXT_TYPES;
  return StoreComponent;
};

export class Provider extends React.Component {
  getChildContext() {
    return { store: this.props.store };
  }
  render() {
    return React.Children.only(this.props.children);
  }
}
Provider.childContextTypes = CONTEXT_TYPES;
