import axios from 'axios';

export const backentApi = axios.create({
	baseURL: 'https://959rry4rg8.execute-api.us-east-1.amazonaws.com/dev'
	// baseURL: 'http://localhost:3000/dev'
});
