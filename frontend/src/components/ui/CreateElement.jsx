import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from '@mui/material';

const CreateElement = ({open, columns, title,  onClose, onSubmit}) => {
	const [values, setValues] = useState(() =>
		columns.reduce((acc, column) => {
			acc[column.accessorKey ?? ''] = '';
			return acc;
		}, {})
	);

	const handleSubmit = () => {
		// put your validation logic here
		onSubmit(values);
		onClose();
	};

	return (
		<Dialog open={open}>
			<DialogTitle textAlign="center">{title}</DialogTitle>
			<DialogContent>
				<form onSubmit={(e) => e.preventDefault()}>
					<Stack
						sx={{
							width: '100%',
							minWidth: {xs: '300px', sm: '360px', md: '400px'},
							gap: '1.5rem'
						}}>
						{columns.map((column) => (
							<TextField
								key={column.accessorKey}
								label={column.header}
								name={column.accessorKey}
								onChange={(e) => setValues({...values, [e.target.name]: e.target.value})}
							/>
						))}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{p: '1.25rem'}}>
				<Button style={{color: 'black', borderColor: 'black'}} onClick={onClose}>
					Cancel
				</Button>
				<Button style={{color: 'black', borderColor: 'black'}} onClick={handleSubmit}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateElement;
