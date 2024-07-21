import TaskCreator from './TaskCreator'
import Task from './Task'
import AddIcon from "../icons/add.svg"
import SearchIcon from "../icons/search.svg"

import { useContext, useEffect, useRef, useState } from "react";
import { Input, Pagination } from 'antd'
import getTasks, { t_task } from '../net/getTasks';
import { useQuery } from 'react-query';
import { UserTokenContext } from '../App';

export default function TasksAutocomplete() {

    const [displayCreateScreen, setDisplayCreateScreen] = useState<boolean>(false)
    const [tasks, setTasks] = useState<undefined | { bookmarked: Array<t_task>, unbookmarked: Array<t_task> }>(undefined)
    const [searched, setSearched] = useState<string>("")
    const [current_page, setCurrentPage] = useState<number>(1)
    const [total_pages, setTotalPages] = useState<number>(1)

    const token = useContext(UserTokenContext)
    const { data, refetch: refetchTasks } = useQuery("fetchTasks", () => getTasks(token, current_page, searched))

    // run when new data fetched
    useEffect(() => {

        if (data === undefined) return
        setTotalPages((data as { meta: { total_pages: number } }).meta.total_pages)
        setTasks({
            bookmarked: (data as { bookmarked: Array<t_task> }).bookmarked,
            unbookmarked: (data as { unbookmarked: Array<t_task> }).unbookmarked as Array<t_task>
        })

    }, [data])

    useEffect(() => {
        refetchTasks()
    }, [current_page, searched])

    const refetchTimeout = useRef(0)

    const onToggleTaskBookmark = (task_id: number, bookmarked: boolean) => {

        // update refetch timeout to prevent multiple fetching the same data
        // this also prevents unpleasant tasks "jumping" on the ui
        clearTimeout(refetchTimeout.current)
        refetchTimeout.current = setTimeout(() => refetchTasks, 1000)

        // optimistic bookmarking (change ui before fetch finishes pending)
        if (tasks === undefined) return
        const task_index = (bookmarked ? tasks.bookmarked : tasks.unbookmarked)
            .findIndex(({ id }) => id === task_id)

        const tmp_tasks = {
            bookmarked: tasks.bookmarked,
            unbookmarked: tasks.unbookmarked
        }

        if (bookmarked)
            tmp_tasks.unbookmarked.push(
                tmp_tasks.bookmarked.splice(task_index, 1)[0])
        else
            tmp_tasks.bookmarked.push(
                tmp_tasks.unbookmarked.splice(task_index, 1)[0])

        setTasks(tmp_tasks)
    }

    return <>

        <Input
            suffix={<img src={SearchIcon} />}
            size='large'
            placeholder='search for a task'
            onChange={e => setSearched(e.target.value)}
        />

        <div className="tasks-autocomplete">

            <div className="bookmarked">
                <p>bookmarked</p>
                {tasks &&
                    (tasks.bookmarked.filter(({ name }) => name.startsWith(searched)))
                        .sort((a, b) => a.id - b.id) //sort to ensure the same data order when displaying optimistic and displaying actual data
                        .map(({ name, id }, i) => {
                            return <Task key={i} task_name={name} task_id={id} bookmarked={true} onToggle={() => onToggleTaskBookmark(id, true)} />
                        })}
            </div>
            <hr />

            <div className="unbookmarked">
                <p>unbookmarked</p>
                {tasks &&
                    (tasks.unbookmarked.filter(({ name }) => name.startsWith(searched)))
                        .sort((a, b) => a.id - b.id) //sort to ensure the same data order when displaying optimistic and displaying actual data
                        .map(({ name, id }, i) => {
                            return <Task key={i} task_name={name} task_id={id} bookmarked={false} onToggle={() => onToggleTaskBookmark(id, false)} />
                        })}
            </div>
            <hr />

            <div className="create-task">
                <p>create new</p>
                <div className="task" onClick={() => setDisplayCreateScreen(!displayCreateScreen)}>
                    <p>create a new task</p>
                    <img src={AddIcon} alt="add" />
                </div>
            </div>

        </div>

        {/* pagination only appears when there is more than one page */}
        <div className='pagination'>
            {total_pages > 1 && <Pagination onChange={page => setCurrentPage(page)} simple={{ readOnly: true }} total={10 * total_pages} />}
        </div>

        {/* "create task" screen */}
        {displayCreateScreen && <><br /><TaskCreator hide={() => { setDisplayCreateScreen(false); refetchTasks() }} /></>}
    </>


}