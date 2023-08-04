# fsmeet-frontend

## Prerequisites

[yarn](https://yarnpkg.com/)

## Run in Docker

pull image

```
docker pull luisnaldo7/fsmeet-frontend:latest
```

or build image

```
docker build --build-arg COMMIT_SHA=456 -t luisnaldo7/fsmeet-frontend:latest .
```

execute container

```
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --rm --name fsmeet-frontend luisnaldo7/fsmeet-frontend:latest
```

execute container on boot

```
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --restart always --name fsmeet-frontend luisnaldo7/fsmeet-frontend:latest
```

## Fonts

[fonts.google.com](https://fonts.google.com/)

## Images

Icons

[iconfinder.com](https://www.iconfinder.com/)

### Used Images

Profile

- [Events](https://www.iconfinder.com/icons/2316003/ball_courts_football_sports_icon)

- [Settings](https://www.iconfinder.com/icons/1564529/mechanism_options_settings_configuration_setting_icon#svg)

- [Feedback](https://www.iconfinder.com/icons/8673475/ic_fluent_person_feedback_filled_icon)

- [Logout](https://www.iconfinder.com/icons/3994382/access_close_exit_logout_sign_out_icon#svg)

- [User](https://www.iconfinder.com/icons/1564535/customer_user_userphoto_account_person_icon)

Feedback

- [Bug](https://www.iconfinder.com/icons/1608588/bug_icon)

- [Feature](https://www.iconfinder.com/icons/3018516/availability_component_element_feature_items_list_settings_icon)

- [General Feedback](https://www.iconfinder.com/icons/6843045/customer_feedback_happy_performance_satisfaction_satisfied_satisfy_icon)

- [Thumbs up](https://www.iconfinder.com/icons/8665808/thumbs_up_icon)

Event

- [Competition](https://www.iconfinder.com/icons/6843056/achievement_award_competition_reward_success_trophy_winner_icon)

- [Meeting](https://www.iconfinder.com/icons/7055165/meeting_consultation_partnership_communication_brainstorm_icon)

[About](https://www.iconfinder.com/icons/9041227/info_circle_fill_icon)
