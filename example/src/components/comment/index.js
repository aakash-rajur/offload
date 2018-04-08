import React from 'react';
import PropTypes from 'prop-types';

function Comment({email, body}) {
	return (
		<div className="comment">
			<div className="body">{body}</div>
			<div className="email">{email}</div>
		</div>
	)
}

Comment.prototype = {
	email: PropTypes.string,
	body: PropTypes.string
};

export default Comment;