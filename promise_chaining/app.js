function getUser(userId) {
    return new Promise((resolve) => {
        // simulate db call
        setTimeout(() => resolve({ id: userId, name: "John" }), 1500)
    })
}

function getUserPosts(user) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(['Post 1', 'Post 2', 'Post 3']), 1500)
    })
}

getUser(123)
    .then(user => {
        console.log("User: ", user)
        return getUserPosts(user.id)
    })
    .then(posts => {
        console.log("Posts: ", posts)
    })
    .catch(error => console.error("Error: ", error.message))
    .finally(() => console.log("Completed"))