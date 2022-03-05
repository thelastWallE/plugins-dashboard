# thelastWallE OctoPrint Plugins Dashboard

This is the source for  https://thelastWallE.github.io/plugins-dashboard .

It uses NodeJS, React, Material-UI, Recharts and Gatsby. The site is built from the gh-pages branch and copied to the main branch where it is served using github pages.


## Setup Your Own Dashboard

You can use this to track your own plugins!

1. Fork https://github.com/The-EG/plugins-dashboard repo
3. In branch `the-eg`, replace the contents of each .json file in data/ with an empty object (`{}`)
4. Update plugins-dashboard-config.json
5. Setup a personal access token:
    1. Go to your user settings
    2. Go to 'developer' settings
    3. Go to 'personal access tokens'
    4. Click generate new token, give it a name, etc. Give it 'public_repo' access.
    5. Copy the new token
6. Add the token as a repo secret
    1. Go to the newly forked repo settings
    2. Go to 'Secrets'
    3. 'New Repository Secret' named `REPO_TOKEN` and paste the token you copied above
6. (Optional) rename the `the-eg` branch to your own liking. 
    1. Update the reference to the above branch in .github/workflows/*.yml (in branch `gh-pages`)
7. Enable GH Pages on the `main` branch
    1. Go to repo settings
    2. Goto 'Pages'
    3. Select the `main` branch and `/ (root)`
    4. Click save
8. Manually trigger the 'Update data/*.json' workflow

After that, it should update once a day and automatically deploy.

If I make updates that you'd like to incorporate to your fork later:

1. Clone your fork locally
2. Setup this repo as upstream: `git remote add upstream https://github.com/The-EG/plugins-dashboard.git`
3. While on your `gh-pages` branch, pull my `gh-pages` branch: `git pull upstream gh-pages`
4. Push the changes back up to yours: `git push`
5. Switch to your data branch, ie `the-eg`, and merge in gh-pages: `git merge gh-pages`
6. Push those changes up too: `git push`
