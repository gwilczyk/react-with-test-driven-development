import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { setupServer } from 'msw/node'
import { rest } from 'msw'

import App from './App'

const server = setupServer(
	rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
		return res(ctx.status(200))
	}),

	rest.get('/api/1.0/users', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json({
				content: [
					{
						id: 1,
						username: 'user-in-list',
						email: 'user-in-list@mail.com',
						image: null,
					},
				],
				page: 0,
				size: 0,
				totalPages: 0,
			})
		)
	}),

	rest.get('/api/1.0/users/:id', (req, res, ctx) => {
		const id = Number.parseInt(req.params.id)
		return res(
			ctx.json({
				id,
				username: `user${id}`,
				email: `user${id}@mail.com`,
				image: null,
			})
		)
	})
)

beforeEach(() => server.resetHandlers())
beforeAll(() => server.listen())
afterAll(() => server.close())

describe('Routing', () => {
	const setup = path => {
		window.history.pushState({}, '', path)
		render(<App />)
	}

	it.each`
		path               | pageTestId
		${'/'}             | ${'home-page'}
		${'/signup'}       | ${'signup-page'}
		${'/login'}        | ${'login-page'}
		${'/user/1'}       | ${'user-page'}
		${'/user/2'}       | ${'user-page'}
		${'/activate/123'} | ${'activation-page'}
		${'/activate/456'} | ${'activation-page'}
	`('displays $pageTestId when path is $path', ({ path, pageTestId }) => {
		setup(path)
		const page = screen.queryByTestId(pageTestId)
		expect(page).toBeInTheDocument()
	})

	it.each`
		path               | pageTestId
		${'/'}             | ${'activation-page'}
		${'/'}             | ${'login-page'}
		${'/'}             | ${'signup-page'}
		${'/'}             | ${'user-page'}
		${'/activate/123'} | ${'home-page'}
		${'/activate/123'} | ${'login-page'}
		${'/activate/123'} | ${'signup-page'}
		${'/activate/123'} | ${'user-page'}
		${'/login'}        | ${'activation-page'}
		${'/login'}        | ${'home-page'}
		${'/login'}        | ${'signup-page'}
		${'/login'}        | ${'user-page'}
		${'/signup'}       | ${'activation-page'}
		${'/signup'}       | ${'home-page'}
		${'/signup'}       | ${'login-page'}
		${'/signup'}       | ${'user-page'}
		${'/user/1'}       | ${'activation-page'}
		${'/user/1'}       | ${'home-page'}
		${'/user/1'}       | ${'login-page'}
		${'/user/1'}       | ${'signup-page'}
	`(
		'does not display $pageTestId when path is $path',
		({ path, pageTestId }) => {
			setup(path)
			const page = screen.queryByTestId(pageTestId)
			expect(page).not.toBeInTheDocument()
		}
	)

	it.each`
		targetPage
		${'Home'}
		${'Sign Up'}
		${'Login'}
	`('has link to $targetPage on NavBar', ({ targetPage }) => {
		setup('/')
		const link = screen.getByRole('link', { name: targetPage })
		expect(link).toBeInTheDocument()
	})

	it.each`
		initialPath  | clickingTo   | visiblePage
		${'/'}       | ${'Sign Up'} | ${'signup-page'}
		${'/signup'} | ${'Home'}    | ${'home-page'}
		${'/'}       | ${'Login'}   | ${'login-page'}
	`(
		'displays $visiblePage after clicking $clickingTo link',
		({ initialPath, clickingTo, visiblePage }) => {
			setup(initialPath)
			const link = screen.getByRole('link', { name: clickingTo })
			userEvent.click(link)
			expect(screen.getByTestId(visiblePage)).toBeInTheDocument()
		}
	)

	it('displays homepage when clicking brand logo', () => {
		setup('/login')
		const logo = screen.queryByAltText('Hoaxify')
		userEvent.click(logo)
		expect(screen.getByTestId('home-page')).toBeInTheDocument()
	})

	it('navigates to user page when clicking the username on user list', async () => {
		setup('/')
		const user = await screen.findByText('user-in-list')
		userEvent.click(user)
		const page = await screen.findByTestId('user-page')
		expect(page).toBeInTheDocument()
	})
})

console.error = () => {}
