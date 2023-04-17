import React, {useCallback, useState, useEffect} from 'react';
import MaterialReactTable from 'material-react-table';
import {Button, IconButton, Tooltip} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import {Delete, Edit, Download, Add, ArrowBack} from '@mui/icons-material';
import CreateElement from '../components/ui/CreateElement';
import {getArticlesByCompanyId, insertArticle, updateArticle, deleteArticle} from '../api/articles';
import {getCompany} from '../api/companies';
import {downloadPDF} from '../api/pdf';
import EmailModal from '../components/ui/EmailModal';
import './Articles.css';

const Articles = () => {
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [articles, setArticles] = useState([]);
	const [company, setCompany] = useState({});

	const [validationErrors, setValidationErrors] = useState({});
	const navigate = useNavigate();

	const location = useLocation();
	const companyId = location.state?.companyId ?? '';

	useEffect(() => {
		const fetchData = async () => {
			const companies = await getArticlesByCompanyId(companyId);
			setArticles(companies);

			const company = await getCompany(companyId);
			setCompany(company);
		};
		fetchData();
	}, []);

	const handleDownloadPDF = async (companyId) => {
		await downloadPDF(companyId);
	};

	const handleCreateNewRow = async (values) => {
		const newArticle = {...values, companyId};
		const article = await insertArticle(newArticle);
		articles.push(article);
		setArticles([...articles]);
	};

	const handleUpdateRow = async ({exitEditingMode, row, values}) => {
		if (!Object.keys(validationErrors).length) {
			const itemId = articles[row.index].id;

			const updatedItem = {
				...articles[row.index],
				code: values.code,
				name: values.name,
				amount: values.amount
			};

			await updateArticle(itemId, updatedItem);

			articles[row.index] = updatedItem;

			setArticles([...articles]);
			exitEditingMode(); // required to exit editing mode and close modal
		}
	};

	const handleDeleteRow = useCallback(
		async (row) => {
			if (!confirm(`Are you sure you want to delete the article ${row.getValue('name')}`)) {
				return;
			}
			const itemId = row.original.id;
			await deleteArticle(itemId);
			const companies = await getArticlesByCompanyId(companyId);
			setArticles(companies);
		},
		[articles]
	);

	const handleCancelRowEdits = () => {
		setValidationErrors({});
	};

	const columns = [
			{
				accessorKey: 'code',
				header: 'Code',
				size: 80
			},
			{
				accessorKey: 'name',
				header: 'Name',
				size: 140
			},
			{
				accessorKey: 'amount',
				header: 'Amount',
				size: 140
			}
		];

	return (
		<>
			<div className="row">
				<div className="col-6 p-3" style={{textAlign: 'left'}}>
					<h3>Inventory of company: {company?.name?.toUpperCase() ?? ''}</h3>
				</div>
				<div className="col-6 p-3" style={{textAlign: 'left'}}>
					<Button variant="outlined" onClick={() => navigate('/companies')} startIcon={<ArrowBack />}>
						Return to companies
					</Button>
				</div>
			</div>
			<div className="row">
				<div className="col-6 p-3 text-left">
					<span>Report: </span>
					<Button onClick={() => handleDownloadPDF(companyId)} variant="outlined" startIcon={<Download />}>
						Download
					</Button>
					<EmailModal companyId={companyId} />
				</div>
				<div className="col-6 p-3" style={{textAlign: 'right'}}>
					<Button onClick={() => setCreateModalOpen(true)} variant="outlined" startIcon={<Add />}>
						New Article
					</Button>
				</div>
			</div>
			<div className="row justify-content-center">
				<div className="col-12">
					<MaterialReactTable
						columns={columns}
						data={articles}
						editingMode="modal"
						enableRowActions
						enableFilters={false}
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
			</div>
			<CreateElement
				columns={columns}
				open={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onSubmit={handleCreateNewRow}
			/>
		</>
	);
};

export default Articles;
