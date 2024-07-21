import unbookmarked_img from "../icons/unbookmarked.svg"
import bookmarked_img from "../icons/bookmarked.svg"
import { useQuery, useQueryClient } from "react-query"
import toggleTaskBookmark from "../net/toggleTaskBookmark"
import { UserTokenContext } from "../App"
import { useContext, useEffect } from "react"

export default function Task({ task_name, task_id, bookmarked, onToggle }:
    { task_name: string, task_id: number, bookmarked: boolean, onToggle?: () => void }) {

    const token = useContext(UserTokenContext)

    const queryClient = useQueryClient()
    const { data, refetch } = useQuery("ToggleBookmark" + task_id, () => toggleTaskBookmark(token, task_id, bookmarked), { enabled: false })

    useEffect(() => {
        if (data != "Success") return
        queryClient.resetQueries("ToggleBookmark" + task_id)
        onToggle && onToggle()
    }, [data])

    const toggle_bookmark = () => refetch()

    return <div className="task">
        <p>{task_name}</p>
        <img
            className="bookmark"
            onClick={toggle_bookmark}
            src={bookmarked ? bookmarked_img : unbookmarked_img}
            alt={bookmarked ? "bookmarked" : "unbookmarked"}
        />
    </div>

}