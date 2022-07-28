
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username) {
    let url = `https://api.github.com/users/${username}`
    const data = await fetch(url);
    const user = await data.json();
    createUserCard(user, username)
}

async function getRepos(username) {
    try {
        let url = `https://api.github.com/users/${username}/repos?sort=created`;
        const response = await fetch(url);
        const repos = await response.json();
        addReposToCard(repos)
    } catch (err) {
        createErrorCard('Problem fetching repos')
    }
}

function createUserCard(user, username) {
    if (user.id === undefined) {
        createErrorCard('No user with this username')
    } else {
        const userID = user.name || user.login
        const userBio = user.bio ? `<p>${user.bio}</p>` : ''
        const cardHTML = `
                            <div class="card">
                                <div>
                                    <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
                                </div>
                                <div class="user-info">
                                    <h2>${userID}</h2>
                                        ${userBio}
                                    <ul>
                                        <li>${user.followers} <strong>Followers</strong></li>
                                        <li>${user.following} <strong>Following</strong></li>
                                        <li>${user.public_repos} <strong>Repos</strong></li>
                                    </ul>

                                    <div id="repos"></div>
                                </div>
                            </div>`
        main.innerHTML = cardHTML
        getRepos(username);
    }
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');
    if (repos.length === 0) {
        const repoEl = document.createElement('p');
        repoEl.classList.add('repo');
        repoEl.innerText = "The user have No repository!";
        reposEl.appendChild(repoEl);
    } else {
        repos
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })   
    }
}


form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if (user) {
        getUser(user)

        search.value = ''
    }
})
