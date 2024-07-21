export default function loginUser(email: string, password: string) {

    return new Promise((resolve, reject) => {

        if (email == "" || password == "")
            reject("empty input field")

        const data = JSON.stringify({
            email: email,
            password: password
        })

        const options = {
            method: "POST",
            body: data,
            headers: {
                "Content-Type": "application/json"
            }
        }

        fetch("https://timtest.timenotes.io/api/v1/login", options)
            .then(response => {
                if (response.status == 401)
                    throw new Error("wrong credentilas")
                return response.json()
            })
            .then(data => resolve(data.accessToken))
            .catch(err => reject(err))
    })

}