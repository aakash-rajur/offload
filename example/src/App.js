import React, {Component, Fragment} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Header from "./components/header/";
import Posts from "./screens/posts";
import Users from "./screens/users";
import {POSTS, USERS} from "./constants";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Fragment>
				<Route exact path='/' component={() => <Redirect to={USERS}/>}/>
				<Header/>
				<Switch>
					<Route exact path={USERS} component={Users}/>
					<Route exact path={POSTS} component={Posts}/>
				</Switch>
			</Fragment>
		);
	}
}

export default App;