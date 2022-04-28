import { Component } from 'react'
// import axios from 'axios'

class SignupPage extends Component {
	state = {
		username: '',
		email: '',
		password: '',
		passwordConfirm: '',
	}

	onChange = event => {
		const { id, value } = event.target
		this.setState({ [id]: value })
	}

	submit = event => {
		event.preventDefault()
		const { username, email, password } = this.state
		const body = { username, email, password }

		/* axios.post('/api/1.0/users', body) */
		fetch('/api/1.0/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
	}

	render() {
		let disabled = true
		const { password, passwordConfirm } = this.state

		if (password && passwordConfirm) {
			disabled = password !== passwordConfirm
		}

		return (
			<div className='col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
				<form className='card mt-5'>
					<div className='card-header'>
						<h1 className='text-center my-3'>Sign Up</h1>
					</div>
					<div className='card-body'>
						<div className='mb-3'>
							<label className='form-label' htmlFor='username'>
								Username
							</label>
							<input
								className='form-control'
								id='username'
								onChange={this.onChange}
							/>
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='email'>
								Email
							</label>
							<input
								className='form-control'
								id='email'
								onChange={this.onChange}
							/>
						</div>

						<div className='mb-3'>
							<label className='form-label' htmlFor='password'>
								Password
							</label>
							<input
								className='form-control'
								id='password'
								type='password'
								onChange={this.onChange}
							/>
						</div>

						<div className='mb-4'>
							<label className='form-label' htmlFor='passwordConfirm'>
								Confirm Password
							</label>
							<input
								className='form-control'
								id='passwordConfirm'
								type='password'
								onChange={this.onChange}
							/>
						</div>

						<div className='text-center'>
							<button
								className='btn btn-primary'
								disabled={disabled}
								onClick={this.submit}
								type='submit'>
								Sign Up
							</button>
						</div>
					</div>
				</form>
			</div>
		)
	}
}

export default SignupPage