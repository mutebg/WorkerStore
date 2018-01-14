import { h, Component } from 'preact';

export const connect = () => () => null;

export function Provider(props) {
	this.getChildContext = () => ({ store: props.store });
}
Provider.prototype.render = props => props.children[0];
