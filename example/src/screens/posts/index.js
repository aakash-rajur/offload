import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import {getInstance} from 'offload';
import Post from "../../components/post";
import User from "../../components/user";

import './style.css';

class Posts extends Component {
	static propTypes = {
		location: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			posts: []
		};
	}

	componentDidCatch() {
		this.setState({redirect: true});
	}

	async componentDidMount() {
		let {location: {state: {id}}} = this.props,
			posts = await (getInstance().getPostsofUser(id));
		this.setState({posts});
	}

	render() {
		if (this.state.redirect) return <Redirect to='/'/>;
		let {location: {state: user}} = this.props,
			{posts} = this.state;
		return (
			!posts.length ?
				<div className="no-data">
					<CircularProgress size={50} color='secondary'/>
				</div> :
				<div className="posts-wrapper">
					<User {...user} canNavigate={false}/>
					<div className="post-list">
						{posts.map((post, index) => <Post key={index} {...post}/>)}
					</div>
				</div>

		);
	}
}

export default Posts;
/*


 */