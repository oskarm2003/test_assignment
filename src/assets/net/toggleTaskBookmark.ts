export default function toggleTaskBookmark(token: string, task_id: number, bookmarked: boolean) {

    return new Promise((resolve, reject) => {

        const options = {
            method: "POST",
            body: JSON.stringify({
                id: task_id
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }

        const url = `https://timtest.timenotes.io/api/v1/tasks/${task_id}/`
            + (bookmarked ? "unbookmark" : "bookmark")

        fetch(url, options)
            .then(response => {
                if (response.status === 200)
                    resolve("Success")
                else if (response.status === 404)
                    throw new Error("Task not found")
                else if (response.status === 401)
                    throw new Error("Unauthorized")
            })
            .catch(error => reject(error))

    })
}