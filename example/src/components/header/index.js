import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import {withRouter} from "react-router";

import './style.css';

function Header({history: {goBack}}) {
	return (
		<AppBar position='sticky' className='header'>
			<Toolbar>
				<IconButton
					aria-label='menu'
					className='menu'
					onClick={goBack}>
					<span className="material-icons">arrow_back</span>
				</IconButton>
				<Typography variant="title" color="inherit">
					Dopeddit
				</Typography>
			</Toolbar>
		</AppBar>
	);
}

Header.propTypes = {
	location: PropTypes.object
};

export default withRouter(Header);