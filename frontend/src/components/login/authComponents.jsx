import {View, useTheme, Image, Text, Button, useAuthenticator} from '@aws-amplify/ui-react';
import React from 'react';

import logo from '../../assets/logo.png';

const authComponents = {
	Header() {
		const {tokens} = useTheme();

		return (
			<View textAlign="center" padding={tokens.space.large}>
				<Image alt="logo" src={logo} />
			</View>
		);
	},

	Footer() {
		const {tokens} = useTheme();

		return (
			<View textAlign="center" padding={tokens.space.large}>
				<Text color={`${tokens.colors.neutral['80']}`}>&copy; Revstar App Demo</Text>
			</View>
		);
	},

	SignIn: {
		Footer() {
			const {toResetPassword} = useAuthenticator();

			return (
				<View textAlign="center">
					<Button fontWeight="normal" paddingBottom="1rem" onClick={toResetPassword} size="small" variation="link">
						Forgot password?
					</Button>
				</View>
			);
		}
	}
};
export default authComponents;
