# fsmeet-frontend

## Getting started for development

### Prerequisites

[node.js](https://nodejs.org/en) >= 20.9.0

[yarn](https://yarnpkg.com/)

[Docker](https://docs.docker.com/manuals/) Engine, Build & Compose

### Run app

Create environment

```bash
cp .env.example .env
```

Install dependencies

```bash
yarn install
```

Start app

```bash
yarn dev
```

## Run in Docker

Pull image

```
docker pull luisnaldo7/fsmeet-frontend:latest
```

or build image

```
docker build --build-arg COMMIT_SHA=456 -t luisnaldo7/fsmeet-frontend:latest .
```

Execute container

```
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --rm --name fsmeet-frontend luisnaldo7/fsmeet-frontend:latest
```

or execute container on boot

```
docker run -d -p 3001:3001 -e NEXT_PUBLIC_BACKEND_URL="http://localhost:3000" --restart always --name fsmeet-frontend luisnaldo7/fsmeet-frontend:latest
```

## Component Library

- [shadcn](https://ui.shadcn.com/docs/components/tabs)

## Content

### Fonts

- [fonts.google.com](https://fonts.google.com/)

### Icons

- [iconfinder.com](https://www.iconfinder.com/)

### Images

Registration

- [New Mail](https://www.iconfinder.com/icons/9044457/email_new_icon)

- [Dizzy Emoji](https://www.iconfinder.com/icons/8664942/face_dizzy_emoji_icon)

- [Celebration](https://www.iconfinder.com/icons/6472607/birthday_celebration_christmas_party_trumpet_xmas_icon)

Account

- [Add Image](https://www.iconfinder.com/icons/103590/image_add_icon)

- [Bye](https://www.iconfinder.com/icons/9070043/bye_icon)

Public User Page

- [Verified User Checkmark](https://www.iconfinder.com/icons/9554694/store_verified_shopping_ecommerce_cart_icon)

- [Instagram Logo](https://www.iconfinder.com/icons/6929237/instagram_icon)

- [TikTok Logo](https://www.iconfinder.com/icons/7024782/tiktok_social_media_icon)

- [YouTube Logo](https://www.iconfinder.com/icons/4375133/logo_youtube_icon)

- [Website](https://www.iconfinder.com/icons/6428026/connect_globe_internet_website_icon)

User Menu

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

User Types

- [Admin](https://www.iconfinder.com/icons/3018587/admin_administrator_ajax_options_permission_settings_user_icon)

- [Association](https://www.iconfinder.com/icons/2135919/group_leader_man_men_icon)

- [Brand](https://www.iconfinder.com/icons/8542538/tshirt_clothing_icon)

- [DJ](https://www.iconfinder.com/icons/3994356/dj_earphone_headphone_headset_listen_icon)

- [Freestyler (purchased)](https://www.iconfinder.com/icons/8176401/sport_freestyle_football_soccer_trick_juggling_juggle_icon?coming-from=related-results)

- [MC](https://www.iconfinder.com/icons/9023701/microphone_stage_fill_icon)

- [Media](https://www.iconfinder.com/icons/4632668/camera_film_movie_recorder_video_icon)

Map

- [World](https://www.iconfinder.com/icons/7030157/navigation_map_gps_ui_basic_location_app_icon)

Community

- [People](https://www.iconfinder.com/icons/4265044/community_conversation_friends_group_people_target_team_icon)

Misc

- [About](https://www.iconfinder.com/icons/9041227/info_circle_fill_icon)

- [Not Found](https://www.iconfinder.com/icons/9054414/bx_confused_icon)
