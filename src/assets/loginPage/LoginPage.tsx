import { Input, Button, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import '../common.css'
import './style.css'
import loginUser from '../net/loginUser'

export default function LoginPage() {

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const navigate = useNavigate()

    // init useQuery
    const queryClient = useQueryClient()
    const { isFetching, data, refetch, isError, error } = useQuery({
        queryKey: "loginUser",
        enabled: false,
        retry: false,
        queryFn: () => loginUser(email, password)
    })

    // on login api response
    useEffect(() => {

        if (data === undefined || data === null) return
        navigate("/tasks", { state: { token: data } })
        queryClient.resetQueries("loginUser")

    }, [data])

    const login = () => refetch()

    return <div className="wrapper login-wrapper">

        <h1>Log in to proceed</h1>

        <Input
            placeholder='email'
            onChange={e => setEmail(e.target.value)}
            onPressEnter={login}
        />
        <br /><br />

        <Input.Password
            placeholder='password'
            onChange={e => setPassword(e.target.value)}
            onPressEnter={login}
        />
        <br /><br />

        <Button type='primary' onClick={login}>login</Button>
        {isFetching && <span className="loading"><Spin /></span>}
        {isError && <span className='error-message'>{"" + error}</span>}

    </div>

}