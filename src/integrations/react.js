import React from 'react'

const CONTEXT_TYPES = {
  store: () => {},
}

export const connect = selector => ComponentToWrap => {
  class StoreComponent extends React.Component {
    constructor(props, context) {
      super(props, context)
      this.state = {}
    }

    componentDidMount() {
      const {subscribe} = this.context.store
      if (subscribe && selector) {
        this.unsubscribe = subscribe(storeState => {
          this.setState(selector(storeState, this.props))
        })
      }
    }

    componentWillUnMount() {
      this.unsubscribe()
    }

    render() {
      return React.createElement(
        ComponentToWrap,
        Object.assign(
          {dispatch: this.context.store.dispatch},
          this.props,
          this.state,
        ),
      )
    }
  }
  StoreComponent.contextTypes = CONTEXT_TYPES
  return StoreComponent
}

export class Provider extends React.Component {
  getChildContext() {
    const {store} = this.props
    return {store}
  }
  render() {
    return React.Children.only(this.props.children)
  }
}

Provider.childContextTypes = CONTEXT_TYPES
