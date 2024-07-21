export default function createTask(token: string, name: string) {

    return new Promise((resolve, reject) => {

        const options = {
            method: "POST",
            body: JSON.stringify({
                name: name
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }

        console.log(options);


        fetch("https://timtest.timenotes.io/api/v1/tasks", options)
            .then(response => {
                console.log(response);

                if (response.status === 201)
                    resolve("created")
                else if (response.status === 401)
                    throw new Error("unauthorized")
                else if (response.status === 400)
                    throw new Error("invalid input")
            })
            .catch(error => reject(error))
    })

}