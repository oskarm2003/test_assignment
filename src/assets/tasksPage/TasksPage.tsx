import { Button } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import './style.css'
import '../common.css'

import { UserTokenContext } from '../App'
import TasksAutocomplete from './TasksAutocomplete'

export default function TasksPage() {

    const navigate = useNavigate()
    const { state } = useLocation()

    // state is null when page was accessed without prior login (by url)
    if (state === null)
        // displaying "resources out of reach" screen
        return <div className="wrapper tasks-wrapper">
            <h1>Task Browser</h1>
            <p>You have to be logged in to use this resource.</p>
            <br />
            <Button type='primary' onClick={() => navigate("/")}>Log in</Button>
        </div>

    //otherwise
    const { token } = state

    return <div className="wrapper tasks-wrapper">
        <h1>Task Browser</h1>

        <UserTokenContext.Provider value={token}>
            <TasksAutocomplete />
        </UserTokenContext.Provider>

        <br /><br />

        <Button type='primary' danger onClick={() => navigate("/")}>log out</Button>
    </div>

}