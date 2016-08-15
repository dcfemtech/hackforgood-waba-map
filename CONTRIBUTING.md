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
* Avoid working off of personal forks for PRs and instead work off of feature branches on this repo. If you don't have push access, contact @alulsh via email or the Code for DC Slack.
* Try to tackle one GitHub issue per pull request - it's more difficult to merge a PR when half of the code looks great, but the other half is not ready or needs more work.
* Additionally, try to keep pull requests small. It's easier to merge a small pull request than a large one.
* When commenting on someone's PR, use line notes instead of pushing to their branch. It's ok to push more commits to their branch/PR if you have permission from them though!
* PRs from individual's forks of this repo are welcome, but if you are a contributor we will add you to this repo directly as a collabotor so that you can push your own branches. We find that people don't often update their forks, which makes for difficult merges. 
* Contact us on the Code for DC Slack to be added to the repo.

## Deployment

We host the project on GitHub Pages via the `gh-pages` branch - @alulsh or someone else will periodically deploy changes from `master` to `gh-pages` - we may make `gh-pages` the default branch eventually to remove this step.

## Code style

We use [eslint](http://eslint.org/) to automatically lint our code. The codestyle can be found in the `.eslintrc` eslint configuration file.