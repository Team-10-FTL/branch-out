import {fetchReposWithFilters } from "../helpers/githubHelper";
import { parseRepoForGemini } from "../helpers/repoParseHelper";
import axios from 'axios';

// instead of having separate logic on the same edited file, use helpr functions in the helpers/ folder
// here we can modularize the logic and PRs

const repoFetcher = async () => {
    // get last pulled information
    const lastPulled = '2025-07-10'; // but pls replace this w an actual date
    const currentDate = new DataTransfer().toISOString().slice(0, 10);

    // fetch repos from github (call the github helper)
    const repos = await fetchReposWithFilters({ startDate: lastPulled, endDate: currentDate })

    for (const repo of repos){
        // parse repo metadata
        const parsedRepo = await parseRepoForGemini(repo); 

        // get Gemini enriched data so
        // do a call to the geminin helper function here with parsed Repo as the passed-in arguments

        // there will be another function that cleans the data from the gemini output?? maybe, can try to write that in the same file
        // then another function that pushes this data up to the database

        console.log(parsedRepo); // for now to log if its parsing correctly
    }

}

