import React, {useCallback, useState, useEffect} from 'react';
import MaterialReactTable from 'material-react-table';
import {Button, IconButton, Tooltip} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {Delete, Edit, Visibility, Add} from '@mui/icons-material';
import CreateElement from '../components/ui/CreateElement';
import {getCompanies, insertCompany, updateCompany, deleteCompany} from '../api/companies';
import {checkUserAdmin} from '../utils/validators';
import {useAuthContext} from '../context/AuthContext';
import './Companies.css';

const Companies = () => {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [companies, setCompanies] = useState([]);
	const [validationErrors, setValidationErrors] = useState({});
	const navigate = useNavigate();

	const {user} = useAuthContext();

	useEffect(() => {
		const fetchData = async () => {
			const companies = await getCompanies();
			setCompanies(companies);
		};
		fetchData();
	}, []);

	const handleCreateNewRow = async (values) => {
		const company = await insertCompany(values);
		companies.push(company);
		setCompanies([...companies]);
	};

	const handleUpdateRow = async ({exitEditingMode, row, values}) => {
		if (!Object.keys(validationErrors).length) {
			const itemId = companies[row.index].id;

			const updatedItem = {
				...companies[row.index],
				nit: values.nit,
				name: values.name,
				address: values.address,
				phone: values.phone
			};

			await updateCompany(itemId, updatedItem);

			companies[row.index] = updatedItem;

			setCompanies([...companies]);
			exitEditingMode(); // required to exit editing mode and close modal
		}
	};

	const handleDeleteRow = useCallback(
		async (row) => {
			if (!confirm(`Are you sure you want to delete the company ${row.getValue('name')}`)) {
				return;
			}
			const itemId = row.original.id;
			await deleteCompany(itemId);
			const companies = await getCompanies();
			setCompanies(companies);
		},
		[companies]
	);

	const handleCancelRowEdits = () => {
		setValidationErrors({});
	};

	const onProductClick = (event) => {
		const companyId = event.row.original.id;
		navigate('/articles', {
			state: {companyId}
		});
	};

	const columns = [
		{
			accessorKey: 'nit',
			header: 'NIT',
			size: 80
		},
		{
			accessorKey: 'name',
			header: 'Name',
			size: 140
		},
		{
			accessorKey: 'address',
			header: 'Address',
			size: 140
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
			size: 80
		}
	];

	const adminColumns = [
		{
			accessorKey: 'nit',
			header: 'NIT',
			size: 80
		},
		{
			accessorKey: 'name',
			header: 'Name',
			size: 140
		},
		{
			accessorKey: 'address',
			header: 'Address',
			size: 140
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
			size: 80
		},
		{
			accessorKey: 'articles',
			header: 'Inventory',
			enableEditing: false,
			visible: false,
			Cell: (event) => (
				<Tooltip arrow placement="left" title="View company's inventory">
					<IconButton onClick={() => onProductClick(event)}>
						<Visibility />
					</IconButton>
				</Tooltip>
			)
		}
	];

	return (
		<>
			<div className="row">
				<h3>Companies</h3>
			</div>
			{user?.groups != null && user.groups[0] === 'ADMIN' && (
				<div className="row">
					<div className="col-12 p-3" style={{textAlign: 'right'}}>
						<Button onClick={() => setCreateModalOpen(true)} variant="outlined" startIcon={<Add />}>
							New Company
						</Button>
					</div>
				</div>
			)}
			<div className="row justify-content-center">
				{checkUserAdmin(user) ? (
					<div className="col-12">
						<MaterialReactTable
							columns={adminColumns}
							data={companies}
							editingMode="modal"
							enableFilters={false}
							enableRowActions
							onEditingRowSave={handleUpdateRow}
							onEditingRowCancel={handleCancelRowEdits}
							positionActionsColumn="last"
							renderRowActions={({row, table}) => (
								<div className="row-actions">
									<Tooltip arrow placement="left" title="Edit">
										<IconButton onClick={() => table.setEditingRow(row)}>
											<Edit />
										</IconButton>
									</Tooltip>
									<Tooltip arrow placement="right" title="Delete">
										<IconButton onClick={() => handleDeleteRow(row)}>
											<Delete />
										</IconButton>
									</Tooltip>
								</div>
							)}
						/>
					</div>
				) : (
					<div className="col-12">
						<MaterialReactTable columns={columns} data={companies} enableFilters={false} />
					</div>
				)}
			</div>
			<CreateElement
				columns={columns.filter((column) => column.header !== 'Inventory')}
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onSubmit={handleCreateNewRow}
			/>
		</>
	);
};

export default Companies;
