// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import Button from '../components/common/ButtonComponent'

// describe('Button', () => {
//   it('renders with default text', () => {
//     render(<Button>Click Me</Button>)
//     expect(screen.getByText('Click Me')).toBeInTheDocument()
//   })

//   it('shows loading state', () => {
//     render(<Button isLoading loadingText="Loading...">Click Me</Button>)
//     expect(screen.getByText('Loading...')).toBeInTheDocument()
//     expect(screen.getByRole('button')).toBeDisabled()
//   })

//   it('calls onClick when clicked', async () => {
//     const handleClick = vi.fn()
//     const user = userEvent.setup()
//     render(<Button onClick={handleClick}>Click Me</Button>)
//     await user.click(screen.getByRole('button'))
//     expect(handleClick).toHaveBeenCalledTimes(1)
//   })
// })

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Button from '../components/common/ButtonComponent'

describe('Button component', () => {
  it('renders with default text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('shows loading state with loading text and disables the button', () => {
    render(<Button isLoading loadingText="Loading...">Click Me</Button>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
