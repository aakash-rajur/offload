import React, {Component, Fragment} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {getInstance} from "offload";
import Header from "./components/header/";
import Posts from "./screens/posts";
import Users from "./screens/users";
import {POSTS} from "./constants";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	async componentDidMount() {
		console.log(await getInstance().getPost(1));
	}

	render() {
		return (
			<Fragment>
				<Header/>
				<Switch>
					<Route exact path='/' component={Users}/>
					<Route exact path={POSTS} component={Posts}/>
				</Switch>
			</Fragment>
		);
	}
}

export default App;