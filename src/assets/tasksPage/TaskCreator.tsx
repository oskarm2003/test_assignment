import { Button, Input } from "antd";
import { useQuery, useQueryClient } from "react-query";
import createTask from "../net/createTask";
import { useContext, useEffect, useState } from "react";
import { UserTokenContext } from "../App";

export default function TaskCreator({ hide }: { hide: () => void }) {

    const token = useContext(UserTokenContext)
    const [taskname, setTaskname] = useState<string>("")

    // init queries
    const { data, refetch } = useQuery(
        "createTask",
        () => createTask(token, taskname),
        { enabled: false }
    )
    const queryClient = useQueryClient()

    // on query response
    useEffect(() => {

        if (data != "created") return

        hide()
        setTaskname("")
        queryClient.resetQueries("createTask")

    }, [data])

    const submit = () => {
        refetch()
    }

    return <fieldset className="task-creator-wrapper">

        <legend>Create task</legend>

        <Input
            placeholder="taskname"
            onChange={e => setTaskname(e.target.value)}
            onPressEnter={submit}
        />
        <br /><br />

        <Button type="primary" onClick={submit}>create</Button>

    </fieldset>

}