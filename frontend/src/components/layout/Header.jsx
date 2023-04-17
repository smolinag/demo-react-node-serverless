import React, {useState} from 'react';
import {Auth} from '@aws-amplify/auth';
import {AppBar, Button, Tab, Tabs, Toolbar, useMediaQuery, useTheme} from '@mui/material';
import {Logout} from '@mui/icons-material';
import {Image} from '@aws-amplify/ui-react';
import {useNavigate} from 'react-router-dom';
import logo2 from '../../assets/logo2.png';
import DrawerComp from './Drawer';
import {useAuthContext} from '../../context/AuthContext';

const Header = () => {
	const navigate = useNavigate();
	const [value, setValue] = useState(0);
	const theme = useTheme();
	const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

	const {user} = useAuthContext();

	const signOutFunction = () => {
		Auth.signOut();
	};

	return (
		<AppBar sx={{background: '#1a4a69'}}>
			<Toolbar>
				<Image alt="logo2" src={logo2} style={{width: '150px'}} />
				{isMatch ? (
					<DrawerComp />
				) : (
					<>
						<Tabs
							sx={{marginLeft: '1rem'}}
							indicatorColor="primary"
							value={value}
							onChange={(e, value) => {
								setValue(value);
							}}>
							<Tab label="Companies" style={{color: 'white'}} onClick={() => navigate('/companies')} />
						</Tabs>
						<div className="row justify-content-center" style={{color: 'white', marginLeft: 'auto'}}>
							<div className="col-7">{user.email}</div>
							<div className="col-7">{user?.groups ?? 'Visitors'}</div>
						</div>
						<Button style={{color: 'white', borderColor: 'white'}} variant="outlined" onClick={signOutFunction} endIcon={<Logout/>}>
							Logout
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
