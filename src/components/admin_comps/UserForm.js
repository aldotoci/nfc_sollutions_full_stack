import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function UserCreateForm() {
    const router = useRouter()
    const [user, setUser] = useState({
        username: '',
        password: '',
        role: 'hostess'
    })

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/register/users_hostess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const data = await res.json()
            if (data.error) {
                alert(data.error)
            } else {
                router.push('/admin/users')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container">
            <h1>Create User</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" value={user.username} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="text" className="form-control" id="password" name="password" value={user.password} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select className="form-control" id="role" name="role" value={user.role} onChange={handleChange}>
                        <option value="hostess">Hostess</option>
                        <option value="manager">Manager</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    )
}

