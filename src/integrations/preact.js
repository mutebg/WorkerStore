import {h, Component} from 'preact'

export const connect = selector => ComponentToWrap => {
  class StoreComponent extends Component {
    componentDidMount() {
      const {subscribe} = this.context.store
      if (subscribe && selector) {
        this.unsubscribe = subscribe(({state}) => {
          this.setState(selector(state, this.props))
          // TODO
          this.forceUpdate()
        })
      }
    }

    componentWillUnMount() {
      this.unsubscribe()
    }

    render(props, state) {
      return h(
        ComponentToWrap,
        Object.assign({dispatch: this.context.store.dispatch}, props, state),
      )
    }
  }
  return StoreComponent
}

export function Provider(props) {
  this.getChildContext = () => ({store: props.store})
}
Provider.prototype.render = props => props.children[0]
