# Kids First Release Coordinator UI Release 1.8.1

## Features

Hotfix for devops scripts.

### Summary

Feature Emojis: 👷♂️x1
Feature Labels: [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x1

### New features and changes

- (#183) 👷♂️ Add agent label - @dankolbman


# Kids First Release Coordinator UI Release 1.8.0

## Features

Add release notes view and fix release description editor.

### Summary

Feature Emojis: ✨x3 🐛x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x2 [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x1 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x1

### New features and changes

- (#181) ✨ Add release notes page listing out all published releases' notes - @XuTheBunny
- (#180) ✨ Add release notes component to release page - @XuTheBunny
- (#179) ✨ Use GraphQL mutation to update release description markdown - @XuTheBunny
- (#175) 🐛 Reload new profile sign-ins - @dankolbman


# Kids First Release Coordinator UI Release 1.7.0

## Features

Refactor to use the GraphQL api.

### Summary

Feature Emojis: 🐛x5 💄x4 ✨x3 ⬆️x1 ♻️x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x6 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x5 [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x4

### New features and changes

- (#173) ✨ Add api status to header - @dankolbman
- (#172) 🐛 Fix queries - @dankolbman
- (#170) 🐛 List studies by name when confirming release - @dankolbman
- (#171) ⬆️ Upgrade dependencies - @dankolbman
- (#169) 💄 Restyle event logs - @dankolbman
- (#168) ✨ Add git version and hash to header - @dankolbman
- (#166) 🐛 Filter task list by release - @dankolbman
- (#167) 🐛 Correct missing values - @dankolbman
- (#165) ✨ Add myProfile query - @dankolbman
- (#163) 💄 Page icons - @dankolbman
- (#164) 🐛 Study sync - @dankolbman
- (#162) 💄 Remove use of cards as layout elements - @dankolbman
- (#161) 💄 Release view refactor - @dankolbman
- (#160) ♻️ Replace REST api with GraphQL api - @dankolbman


# Kids First Release Coordinator UI Release 1.6.0

## Features

Update tables to use native semantic components and add missing forms
for services.

### Summary

Feature Emojis: ⬆️x5 💄x1 🐛x1 ♻️x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x2 [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x2 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x2

### New features and changes

- (#156) 💄 Restyle service forms - @dankolbman
- (#153) ⬆️ Bump handlebars from 4.1.1 to 4.1.2 - @dependabot[bot]
- (#154) ⬆️ Bump mixin-deep from 1.3.1 to 1.3.2 - @dependabot[bot]
- (#155) 🐛 Don't show cards if there are no releases - @dankolbman
- (#152) ♻️ Semantic tables - @dankolbman
- (#148) ⬆️ Bump lodash.template from 4.4.0 to 4.5.0 - @dependabot[bot]
- (#147) ⬆️ Bump lodash-es from 4.17.11 to 4.17.14 - @dependabot[bot]
- (#146) ⬆️ Bump axios from 0.18.0 to 0.18.1 - @dependabot[bot]


# Kids First Release Coordinator UI Release 1.5.0

## Features

Change to Semantic UI framework

### Summary

Feature Emojis: 💄x3 ✨x2 ♻️x1 👷 x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x5 [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x2 [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x1

### New features and changes

- (#144) ♻️  Simplify labels - @dankolbman
- (#143) 💄 Properly use icon buttons - @dankolbman
- (#142) 💄 Style login consistently with data tracker - @dankolbman
- (#141) 💄 Style header consistently with data tracker - @dankolbman
- (#138) 👷 Add bundlesize CI check - @dankolbman
- (#140) ✨ Add re-run release button - @dankolbman
- (#139) ✨ Semantic ui - @dankolbman


# Kids First Release Coordinator Release 1.4.0

## Features

Integrates Auth0 and removes the ant design system entirely.

### Summary

Feature Emojis: 🐛x3 🚨x3 🔧x2 ♻️x2 🔥x1 ⬆️x1 ✨x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x6 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x4 [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x1 [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x1

### New features and changes

- (#134) 🔥 Remove ant - @dankolbman
- (#133) 🐛 Fix new service form - @dankolbman
- (#132) 🐛 Fixes react-table selection - @dankolbman
- (#131) 🚨 Update to new prettier standard - @dankolbman
- (#130) 🐛 Add protocol to redirect url - @dankolbman
- (#129) ⬆️ Upgrade yarn deps - @dankolbman
- (#128) 🔧 Add build vars for master - @dankolbman
- (#124) ♻️ Refactor docker setting by adding arg Auth0 Redirect URI - @XuTheBunny
- (#123) 🔧 Add netlify.toml configuration - @dankolbman
- (#122) ♻️ Refactor Auth0 callback function to provide user profile data - @XuTheBunny
- (#121) 🚨 Add prettier configuration - @dankolbman
- (#120) ✨ Add auth0 - @XuTheBunny
- (#116) 🚨 Apply prettier formatting - @dankolbman

# Kids First Release Coordinator Release 1.3.1

## Features

### Summary

Feature Emojis: ✨x2 🐛x1 🖼x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x2 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x1 [documentation](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/documentation) x1

### New features and changes

- (#114) ✨ Add button to download snapshot - @dankolbman
- (#112) ✨ Add colum filters to releases table - @dankolbman
- (#111) 🐛 Restore sort by SemVer to tables - @dankolbman
- (#108) 🖼 Update logo - @dankolbman

# Kids First Release Coordinator UI Release 1.3.0

## Features

### Summary

Feature Emojis: ✨x3 🐛x3 🎨x2 🔥x1 ✨Statex1 ♻️x1 ✨Addx1 🔧x1 👷x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x5 [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x4 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x4 [design](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/design) x3 [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x1

### New features and changes

- (#105) ✨ Add syncronize button to sync coordinator with dataservice studies - @dankolbman
- (#104) 🐛 Move postcss deps from dev to packages deps - @dankolbman
- (#103) 🐛 Update release reports endpoint - @dankolbman
- (#102) 🐛 Fix release form - @dankolbman
- (#101) 🔥 Remove context api - @dankolbman
- (#100) ✨ Re-authenticate user if token is expired - @dankolbman
- (#99) ✨ Persist state - @dankolbman
- (#98) ✨State over-haul with redux - @dankolbman
- (#96) ♻️ Planner fixes - @dankolbman
- (#95) 🎨 Show all services in planner - @dankolbman
- (#94) 🎨 Use new stats component for release statistics - @dankolbman
- (#93) ✨Add banner indicating which environment you're in - @dankolbman
- (#92) 🔧 Add more standard .env configuration - @dankolbman
- (#88) 👷 Use cloudfront module - @dankolbman

# Kf Ui Release Coordinator Release 1.2.1

## Features

### Summary

Feature Emojis: ⬆️x1 🎨x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x1 [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x1

### New features and changes

- (#86) ⬆️ Bump ui kit version - @dankolbman
- (#85) 🎨 Add last published fields to study tables - @dankolbman


# Kids First Release Coordinator UI Release 1.2.0

## Features

### Summary

Feature Emojis: ✨x3 ♻️x1 🎨x1 🚨x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x4 [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x3 [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x1

### New features and changes

- (#70) ✨ Add report summary to release page - @dankolbman
- (#81) ♻️ Add release description form to release page - @dankolbman
- (#80) 🎨 Migration to Kids First design system - @dankolbman
- (#69) ✨ Add release timeline to release pages - @dankolbman
- (#68) 🚨 Linting and CI - @dankolbman
- (#67) ✨ Status rehash - @dankolbman


# Kids First Release Coordinator UI Release 1.1.1

## Features

### Summary

Feature Emojis: ✨x2 ♻️x1 
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x2 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x1 [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x1

### New features and changes

- (#60) ✨ Add confirmation dialog for new releases - @dankolbman
- (#59) ♻️ Clean up table sorting - @dankolbman
- (#58) ✨ Allow tables to be sorted - @dankolbman


# Kids First Release Coordinator UI Release 1.1.0

## Features

Added study views and wysiwyg markdown editor for releases.

### Summary

Feature Emojis: 🐛x2 ✨x2 🔧x1 🎨x1
Feature Labels: [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x3 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x2 [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x1

### New features and changes

- (#54) 🐛 Temp fix to show more releases and studies - @dankolbman
- (#52) 🔧 Increase number of studies shown for release - @dankolbman
- (#51) 🎨 Add markdown editor and viewer for release notes - @dankolbman
- (#50) 🐛 Add missing study view route - @dankolbman
- (#49) ✨ Support for release versions - @dankolbman
- (#47) ✨ Show task to be run during a release in planner - @dankolbman


# Kids First Release Coordinator UI Release 1.0.0

## Features

### Summary

Feature Emojis: ✨x3 🐛x2 🎨x2 🔧x2 Eventx1 Stylex1 🚚x1
Feature Labels: [refactor](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/refactor) x5 [feature](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/feature) x3 [bug](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/bug) x3 [devops](https://api.github.com/repos/kids-first/kf-ui-release-coordinator/labels/devops) x1

### New features and changes

- (#47) ✨ Show task to be run during a release in planner - @dankolbman
- (#43) ✨ Event formatting - @dankolbman
- (#42) Event formatting - @dankolbman
- (#40) 🐛 Fix task status - @dankolbman
- (#39) ✨ Editable service - @dankolbman
- (#38) 🐛 Fix task status api call - @dankolbman
- (#36) 🎨 Add cards to status page - @dankolbman
- (#35) Style login - @dankolbman
- (#34) 🚚 Organizing .env files - @dankolbman
- (#31) 🔧 Add ego api to docker - @dankolbman
- (#30) 🎨 Replace sider logo with login logo - @dankolbman
- (#28) 🔧 Use tasks with filter endpoint - @dankolbman
