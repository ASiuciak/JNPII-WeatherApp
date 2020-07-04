/* Function returning URL to GIF connected with given term.
   Parameter 'num' informs, which GIF from the list should we choose. */

const getGIF = (term, num) => {
    let req = 'https://api.tenor.com/v1/search?q=' +
    term + '&key=LIVDSRZULELA&limit=5';
    return new Promise((resolve, reject) => {
        fetch(req).then((response) => {
            response.json().then((data) => {
                let url = data["results"][num]["media"][0]["tinygif"]["url"];
                if (!url) {
                    reject(new Error("No GIF"))
                } else {
                    resolve(url);
                }
            }).catch((err) => {
                reject(new Error(err));
            })
        })
    })
}

export { getGIF }