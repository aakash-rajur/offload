import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel, {
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import {getInstance} from 'offload';
import Comment from "../comment";

class Post extends Component {
	static propTypes = {
		id: PropTypes.number,
		title: PropTypes.string,
		body: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.state = {comments: [], expanded: false};
	}

	render() {
		let {title, body} = this.props,
			{comments, expanded} = this.state;
		return (
			<ExpansionPanel className='expansion-wrapper' onChange={this.onChange}>
				<ExpansionPanelSummary className='post'>
					<h3 className="title">{title}</h3>
					<IconButton className='expand-icon'>
						<span className="material-icons">{expanded ? 'expand_less': 'expand_more'}</span>
					</IconButton>
					<em className="body">{body}</em>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails className='comment-list'>
					{comments.length ?
						comments.map((comment, i) => <Comment {...comment} key={i}/>) :
						<div className="no-data">
							<CircularProgress size={50} color='secondary'/>
						</div>}
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}

	async onChange(expanded, bool) {
		this.setState({expanded: bool});
		if (!bool || this.state.comments.length) return;
		let comments = await (getInstance().getCommentofPost(this.props.id));
		this.setState({comments});
	}
}

export default Post;