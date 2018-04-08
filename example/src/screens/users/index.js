import React, {Component} from 'react';
import {getInstance} from 'offload'
import CircularProgress from 'material-ui/Progress/CircularProgress';
import User from '../../components/user';

import './style.css';

function setProfileImage(user) {
	user.profile = `https://picsum.photos/300/300?image=${Math.floor(50 * Math.random())}`;
	return user;
}

class Users extends Component {
	constructor(props) {
		super(props);
		this.state = {users: []};
	}

	async componentDidMount() {
		let users = (await (getInstance().getUsers()))
			.map(setProfileImage);
		this.setState({users});
	}

	render() {
		let {users} = this.state;
		if (!users.length)
			return (
				<div className="no-data">
					<CircularProgress size={50} color='secondary'/>
				</div>
			);
		return (
			<div className="users-layout">
				{users.map((user, i) => <User key={i} canNavigate={true} {...user}/>)}
			</div>
		);
	}
}

export default Users;