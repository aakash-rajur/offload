import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Card from 'material-ui/Card';

function compileAddress(address) {
	if (!address) return '';
	let {street, suite, city, zipcode} = address;
	return `${suite}, ${street}, ${city}, ${zipcode}`;
}

function User(props) {
	let content = (
		<Fragment>
			<img src={props.profile} alt={props.username} className="profile"/>
			<div className="uid">#{props.id}</div>
			<div className="user-name">@{props.username}</div>
			<div className="name">{props.name}</div>
			<div className="email">{props.email}</div>
			<div className="address">{compileAddress(props.address)}</div>
		</Fragment>
	), {canNavigate} = props;
	return (
		<Card className={props.canNavigate ? '' : 'user-post'}>
			{canNavigate ?
				<Link
					className="user"
					to={{
						pathname: `/@${props.username}/posts`,
						state: props
					}}>
					{content}
				</Link> : content}
		</Card>
	);
}

User.propTypes = {
	canNavigate: PropTypes.bool,
	profile: PropTypes.string,
	id: PropTypes.number,
	username: PropTypes.string,
	name: PropTypes.string,
	email: PropTypes.string,
	address: PropTypes.object
};

export default User;