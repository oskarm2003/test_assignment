export type t_task = {
    id: number,
    name: string,
    bookmarked: boolean
}

export default function getTasks(token: string, page_number: number, name_filter: string) {

    return new Promise(async (resolve, reject) => {

        const output: {
            bookmarked: Array<t_task>,
            unbookmarked: Array<t_task>,
            meta: any
        } = {
            bookmarked: [],
            unbookmarked: [],
            meta: {}
        }

        const options = {
            method: "GET",
            headers: {
                "Authorization": token
            }
        }

        let response = await fetch(`https://timtest.timenotes.io/api/v1/tasks?bookmarked=true&per_page=50&page=${page_number}&name=${name_filter}`, options)
        if (response.status === 200)
            output.bookmarked = (await response.json()).data
        else
            reject("fetch bookmarked tasks error")

        response = await fetch(`https://timtest.timenotes.io/api/v1/tasks?bookmarked=false&per_page=50&page=${page_number}&name=${name_filter}`, options)
        if (response.status === 200) {
            const data = await response.json()
            output.unbookmarked = data.data
            output.meta = data.meta
        }
        else
            reject("fetch unbookmarked tasks error")

        resolve(output)

    })


}