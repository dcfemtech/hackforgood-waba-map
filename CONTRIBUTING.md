# Contributing

Thanks for your interest in this project - we love bikes, maps, and JavaScript too!

## Community

We started this project at DCFemTech's 2016 Hack for Good hackathon and are continuing the work at [Code for DC](http://codefordc.org/).

## Workflow

* We communicate primarily over Slack and Github issues.
    * [Join the Code for DC Slack](http://codefordc.org/joinslack) team then join the [#waba-bike-map](https://codefordc.slack.com/messages/waba-bike-map/) channel to chat with us.
    * Use Slack for informal things - questions, drafts, file uploads, and more!
    * Create a Github issue or comment on an existing issue for more formal, codified knowledge that should be public.
* Don't push directly to the `master` branch.
* Instead, create your own feature branch then launch pull requests (PRs) against the `master` branch - @alulsh or someone else will do a code review before merging your pull request.
    * To create your own feature branch - `git checkout -b mybranchname`.
    * When you're ready to create a pull request, first push the branch (`git push origin mybranchname`) then visit the repo on GitHub.com and click the green "Compare & pull request" button.
* Try to tackle one GitHub issue per pull request - it's more difficult to merge a PR when half of the code looks great, but the other half is not ready or needs more work.
* When commenting on someone's PR, use line notes instead of pushing to their branch. It's ok to push more commits to their branch/PR if you have permission from them though!
* PRs from individual's forks of this repo are welcome, but if you are a contributor we will add you to this repo directly as a collabotor so that you can push your own branches. We find that people don't often update their forks, which makes for difficult merges. 
* Contact us on the Code for DC Slack to be added to the repo.

## Deployment

We host the project on GitHub Pages via the `gh-pages` branch - @alulsh or someone else will periodically deploy changes from `master` to `gh-pages` - we may make `gh-pages` the default branch eventually to remove this step.

## Code style

We are still working on establishing an official code style via a linter or editor file and automatically enforcing style on each commit, but here are some of our initial guidelines:

* Use spaces instead of tabs
* Use 4 spaces for each indent (not 2)
* Use traditional JavaScript `camelCase` for variable names
* Use single quotes instead of double quotes
* When in doubt, look at what we do in the rest of the project and copy that.