<p align="center">
  <img src="public/kf_releasecoordinator.png" alt="Release Coordinator">
</p>

Kids First Release Coordinator
==============================

## Development

Modify copy `.env.template` to `.env.local` and modify the variables
accordingly. It is suggested to use [kf-data-stack](https://github.com/kids-first/kf-data-stack)
to get up and running quickly. `.env.template` is already populated with
the default ports from `kf-data-stack`. All that is to be added is 
`REACT_APP_GOOGLE_APP_ID`. Make sure the Google app id matches that for ego
so that users may authenticate correctly.

Once the dependent services are running, install and start:
```
yarn
yarn start
```
