import axios from 'axios';


// instead of having separate logic on the same edited file, use helpr functions in the helpers/ folder
// here we can modularize the logic and PRs

// example from docs to call all information in a repo
const getRepo = async () => {
    const res = await githubApi.get('/repos/facebook/react');
    console.log(res.data);
};

// example from docs on how to pull only certain repos from the api
// https://api.github.com/search/repositories?q=stars:>1000&sort=stars

// example endpoint from docs on how to pull open issues from a repo
// https://api.github.com/repos/facebook/react/issues




// Prisma DB inserts
