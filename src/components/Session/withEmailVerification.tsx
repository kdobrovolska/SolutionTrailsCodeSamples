import React from 'react';
import '../components.css'
import AuthUserContext from './context';
import { CorrectAccountLink } from '../Account/SignUp';
import { getName } from '../../Common/methods';
import Firebase from '../Firebase/firebase';

interface WithEmailVerificationProps {

}

interface WithEmailVerificationState {
	isSent: boolean;
	isDeleted?: boolean;
	isConfirm?: boolean;
}

const withEmailVerification = (Component: typeof React.Component) => {
	class WithEmailVerification extends React.Component<WithEmailVerificationProps, WithEmailVerificationState> {


		constructor(props: WithEmailVerificationProps) {
			super(props);
			this.state = {
				isSent: false,
			};
		}
		private firebase: Firebase = Firebase.getFirebase();


		onSendEmailVerification = () => {
			const promise = this.firebase.doSendEmailVerification();
			if (promise) {
				promise
					.then(() => {
						this.setState({ isSent: true })
					})
					.catch(() => {
						this.setState({ isDeleted: true });
					});
			}
			    
		}

	
		onContinue = (needDelete: boolean) => {
			if(needDelete)
				this.firebase.doDeleteAuthUser();
			this.setState({ isConfirm: true });
		};

		render() {
			return (<div>
				{
					<AuthUserContext.Consumer>
						{
							authUser => {
								return (needsEmailVerification(authUser) ? (
									<EmailVerificationForm isSend={this.state.isSent} onSendEmailVerification={this.onSendEmailVerification} onContinue={this.onContinue} />
								) : (
										<Component {...this.props} />
									)
								);
							}
						}
					</AuthUserContext.Consumer >
				}
			</div>);
		}
	}
	return WithEmailVerification;
};

interface EmailVerificationFormProps {
	onSendEmailVerification: () => void;
	isSend: boolean;
	onContinue: (par: boolean) => any;
}

const EmailVerificationForm = (props: EmailVerificationFormProps) => {
	const { onSendEmailVerification, isSend } = props;
	return (
		<div className="container">
			<div className="form">
				<div className="title">{getName("EmailVerification")}</div>
			<div className="cont1">
				{isSend ? (
						<span className="item_log_in_label">
							{getName("EmailConfirmationSent")}
						</span>
				) : (
						<span className="item_log_in_label">
							{getName("VerifyYourEmail")}
						</span>
					)}
					<button
						className={isSend ? "but dis" : "but"}
						type="button"
						onClick={() => onSendEmailVerification()}
					    disabled={isSend}
					>
						{getName("SendConfirmationEmail")}
					</button>
					{isSend && <CorrectAccountLink/>}
			</div>
		</div>
	</div>);
};



const needsEmailVerification = (authUser: any) =>
	authUser &&
	!authUser.emailVerified &&
	authUser.providerData
		.map((provider: any) => provider.providerId)
		.includes('password');

export default withEmailVerification;