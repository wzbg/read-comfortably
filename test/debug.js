/* 
* @Author: zyc
* @Date:   2015-11-30 19:37:32
* @Last Modified by:   zyc
* @Last Modified time: 2015-12-04 13:25:33
*/
'use strict';

const fs = require('fs');
const S = require('string');
const fetch = require('fetch');
const fetchUrl = fetch.fetchUrl;
const read = require('../index');

// const url = 'https://blog.adafruit.com/2015/06/17/horses-get-blinky-rainbow-tails-wearablewednesday/';
// const url = 'https://hbr.org/2015/10/assessment-does-your-team-think-digitally';
// const url = 'https://hbr.org/2015/10/a-simple-graph-explains-the-complex-logic-of-the-big-beer-merger';
// const url = 'https://hbr.org/product/if-you-really-want-to-change-the-world-a-guide-to-creating-building-and-sustaining-breakthrough-ventures/14235E-KND-ENG';
// const url = 'https://hbr.org/product/if-you-really-want-to-change-the-world-a-guide-to-creating-building-and-sustaining-breakthrough-ventures/14235-HBK-ENG';
// const url = 'https://hbr.org/video/4578695106001/are-the-workaholics-you-know-just-faking-it';
// const url = 'https://hbr.org/video/embed/4578695106001/are-the-workaholics-you-know-just-faking-it';
// const url = 'https://instagram.com/p/6pXdWYKTTt/';
// const url = 'https://instagram.com/p/6-AQK4qTWu/';
// const url = 'https://instagram.com/p/7cfT35KTQi/';
// const url = 'https://instagram.com/p/7dTjbPKTVp/';
// const url = 'https://instagram.com/p/7UgUy7KTVw/';
// const url = 'https://instagram.com/p/7XF-4XqTV6/';
// const url = 'https://instagram.com/p/8Az3iZKTQ3/';
// const url = 'https://medium.com/@rchang/my-two-year-journey-as-a-data-scientist-at-twitter-f0c13298aee6';
// const url = 'https://roadtrippers.com/stories/welcome-to-chloride-ghost-town-arizonas-most-offbeat-roadside-attraction?lat=40.83044&#x26;lng=-96.70166&#x26;z=5';
// const url = 'https://techcrunch.com/2015/10/27/senate-passes-cybersecurity-threat-sharing-bill-that-tech-hates/';
// const url = 'https://twitter.com/mental_floss/status/641376220811137024';
// const url = 'https://twitter.com/mental_floss/status/643764273198444544/photo/1';
// const url = 'https://twitter.com/mike_santine/status/641708054573002752/photo/1';
// const url = 'https://whisper.sh/stories/9c966be6-5a9d-4ba4-8a21-604bc2ae1471/The-Shameless-Things-People-Do-To-Take-The-Perfect-Selfie';
// const url = 'https://www.indiegogo.com/projects/aftershokz-trekz-bone-conduction-headphones#/story';
// const url = 'https://www.indiegogo.com/projects/fusion-micro-the-world-s-smallest-supercomputer#/funders';
// const url = 'https://www.indiegogo.com/projects/keplero-luxury-wallet#/gallery';
// const url = 'https://www.indiegogo.com/projects/the-qliplet-the-next-generation-super-clip#/updates';
// const url = 'https://www.indiegogo.com/projects/world-s-best-travel-jacket-with-15-features-baubax#/story';
// const url = 'https://www.indiegogo.com/projects/zaptip-the-world-s-first-magnetic-super-charger#/comments';
// const url = 'https://www.kickstarter.com/discover/categories/design?ref=discover_index';
// const url = 'https://www.kickstarter.com/projects/1152958674/the-sensel-morph-interaction-evolved?ref=home_potd';
// const url = 'https://www.kickstarter.com/projects/1670806281/brooklyn-instruments-guitars-for-the-people-and-th';
// const url = 'https://www.kickstarter.com/projects/1942313546/the-worlds-best-laptop-stand-the-apex-revolution?ref=category';
// const url = 'https://www.kickstarter.com/projects/489540660/designercise-a-creative-thinking-game-and-ideation';
// const url = 'https://www.kickstarter.com/projects/980363115/ooovre-a-better-way-to-buy-books-online?ref=home_potd';
// const url = 'https://www.linkedin.com/pulse/nature-things-mickey-mcmanus';
// const url = 'https://www.washingtonpost.com/rweb/sports/bulls-show-off-their-style-in-a-constiety-of-ways/2015/11/06/73c7754b1515e6f15921910918ea7a7c_story.html';
// const url = 'https://www.youtube.com/watch?v=BTsLaETuyss';
// const url = 'https://www.youtube.com/watch?v=CMTpvr9HXeI';
// const url = 'https://www.youtube.com/watch?v=dCxkcDuW7AY';
// const url = 'https://www.youtube.com/watch?v=dWi74mlzL5Q';
// const url = 'https://www.youtube.com/watch?v=mfoI7EmP4ZM';
// const url = 'https://www.youtube.com/watch?v=SSeJQBMzMDU';
// const url = 'https://www.youtube.com/watch?v=UFccvtrP1d8';
// const url = 'https://www.youtube.com/watch?v=Uk_vV-JRZ6E';
// const url = 'https://www.youtube.com/watch?v=UP7_ycRX_e8';
// const url = 'https://www.youtube.com/watch?v=WI05xmxiZxw';
// const url = 'https://www.youtube.com/watch?v=yQVpYgwE7OE';
// const url = 'https://www.youtube.com/watch?v=zyxjs_-xe8Y';

// const url = 'http://9to5mac.com/2015/08/25/idc-china-slowdown-smartphone-forecast-iphone-6c/';
// const url = 'http://abduzeedo.com/art-message-peter-tunney';
// const url = 'http://abduzeedo.com/best-week-back-future-star-wars-tech-news-and-more';
// const url = 'http://abduzeedo.com/ccaa-kids-character-design';
// const url = 'http://abduzeedo.com/daily-inspiration-2165';
// const url = 'http://abduzeedo.com/einsteins-theory-general-relativity-turns-100-video';
// const url = 'http://abduzeedo.com/principle-mac-prototyping-tool';
// const url = 'http://archinect.com/features/article/135648933/new-architecture-job-application-tips-hints-from-employers';
// const url = 'http://blogs.indiewire.com/bent/a-year-of-1989-the-unusual-healing-power-of-taylor-swift-20151027';
// const url = 'http://blogs.transparent.com/language-news/2015/08/26/staying-resourceful-in-language-learning/';
// const url = 'http://boingboing.net/2015/09/03/fish-splooges-on-president-oba.html';
// const url = 'http://boingboing.net/2015/09/03/raccoon-pool.html';
// const url = 'http://boingboing.net/2015/09/04/raccoon-doesnt-like-his-frie.html';
// const url = 'http://cdn.flipboard.com/content/thephotodesk/thephotodeskgalleries/items/1440433775000.html';
// const url = 'http://deadspin.com/high-school-football-players-target-light-up-poor-offi-1728999161';
// const url = 'http://deals.kinja.com/saturdays-best-deals-19-bias-light-fitbit-charge-hr-1728903187';
// const url = 'http://deals.kinja.com/sundays-best-deals-macbook-pro-new-iphone-cases-chea-1729024222';
// const url = 'http://deals.kinja.com/this-labor-day-fitbit-deal-will-get-your-heart-pumping-1728865378';
// const url = 'http://edition.cnn.com/2015/08/13/travel/korea-food-map/index.html/';
// const url = 'http://espn.go.com/espnw/video/12795108/how-marsden-made-it';
// const url = 'http://food52.com/blog/13993-9-sunny-recipes-for-an-end-of-summer-dinner';
// const url = 'http://food52.com/blog/14005-act-now-make-these-11-recipes-while-it-s-still-summer';
// const url = 'http://fortune.com/2015/08/20/airbnb-tesla-partner/';
// const url = 'http://ftalphaville.ft.com/2015/10/23/2142800/how-is-canada-doing-these-days/';
// const url = 'http://gawker.com/dentist-who-killed-cecil-the-lion-says-hes-going-back-t-1729112886';
// const url = 'http://gawker.com/robin-williams-daughter-shares-hopeful-message-about-gr-1729096261';
// const url = 'http://gizmodo.com/earths-oceans-could-look-completely-different-by-the-en-1728808399';
// const url = 'http://gizmodo.com/why-one-random-web-address-can-crash-chrome-1732731055';
// const url = 'http://helloseed.io/index.php/2015/11/24/seedinstrux/';
// const url = 'http://hypebeast.com/2015/8/banksy-talks-dismaland-and-contemporary-art';
// const url = 'http://hypebeast.com/2015/9/pink-dolphin-lookbook-keith-ape';
// const url = 'http://insidescoopsf.sfgate.com/blog/2015/08/18/our-favorite-restaurants-to-eat-for-cheap-around-uc-berkeley/';
// const url = 'http://jezebel.com/mindy-kalings-gross-body-brings-her-a-lot-of-happiness-1728904957';
// const url = 'http://lifehacker.com/what-to-do-when-you-envy-a-coworker-1682581675';
// const url = 'http://live.theverge.com/live-microsoft-ifa-berlin-2015/';
// const url = 'http://mashable.com/2015/08/31/back-to-school-1938/';
// const url = 'http://mashable.com/2015/09/07/greeting-the-queen/';
// const url = 'http://mashable.com/2015/09/07/fireball-sky-downtown-bangkok/';
// const url = 'http://mashable.com/2015/09/07/stonehenge-prehistoric-monument/';
// const url = 'http://mashable.com/2015/09/07/walter-palmer-first-interview/';
// const url = 'http://mashable.com/2015/09/14/bill-nye-brain-internet-emoji/';
// const url = 'http://mashable.com/2015/09/27/dolce-and-gabbana-selfies/';
// const url = 'http://mashable.com/2015/10/09/skunk-caretaker-masterful-prank/';
// const url = 'http://mashable.com/2015/10/13/bernie-sanders-debate-tweets/';
// const url = 'http://mashable.com/2015/11/11/best-patrick-stewart-tweets/';
// const url = 'http://mentalfloss.com/article/68033/what-english-sounds-non-english-speakers';
// const url = 'http://mentalfloss.com/article/60365/20-eye-opening-facts-about-eyes-wide-shut';
// const url = 'http://mentalfloss.com/node/68242/take';
// const url = 'http://mentalfloss.com/us/go/68322';
// const url = 'http://money.cnn.com/2015/10/04/technology/jack-ma-painting-charity-sothebys/';
// const url = 'http://news.moviefone.com/2015/08/27/best-summer-movies-all-time-ranked/';
// const url = 'http://news.moviefone.com/2015/10/26/top-10-channing-tatum-performances/';
// const url = 'http://news.moviefone.com/2015/10/27/best-of-late-night-tv-mike-tysons-drake-dance-moves/';
// const url = 'http://news.moviefone.com/2015/10/27/walking-dead-showrunner-scott-gimple-promises-answers/';
// const url = 'http://online.wsj.com/articles/grandparent-power-bonds-with-seniors-help-stabilize-teens-1441035672';
// const url = 'http://online.wsj.com/articles/to-stop-procrastinating-start-by-understanding-whats-really-going-on-1441043167';
// const url = 'http://petapixel.com/2015/08/28/heres-why-instagram-chose-to-break-the-frame/';
// const url = 'http://qz.com/489337/guangdong-provinces-solution-to-dumb-money-teach-finance-to-eight-year-olds/';
// const url = 'http://qz.com/519155/just-googling-it-is-bad-for-your-brain/';
// const url = 'http://readwrite.com/2015/10/14/product-utility-versus-design';
// const url = 'http://researchcenter.paloaltonetworks.com/2015/09/novel-malware-xcodeghost-modifies-xcode-infects-apple-ios-apps-and-hits-app-store/';
// const url = 'http://smittenkitchen.com/blog/2015/02/perfect-corn-muffins/';
// const url = 'http://space.io9.com/in-space-yesterdays-coffee-is-todays-coffee-1728034023';
// const url = 'http://techcrunch.com/2015/08/25/youtube-gaming-its-twitch-competitor-set-to-launch-tomorrow/#.s1vcuu:j64V';
// const url = 'http://techcrunch.com/2015/09/07/sign-up-for-another-chance-to-get-two-for-one-tickets-to-disrupt-london/';
// const url = 'http://techcrunch.com/2015/09/07/strangers-on-a-train/';
// const url = 'http://techcrunch.com/2015/09/07/tvibes/';
// const url = 'http://techcrunch.com/2015/09/04/app-release-notes-are-getting-stupid/';
// const url = 'http://techcrunch.com/2015/09/04/crunchweek-uber-class-action-a-poaching-settlement-and-apples-big-adventure/';
// const url = 'http://techcrunch.com/2015/09/04/toyota-pledges-50m-to-research-ai-for-autonomous-vehicles-hires-darpas-dr-gill-pratt/';
// const url = 'http://techcrunch.com/2015/09/05/gillmor-gang-check-please/';
// const url = 'http://techcrunch.com/2015/09/05/the-future-is-african/';
// const url = 'http://techcrunch.com/2015/09/06/how-the-rules-of-cyber-engagement-have-changed/';
// const url = 'http://techcrunch.com/2015/09/29/profile-gif/';
// const url = 'http://techcrunch.com/gallery/20-apps-to-help-students-power-through/';
// const url = 'http://thoughtcatalog.com/kovie-biakolo/2015/08/13-things-that-definitely-happened-in-your-childhood-if-your-parents-were-college-professors/';
// const url = 'http://time.com/4007174/which-spouse-asks-for-divorce/';
// const url = 'http://twitter.com/mental_floss/status/640364554011086848/photo/1';
// const url = 'http://twitter.com/mental_floss/status/640696744003502081/photo/1';
// const url = 'http://twitter.com/mental_floss/status/641134627868966912/photo/1';
// const url = 'http://twitter.com/mental_floss/status/641504569961242624/photo/1';
// const url = 'http://uncrate.com/stuff/1975-maserati-bora/';
// const url = 'http://uncrate.com/stuff/dinner-with-jackson-pollock/';
// const url = 'http://uncrate.com/stuff/mr-black-cold-press-coffee-liqueur/';
// const url = 'http://uncrate.com/stuff/nima-allergen-sensor/';
// const url = 'http://uncrate.com/stuff/sawmill-house/';
// const url = 'http://uproxx.com/music/2015/08/mtv-vmas-2015-video-music-awards-questions/';
// const url = 'http://uproxx.com/tv/2015/09/hulu-netflix-competition/';
// const url = 'http://uproxx.com/tv/2015/11/fate-of-glenn-walking-dead/';
// const url = 'http://uproxx.com/tv/2015/11/walking-dead-pop-up-book-merchandise/';
// const url = 'http://venturebeat.com/2015/09/05/ceos-if-your-startup-is-expanding-to-a-new-market-you-should-be-there/';
// const url = 'http://venturebeat.com/2015/09/04/creative-commons-founder-larry-lessig-is-running-for-president-the-system-is-rigged/';
// const url = 'http://venturebeat.com/2015/09/04/why-homekit-deserves-some-serious-love-during-apples-iphone-event-next-week/';
// const url = 'http://venturebeat.com/2015/08/30/why-i-just-moved-from-silicon-valley-to-ohio/';
// const url = 'http://venturebeat.com/2015/09/05/why-the-new-apple-tv-could-be-the-most-revolutionary-apple-product-in-years/';
// const url = 'http://venturebeat.com/2015/09/22/kakao-unveils-new-ceo-and-logo-in-bid-for-fresh-start-as-whatsapp-wechat-dominate/';

// const url = 'http://www.apppicker.com/applists/4620/the-best-video-editing-apps-for-iphone';
// const url = 'http://www.arkinspace.com/2015/08/the-astonishing-eggs-of-alien-nations.html';
// const url = 'http://www.avclub.com/article/babadook-it-follows-and-new-age-unbeatable-horror-227172';
// const url = 'http://www.bbc.com/news/magazine-30450980';
// const url = 'http://www.billboard.com/articles/columns/the-juice/6738532/mack-wilds-the-breaks-vh1-teaser-video-exclusive';
// const url = 'http://www.businessinsider.com/americas-20-most-expensive-cities-for-renters-2015-8';
// const url = 'http://www.businessinsider.com/angellist-ceo-naval-ravikant-shares-his-favorite-books-2015-8#/%23meditations-by-marcus-aurelius-1';
// const url = 'http://www.businessinsider.com/ap-bangladesh-court-lifts-ban-on-movie-rana-plaza-2015-9';
// const url = 'http://www.businessinsider.com/ap-french-agent-apologizes-for-bombing-greenpeace-boat-in-1985-2015-9';
// const url = 'http://www.businessinsider.com/ap-iran-budget-highways-and-national-debt-on-tap-for-congress-2015-9';
// const url = 'http://www.businessinsider.com/ap-obama-observes-labor-day-extends-contractors-paid-leave-2015-9';
// const url = 'http://www.businessinsider.com/ap-ohio-voters-take-chaotic-start-to-2016-race-in-stride-2015-9';
// const url = 'http://www.businessinsider.com/ap-pakistan-claims-use-of-first-indigenous-armed-drone-2015-9';
// const url = 'http://www.businessinsider.com/ap-syria-report-14-killed-in-rebel-shelling-of-northern-city-2015-9';
// const url = 'http://www.businessinsider.com/chinas-air-pollution-is-in-a-bad-spot-2015-8';
// const url = 'http://www.businessinsider.com/hottest-tech-startups-in-america-2015-8';
// const url = 'http://www.businessinsider.com/jim-simons-interview-scientists-save-wall-street';
// const url = 'http://www.businessinsider.com/the-first-10-apple-employees-and-where-they-are-now-2015-10';
// const url = 'http://www.businessinsider.com/the-highest-paying-jobs-at-facebook';
// const url = 'http://www.businessinsider.com/the-most-powerful-people-in-tech-2015-11';
// const url = 'http://www.businessinsider.com/the-smartest-celebrities-in-hollywood-2014-11';
// const url = 'http://www.businessinsider.com/things-to-do-in-nyc-fall-2015';
// const url = 'http://www.businessinsider.com/this-detailed-map-shows-how-terrorists-use-elephant-ivory-to-fund-violence-2015-9';
// const url = 'http://www.businessinsider.com/work-in-groups-to-detect-lies-2015-8';
// const url = 'http://www.businessoffashion.com/articles/careers/got-the-summertime-blues';
// const url = 'http://www.businessoffashion.com/articles/education/all-change-in-british-fashion-education';
// const url = 'http://www.businessoffashion.com/articles/fashion-show-review/giambattista-valli-lets-go';
// const url = 'http://www.businessoffashion.com/articles/fashion-show-review/hedi-slimane-does-it-again-yves-saint-laurent';
// const url = 'http://www.businessoffashion.com/articles/fashion-show-review/hermes-ageless-agenda';
// const url = 'http://www.businessoffashion.com/articles/fashion-show-review/sacais-chitose-abe-says-distort-yourself';
// const url = 'http://www.businessoffashion.com/articles/fashion-show-review/stella-mccartney-packs-a-punch';
// const url = 'http://www.businessoffashion.com/articles/intelligence/fashion-business-advice-young-designers';
// const url = 'http://www.businessoffashion.com/articles/intelligence/glossier-into-the-gloss-beauty-brand-emily-weiss';
// const url = 'http://www.businessoffashion.com/articles/intelligence/mass-customisation-fashion-nike-converse-burberry';
// const url = 'http://www.businessoffashion.com/articles/news-analysis/tommy-ton-goes-his-own-way';
// const url = 'http://www.businessoffashion.com/articles/week-in-review/yoox-net-a-porter-and-lessons-in-post-merger-integration';
// const url = 'http://www.buzzfeed.com/christianzamora/things-kim-kardashian-looked-like-at-the-2015-vmas#.xaon0jg1w';
// const url = 'http://www.buzzfeed.com/emilycarlo/drunk-food#.cb6Mm3qwQ';
// const url = 'http://www.buzzfeed.com/jessicamisener/decorative-rope-knot#.efqgqP4QZ';
// const url = 'http://www.buzzfeed.com/juliareinstein/night-showerers#.yqRR5v1Nr';
// const url = 'http://www.buzzfeed.com/laraparker/ex-texts-are-funny#.td9NqOQPm';
// const url = 'http://www.buzzfeed.com/nicolenguyen/hacks-every-student-should-know#.lqvOg5l1z';
// const url = 'http://www.buzzfeed.com/remeepatel/im-a-growing-girl#.qs03Ow7Zy';
// const url = 'http://www.buzzfeed.com/stephaniemcneal/this-is-how-one-group-in-baltimore-is-helping-syrian-refugee';
// const url = 'http://www.cnn.com/2015/10/24/entertainment/actress-maureen-ohara-obituary/';
// const url = 'http://www.cnn.com/2015/10/26/entertainment/adele-hello-obsessed-feat/';
// const url = 'http://www.cnn.com/2015/10/27/entertainment/glaad-study-transgender-tv-thr-feat/';
// const url = 'http://www.cntraveler.com/galleries/2015-09-04/everything-you-need-to-pack-for-new-york-fashion-week';
// const url = 'http://www.coolhunting.com/buy';
// const url = 'http://www.coolhunting.com/link/how-ballpoint-pens-killed-cursive';
// const url = 'http://www.coolhunting.com/link/scientists-find-a-double-black-hole';
// const url = 'http://www.coolhunting.com/listen/foals-what-went-down';
// const url = 'http://www.coolhunting.com/listen/sampa-the-great-spoken-word-mixtape';
// const url = 'http://www.coolhunting.com/listen/synkro-midnight-sun';
// const url = 'http://www.core77.com/posts/27478/how-to-read-a-cheese-wheel-27478';
// const url = 'http://www.core77.com/posts/40273/Brass-Walnut-n-Technology-Love-Hult%C3%A9ns-Beautiful-Furniture-Combines-Old-School-and-Hi-Tech';
// const url = 'http://www.core77.com/posts/40364/Matthias-Wandels-DIY-Automatic-Baby-Rocking-Machine';
// const url = 'http://www.core77.com/posts/40396/Blazing-Fast-Rescue-Action-Japanese-Firefighter-Tech-Rope-Speed-Competition';
// const url = 'http://www.core77.com/posts/40438/DiRestas-Cut-Vampire-Spike-Table';
// const url = 'http://www.core77.com/posts/40466/Watch-a-Master-Bladesmith-Make-a-Kitchen-Knife-Out-of-Meteorites';
// const url = 'http://www.core77.com/posts/40472/Maniac-Testing-Personal-Flying-Craft-Powered-by-54-Rotors';
// const url = 'http://www.core77.com/posts/40499/Engineer-Builds-Huge-25x-Scale-Arcade-Machine-to-Make-Adult-Players-Feel-Like-Tykes-Again';
// const url = 'http://www.core77.com/posts/40559/Stonehenge-Now-Seems-Small-Remains-of-Much-Larger-Buried-Monument-Discovered-Nearby';
// const url = 'http://www.core77.com/posts/40572/How-to-Make-a-Poor-Mans-RAID-Drive';
// const url = 'http://www.core77.com/posts/40609/The-Design-Process-of-the-OCD-Drill-Bit-Organizer';
// const url = 'http://www.core77.com/posts/40614/Sexy-Design-Solutions-for-Utilizing-Blind-Corner-Cabinet-Space-in-the-Kitchen';
// const url = 'http://www.core77.com/projects/39387/Injera-Contemporary-Forms-for-an-Ancient-Ritual';
// const url = 'http://www.dazeddigital.com/music/article/26070/1/south-korea-just-trolled-north-korea-with-k-pop';
// const url = 'http://www.demilked.com/craniosynostosis-head-shaping-star-wars-helmets-mikesweeney/';
// const url = 'http://www.demilked.com/detailed-food-art-spoon-ioana-vanc-romania/';
// const url = 'http://www.demilked.com/longest-glass-walkway-bridge-scary-shiniuzhai-geopark-china/';
// const url = 'http://www.demilked.com/mental-illnesses-disorders-drawn-real-monsters-toby-allen/';
// const url = 'http://www.demilked.com/modern-architecture-all-interiors-connect-outside-kloof-road-house-werner-van-del-meulen-south-africa/';
// const url = 'http://www.demilked.com/more-lego-miniature-adventures-sofiane-samlal-samsofy/';
// const url = 'http://www.dezeen.com/2015/08/30/decadrages-bedup-lifts-up-to-ceiling-when-not-in-use/';
// const url = 'http://www.dezeen.com/2015/09/03/will-bruder-clads-mountain-home-aspen-charred-cypress-blackened-wood-colorado/';
// const url = 'http://www.dezeen.com/2015/09/07/cast-concrete-galway-picture-palace-depaor-architects-georgian-terrace-ireland/';
// const url = 'http://www.dezeen.com/2015/09/07/nic-owen-architects-renovation-ornate-melbourne-victorian-terrace-ribbed-steel-extension-australia/';
// const url = 'http://www.dezeen.com/2015/09/09/apple-and-hermes-unveil-apple-watch-collection-with-handcrafted-leather-straps/';
// const url = 'http://www.dezeen.com/2015/09/23/seung-h-sang-mountain-hyunama-house-pre-rusted-steel-south-korea-woodland/';
// const url = 'http://www.dezeen.com/2015/11/06/australian-national-architecture-awards-2015-winners/';
// const url = 'http://www.engadget.com/2015/07/15/japans-first-robot-staffed-hotel/?%3Fncid=rss_full';
// const url = 'http://www.engadget.com/2015/08/20/the-agonizingly-slow-decline-of-adobe-flash-player/?ncid=rss_semi';
// const url = 'http://www.engadget.com/2015/08/26/obi-worldphones/?ncid=rss_semi';
// const url = 'http://www.engadget.com/2015/08/26/sony-wireless-speaker-tv-remote/';
// const url = 'http://www.engadget.com/2015/09/06/destiny-2.0/?ncid=rss_semi';
// const url = 'http://www.engadget.com/2015/09/06/theres-now-a-vending-machine-that-dispenses-hot-french-fries/?ncid=rss_semi';
// const url = 'http://www.engadget.com/2015/09/07/iphone-workout-app-study/?ncid=rss_semi';
// const url = 'http://www.engadget.com/2015/09/18/ghost-in-the-shell-vr-teaser/';
// const url = 'http://www.engadget.com/2015/09/23/babymetal-will-cute-you-to-death-in-rock-band-4/';
// const url = 'http://www.engadget.com/2015/12/03/nintendo-super-moschino-collection/';
// const url = 'http://www.engadget.com/2015/12/03/rumor-apple-has-an-updated-4-inch-iphone-due-early-next-year/';
// const url = 'http://www.engadget.com/rss.xml';
// const url = 'http://www.entrepreneur.com/article/249866';
// const url = 'http://www.esquire.com/entertainment/movies/a37752/steve-jobs-man-in-the-machine/';
// const url = 'http://www.ew.com/article/2015/10/27/fox-apologizes-after-world-series-goes-dark';
// const url = 'http://www.fastcocreate.com/3050732/top-5-ads/two-inspiring-serena-williams-stories-and-a-pregnant-dude-the-top-5-ads-of-the-wee?partner=rss';
// const url = 'http://www.fastcocreate.com/3052667/why-absolut-created-a-think-tank-to-plan-for-the-next-30-years-of-nightlife?partner=rss';
// const url = 'http://www.fastcodesign.com/3050538/everything-wonderful-about-geocities-in-one-visual-time-capsule?partner=rss';
// const url = 'http://www.fastcoexist.com/3049283/fund-this/the-giant-air-purifier-is-actually-a-jewelry-making-machine-and-the-jewelry-is-mad?partner=rss';
// const url = 'http://www.fastcoexist.com/3049853/in-countries-where-menstruation-is-stigmatized-these-easy-wash-sanitary-towels-could-help?partner=rss';
// const url = 'http://www.fastcoexist.com/3050299/belgian-streets-got-rid-of-cars-and-turned-into-beautiful-parks-this-summer?partner=rss';
// const url = 'http://www.fastcoexist.com/3050672/the-new-york-subway-still-runs-on-analog-technology-from-the-1930s?partner=rss';
// const url = 'http://www.fastcoexist.com/3050721/a-future-skyline-for-mumbai-with-shipping-container-skyscrapers?partner=rss';
// const url = 'http://www.fastcoexist.com/3050722/3d-printing-ancient-artifacts-lets-us-figure-out-what-they-were-actually-for?partner=rss';
// const url = 'http://www.fastcompany.com/3050752/fast-feed/how-well-do-you-know-the-news-take-our-quiz?partner=rss';
// const url = 'http://www.forbes.com/sites/alastairdryburgh/2015/11/07/what-does-amazons-first-bricks-and-mortar-bookstore-tell-us-about-the-future/';
// const url = 'http://www.forbes.com/sites/baileybrautigan/2015/10/23/the-coolest-new-way-athletes-connect-with-fans-selfie-assists/';
// const url = 'http://www.forbes.com/sites/chunkamui/2015/08/21/google-is-millions-of-miles-ahead-of-apple-in-driverless-cars/';
// const url = 'http://www.forbes.com/sites/gregsatell/2015/11/06/why-the-new-economy-really-is-a-social-economy/';
// const url = 'http://www.foxnews.com/sports/2015/11/03/brady-for-mvp-no-romo-is-more-valuable.html';
// const url = 'http://www.foxnews.com/tech/2015/08/30/5-details-shouldnt-give-facebook/';
// const url = 'http://www.ft.com/cms/s/0/01f8d2ec-46a5-11e5-af2f-4d6e0e5eda22.html#axzz3lGEOkVvQ';
// const url = 'http://www.harpersbazaar.com/celebrity/latest/news/a11988/mtv-vmas-2015-instagrams/';
// const url = 'http://www.hitfix.com/news/how-pixars-the-good-dinosaur-gets-surprisingly-rough-and-tumble';
// const url = 'http://www.hitfix.com/news/jennifer-lawrence-dislocated-her-toe-during-the-hunger-games-publicity-tour';
// const url = 'http://www.huffingtonpost.com/conde-nast-traveler/the-most-romantic-restaur_1_b_7977254.html';
// const url = 'http://www.huffingtonpost.com/entry/ariana-grande-christina-aguilera-britney-spears-impressions_55f8de86e4b0b48f67013cca';
// const url = 'http://www.huffingtonpost.com/entry/back-to-school-pinterest-trends_55d24403e4b07addcb43bbc0?kvcommref=mostpopular';
// const url = 'http://www.huffingtonpost.com/entry/cats-engage-in-epic-battle-with-their-own-shadows_560eddc4e4b0dd85030c011e';
// const url = 'http://www.huffingtonpost.com/entry/man-buns-of-disneyland-instagram_55d7157fe4b00d8137eddf56?kvcommref=mostpopular';
// const url = 'http://www.huffingtonpost.com/lev-raphael/when-authors-beg-for-blur_b_8098518.html';
// const url = 'http://www.huffingtonpost.com/lisa-copeland/dating-mistakes-women-over-50-make_b_8055148.html';
// const url = 'http://www.huffingtonpost.com/matthew-dietrich/watch-illinois-bill-backl_b_8135330.html';
// const url = 'http://www.huffingtonpost.com/sebastian-matthes/volkswagen-from-star-pupil-to-con-artist_b_8193682.html';
// const url = 'http://www.indiewire.com/article/how-can-middle-class-filmmakers-make-a-living-20151026';
// const url = 'http://www.indiewire.com/article/margaret-meade-film-festival-announces-2015-filmmaker-award-winners-20151026';
// const url = 'http://www.juxtapoz.com/illustration/the-surreal-world-of-fabien-merelle';
// const url = 'http://www.macrumors.com/2015/09/20/samsung-smartphone-leasing-program-rumor/';
// const url = 'http://www.mensfitness.com/life/entertainment/fit-fix-chipotle-temporarily-closes-restaurants-after-e-coli-outbreak';
// const url = 'http://www.mensfitness.com/nutrition/what-to-drink/20-great-pumpkin-beers-try-halloween';
// const url = 'http://www.mensfitness.com/nutrition/what-to-eat/most-delicious-gourmet-post-workout-meals-all-time';
// const url = 'http://www.mensfitness.com/women/sex-tips/ask-mens-fitness-there-something-i-could-wear-would-turn-her-too';
// const url = 'http://www.menshealth.com/nutrition/human-dna-hotdogs';
// const url = 'http://www.menshealth.com/sex-women/masturbation-mistakes';
// const url = 'http://www.mymodernmet.com/profiles/blogs/anna-di-prospero-urban-self-portraits';
// const url = 'http://www.mymodernmet.com/profiles/blogs/before-and-after-shots-of-jogg';
// const url = 'http://www.mymodernmet.com/profiles/blogs/bibliobicicleta-pop-up-bicycle-library';
// const url = 'http://www.mymodernmet.com/profiles/blogs/cashel-lupinacci-suffering-the-silence';
// const url = 'http://www.mymodernmet.com/profiles/blogs/foodnited-states-of-america-complete';
// const url = 'http://www.mymodernmet.com/profiles/blogs/scott-herder-travels-from-the-monk-that-lives-in-my-phone';
// const url = 'http://www.nbcnews.com/business/autos/vw-also-cheated-audis-porsches-epa-says-new-round-charges-n456101';
// const url = 'http://www.nbcnews.com/news/us-news/keystone-xd-transcanada-asks-u-s-suspend-pipeline-application-review-n456226';
// const url = 'http://www.nomadicmatt.com/travel-blogs/how-to-stay-safe-in-south-africa/';
// const url = 'http://www.nomadicmatt.com/travel-blogs/new-nomadic-matt/';
// const url = 'http://www.nomadicmatt.com/travel-blogs/safety-in-morocco/';
// const url = 'http://www.npr.org/2015/11/02/453885663/pfizer-would-cut-its-corporate-tax-bill-if-it-merges-with-allergan';
// const url = 'http://www.npr.org/2015/11/22/455880918/this-holiday-season-retailers-will-be-wishing-for-more-workers';
// const url = 'http://www.npr.org/sections/alltechconsidered/2015/08/24/434313813/why-phone-fraud-starts-with-a-silent-call';
// const url = 'http://www.npr.org/sections/money/2015/10/28/452655987/episode-518-your-organs-please';
// const url = 'http://www.nytimes.com/2015/06/07/style/escape-to-bro-topia.html';
// const url = 'http://www.nytimes.com/2015/08/11/technology/giving-google-room-to-dream-big-beyond-search.html';
// const url = 'http://www.nytimes.com/2015/08/20/t-magazine/who-is-marc-jacobs.html';
// const url = 'http://www.nytimes.com/2015/09/18/travel/chicago-foodseum-kickstarter.html';
// const url = 'http://www.nytimes.com/2015/09/21/business/a-huge-overnight-increase-in-a-drugs-price-raises-protests.html';
// const url = 'http://www.primermagazine.com/2015/learn/pack-like-a-pro-learn-how-we-got-all-this-into-one-carry-on';
// const url = 'http://www.seriouseats.com/2014/07/best-breakfast-sandwiches-america-usa.html';
// const url = 'http://www.snagfilms.com/films/title/red_shirley';
// const url = 'http://www.takepart.com/article/2015/08/20/global-dietary-guidelines';
// const url = 'http://www.techinsider.io/instagram-photos-from-inside-north-korea-2015-8';
// const url = 'http://www.technologyreview.com/news/539211/self-charging-phones-are-on-the-way-finally/';
// const url = 'http://www.theatlantic.com/business/archive/2015/09/economy-countries-oil-prices-war-opec/403930/';
// const url = 'http://www.theatlantic.com/entertainment/archive/2015/09/beyonce-made-in-america-2015-return-review/404065/';
// const url = 'http://www.theguardian.com/artanddesign/2015/aug/22/tate-sensorium-art-soundscapes-chocolates-invisible-rain';
// const url = 'http://www.theguardian.com/artanddesign/gallery/2015/sep/19/saint-etiennes-urban-doodler-with-a-sense-of-humour';
// const url = 'http://www.theguardian.com/business/2015/nov/10/china-singles-day-1111-expected-to-break-records';
// const url = 'http://www.thesartorialist.com/men/on-the-scene-at-costume-national-milan-2/';
// const url = 'http://www.thesartorialist.com/milan/on-the-street-via-fogazzaro-milan-15/';
// const url = 'http://www.thesartorialist.com/photos/on-the-street-astor-place-new-york-11/';
// const url = 'http://www.thesartorialist.com/photos/on-the-street-broadway-new-york-34/';
// const url = 'http://www.thescore.com/nba/events/93118/box_score';
// const url = 'http://www.thescore.com/nba/events/93168/box_score';
// const url = 'http://www.theverge.com/2015/8/25/9205915/amazon-prime-now-launches-seattle-redmond-bellevue-kirkland';
// const url = 'http://www.theverge.com/2015/9/4/9254633/toshiba-concept-tablet-ifa-2015';
// const url = 'http://www.theverge.com/2015/9/6/9268557/lg-urbane-luxe-23-karat-smartwatch-hands-on';
// const url = 'http://www.theverge.com/2015/9/7/9271467/mgsv-cardboard-boxes';
// const url = 'http://www.theverge.com/2015/9/7/9271543/uk-government-slang-warning';
// const url = 'http://www.thisiscolossal.com/2015/08/glass-fruit-elliot-walker/';
// const url = 'http://www.timeout.com/newyork/restaurants/best-breakfast-restaurants-in-america';
// const url = 'http://www.usatoday.com/picture-gallery/sports/mlb/2015/11/10/former-major-leaguer-tommy-hanson-dead-at-29/75499020/';
// const url = 'http://www.usatoday.com/picture-gallery/sports/ncaaf/2015/10/26/college-football-coaching-carousel/74623530/';
// const url = 'http://www.usatoday.com/sports/nfl/rankings/';
// const url = 'http://www.usatoday.com/story/sports/nba/2015/11/03/another-big-night-for-curry-warriors-breeze-past-memphis/75078626/';
// const url = 'http://www.vh1.com/news/218317/its-the-great-pumpkin-pumkin-your-favorite-vh1-stars-have-been-carved-into-jack-o-lanterns/?xrs=MW_1pm';
// const url = 'http://www.vh1.com/shows/top_20_countdown/the-20-episode-1024-week-of-october-24-2015/1738483/playlist/';
// const url = 'http://www.vice.com/read/are-we-about-to-live-through-a-lost-age-of-video-gaming-140';
// const url = 'http://www.vice.com/read/las-shrine-to-velvet-paintings';
// const url = 'http://www.vogue.com/13330506/top-ten-90s-heartthrobs/';
// const url = 'http://www.washingtonpost.com/rweb/biz/the-most-popular-type-of-home-in-every-major-us-city/2015/09/21/b548ac8e07d1712f43e8ebc876002c6b_story.html';
// const url = 'http://www.wired.com/2015/08/reaction-housing-exo-shelter/';
// const url = 'http://www.wired.co.uk/magazine/archive/2015/12/features/pixar-embraces-crisis-the-good-dinosaur';
// const url = 'http://www.wired.co.uk/magazine/stars-wars-the-force-awakens';
// const url = 'http://www.wired.co.uk/news/archive/2015-10/30/china-one-child-policy-in-numbers';
// const url = 'http://www.wired.co.uk/news/archive/2015-11/16/overwatch-interview-blizzard';
// const url = 'http://www.wired.co.uk/reviews/tablets/2015-11/ipad-pro-review';
// const url = 'http://www.youtube.com/watch?v=r-QNFjHeGUY';

const userAgent = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g';
// const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';

let urlprocess, preprocess, postprocess, asyncprocess;

// urlprocess = (url, options) => { // kickstarter.com
//   const urls = url.split('?')[0].split('/');
//   if (urls.length < 6 || urls[3] != 'projects') {
//     return url;
//   }
//   const newUrl = '';
//   urls.forEach((element, index) => {
//     if (index < 6) {
//       newUrl += element + '/';
//     }
//   });
//   return newUrl + 'description';
// };

// urlprocess = (url, options) => { // forbes.com
//   options.iframe = { url };
//   return url;
// };

// urlprocess = (url, options) => { // thescore.com endsWith box_score
//   if (url.endsWith('box_score')) {
//     options.iframe = { url };
//   }
//   return url;
// };

// urlprocess = (url, options) => { // hbr.org
//   if (/\/video\//.test(url)) {
//     options.iframe = {
//       url : url.replace('/video/', '/video/embed/')
//     };
//   }
//   return url;
// };

// urlprocess = (url, options) => { // instagram.com
//   if (/^https:\/\/instagram\.com\/p\/[\w-]+\/$/.test(url)) {
//     url += 'embed';
//   }
//   return url;
// };

// urlprocess = (url, options) => { // youtube.com
//   return url.replace('watch?v=', 'embed/');
// };

// preprocess = ($, options) => { // businessinsider.com
//   const curSlideObjs = $.html().match(/curSlideObj.html ="(.*?)";/g);
//   if (curSlideObjs) {
//     for (let element of curSlideObjs) {
//       const unicodes = element.match(/\\u\w{4}/g);
//       if (unicodes) {
//         for (let unicode of unicodes) {
//           element = element.replace(unicode, eval('"' + unicode + '"'));
//         }
//       }
//       element = element.substring(element.indexOf('"') + 1, element.lastIndexOf('"'));
//       element = element.replace(/\\n/g, '').replace(/\\t/g, '');
//       element = element.replace(/\\/g, '');
//       $('div.one-page').append($(element));
//     }
//   }
// };

// preprocess = ($, options) => { // buzzfeed.com
//   $('div.video-embed').each((index, element) => {
//     const node = $(element);
//     const url = node.attr('data-src');
//     if (url) {
//       const iframe = '<iframe src="http:' + url + '"></iframe>';
//       node.append(iframe);
//     }
//   });
// };

// postprocess = (content, $) => { // buzzfeed.com
//   content.find('blockquote.bf-tweet').addClass('twitter-tweet');
//   if (content.find('blockquote.twitter-tweet').length) {
//     content.prepend($('<script async src="http://platform.twitter.com/widgets.js" charset="utf-8"></script>'));
//   }
// };

// postprocess = (content, $) => { // businessoffashion.com
//   const header = $('div.article-header-fullscreen,div.article-header-collection');
//   if (!header || !header.length) {
//     return;
//   }
//   header.find('p.sans-serif').remove();
//   content.prepend(header);
// };

// postprocess = (content, $) => { // fastcoexist.com fastcocreate.com fastcompany.com
//   const header = $('section#page-jumbotron');
//   if (!header || !header.length) {
//     return;
//   }
//   content.prepend(header);
// };

// postprocess = (content, $) => { // qz.com
//   const header = $('figure.featured-image');
//   console.log(header.length);
//   if (!header || !header.length) {
//     return;
//   }
//   content.prepend(header);
// };

// postprocess = (content, $) => { // uncrate.com
//   const header = $('div.article-single div.image-wrapper');
//   if (!header || !header.length) {
//     return;
//   }
//   content.prepend(header);
// };

// postprocess = (content, $) => { // hitfix.com
//   const header = $('div.photo-headline,div.photobox');
//   if (!header || !header.length) return;
//   header.find('script').remove();
//   content.prepend(header);
// };

// asyncprocess = (url, options, callback) => { // nytimes.com
//   return new Promise(async (resolve, reject) => {
//     fetchUrl(url, (err, res, buf) => {
//       if (err) return reject(err);
//       try {
//         const NYT_S = res.cookieJar.cookies['NYT-S'][0].value;
//         const cookies = new fetch.CookieJar(); // for sharing cookies between requests
//         cookies.setCookie('NYT-S=' + NYT_S);
//         options.cookieJar = cookies;
//         resolve();
//       } catch (e) {
//         reject(e);
//       }
//     });
//   });
// };

// const cookies = new fetch.CookieJar(); // ftalphaville.ft.com
// cookies.setCookie('FTSession=z0DfoEDB30tE05gc_hy9QUSvzwAAAVCoUhZxwg.MEYCIQCFMa6ib5AVd3F2QLNRNpGUD149D8FIom6j1zBmGZk1VgIhANEI_PqvcC_rxtnJBCQ4JefaEfeYDj4J09hiLn00nvxR');

// const cookies = new fetch.CookieJar(); // nytimes.com
// cookies.setCookie('NYT-S=1MV8ckDq5LmKiWV.m38YQ6ThyL0.sUyRAqqn72AbNyG57EzFMbTqAqbco9BPSkcIjNv63KVQkVAFgGr92n6XmLkhqLI.iCWGexReGeft6bZfc74hwCYxQr//QHdxuOyqnH/f3cbcflvjYK1yNKxqVry000');

const hostnameParse = {
  'www.businessinsider.com': 'www.businessinsider.com.au'
};

const maybeImgsAttr = [ // 可能是图片的属性
  'data-uproxx-animated-gif',
  'data-lightbox-image-url',
  'pagespeed_lazy_src',
  'rel:bf_image_src',
  'data-src-medium',
  'data-src-small',
  'data-asset-url',
  'data-original',
  'data-lazy-src',
  'data-imagesrc',
  'data-srcset',
  'data-medsrc',
  'data-smsrc',
  'data-lgsrc',
  'data-cfsrc',
  'data-src',
  'load-src',
  'href',
  'src',
  'srcset'
];

const nodesToRemove = [ // 需要删除的标签
  'svg', // svg
  'meta', // 元数据
  'link', // 样式链接
  'style', // 样式
  'video', // 视频
  'input', // 输入框
  'button', // 按钮
  'object', // 对象
  'canvas', // 画布
  'select', // 下拉框
  'textarea', // 文本框
  'iframe:not([src])', // 内嵌模块
  'div#bottom', // menshealth.com
  'div#pinned', // engadget.com
  'div#respond', // thesartorialist.com
  'div#sidebar', // demilked.com
  'div#macro-fc20', // fastcodesign.com
  'div#newsletter', // moviefone.com
  'div#page-title', // 页面标题
  'div#post-river', // businessinsider.com
  'div#tags h3.msg', // abduzeedo.com
  'div#gdgt-wrapper', // engadget.com
  'div#primaryaudio', // npr.org
  'div#disqus_thread', // primermagazine.com
  'div#latestOnWired', // wired.co.uk
  'div#end-of-content', // hitfix.com
  'div#off-screen-nav', // vh1.com
  'div#sidebar-wrapper', // fastcompany.com
  'div#ad-standard-wrap', // npr.org
  'div#comments-wrapper', // uproxx.com
  'div#SettingsContents', // moviefone.com
  'div#SettingsContainer', // moviefone.com
  'div#article-social-top', // indiewire.com
  'div#single-post-related', // uproxx.com
  'div#article-most-popular', // theatlantic.com
  'div#node-basic-newsletter', // mensfitness.com
  'div.fb-box', // facebook
  'div.ad-hide', // 隐藏广告
  'div.loading', // 加载中
  'div.rweb-ad', // washingtonpost.com
  'div.top-bar', // mensfitness.com
  'div.comments', // wired.co.uk
  'div.articleSM', // 分享模块
  'div.m-linkset', // theverge.com
  'div.read-more', // huffingtonpost.com
  'div.tag-cloud', // huffingtonpost.com
  'div.audiopromo', // npr.org
  'div.fone-finds', // moviefone.com
  'div.fout_guard', // fout 守卫
  'div.navigation', // macrumors.com
  'div.right_rail', // menshealth.com
  'div.right-side', // indiewire.com
  'div.th-reverse', // engadget.com
  'div.buttonGroup', // 按钮组
  'div.bn-mo-tests', // 测试模块
  'div.itemRelated', // 相关文章
  'div.ks-see-also', // 也可以看看
  'div.most-shared', // 大多数分享
  'div.inline-share', // uproxx.com
  'div.post-actions', // ft.com
  'div.PopularPosts', // arkinspace.com
  'div.article-extra', // techcrunch.com
  'div.article_share', // nbcnews.com
  'div.comments-main', // 评论
  'div.control-panel', // 控制面板
  'div.give-feedback', // macrumors.com
  'div.list-comments', // thesartorialist.com
  'div.related-posts', // hypebeast.com
  'div.usi-preloader', // uproxx.com
  'div.hide-for-small', // hbr.org
  'div.like-post-left', // demilked.com
  'div.menu-nav-modal', // techcrunch.com
  'div.more-galleries', // mensfitness.com
  'div.o-aside-posts', // engadget.com
  'div.postActionsBar', // medium.com
  'div.ssw-section-ad', // cntraveler.com
  'div.video-headline', // hitfix.com
  'div.article-actions', // food52.com
  'div.article-sidebar', // avclub.com
  'div.cnt-page-header', // cntraveler.com
  'div.content__header', // theguardian.com
  'div.panes-container', // huffingtonpost.com
  'div.announcement-bar', // techcrunch.com
  'div.fyre-post-button', // timeout.com
  'div.header-container', // avclub.com
  'div.js-owl-filmstrip', // cnn.com
  'div.m-entry__sidebar', // theverge.com
  'div.post-dropdown-ct', // gawker.com
  'div.recirc-accordion', // techcrunch.com
  'div.bloc-related-post', // thesartorialist.com
  'div.boilerplate-after', // venturebeat.com
  'div.slideshow-control', // dezeen.com
  'div.ami-slideshow-last', // mensfitness.com
  'div.archive-pagination', // nomadicmatt.com
  'div.contributor-byline', // techcrunch.com
  'div.crunchbase-cluster', // techcrunch.com
  'div.dropdown-container', // engadget.com
  'div.expand-mobile-fold', // demilked.com
  'div.newsletters-signup', // techcrunch.com
  'div.recommended-widget', // vice.com
  'div.fyre-follow-button', // timeout.com
  'div.region-page-bottom', // menshealth.com
  'div.fyre-comment-stream', // timeout.com
  'div.fyre-format-toolbar', // timeout.com
  'div.grading-interactive', // snagfilms.com
  'div.js-reset-video-once', // kickstarter.com
  'div.article-copy--footer', // 文章脚注
  'div.article-list-wrapper', // uncrate.com
  'div.inline-share-wrapper', // nytimes.com
  'div.rail-collection-main', // rail 广告
  'div.gallery-overlay-outter', // 外部相册
  'div.article-related-coverage', // nytimes.com
  'div.js-top-android-news-swarm', // buzzfeed.com
  'div.recommended-photo-article', // theatlantic.com
  'div.forces-video-controls_hide', // kickstarter.com
  'div.article-cover-extra-wrapper', // theatlantic.com
  'div.film-recommendations-module', // snagfilms.com
  'div.slide-show--slide__template', // 幻灯片模板
  'div.sponsored-post-list-wrapper', // uncrate.com
  'div.module-top-pathing--container', // esquire.com
  'div.slide-show--slide__template--video', // 幻灯片模板-视频
  'div[role="complementary"]', // thesartorialist.com
  'div[data-params="region=persistent-banner"]', // hbr.org
  'div[data-params="document=inside-the-store"]', // hbr.org
  'div[data-params="document=commerce-flyout-text"]', // hbr.org
  'a.add-post', // demilked.com
  'a.more-link', // nomadicmatt.com
  'a.slider-arr', // techcrunch.com
  'a.button-link', // washingtonpost.com
  'aside#hot-buzz-stats', // buzzfeed.com
  'aside#reactions-related', // buzzfeed.com
  'aside.sidebar', // core77.com
  'aside.app_promo', // buzzfeed.com
  'aside.side_content', // timeout.com
  'aside.cookie-notice', // buzzfeed.com
  'aside.readNextArticles', // wired.co.uk
  'article.unloaded', // washingtonpost.com
  'img.video-icon', // espn.go.com
  'ins.adsbygoogle', // google 广告
  'li#MoreFromPromotionButtonHolder', // wired.co.uk
  'li.share', // npr.org
  'ol.comment-list', // nomadicmatt.com
  'ul#user-actions-dropdown', // engadget.com
  'ul#related_feed', // 相关 feed
  'ul.cn-list-hierarchical-small-horizontal', // cnn.com
  'ul.cn-related-stories-topic', // cnn.com
  'ul.cn-list-small-horizontal', // cnn.com
  'ul.cn-list-xs', // cnn.com
  'ul.stream-utility', // hbr.org
  'ul.fyre-box-list', // timeout.com
  'ul.golden_layout', // core77.com
  'ul.commentlist', // smittenkitchen.com
  'p.postmetadata', // smittenkitchen.com
  'p.see-all', // engadget.com
  'p.film-synopsis-toggle', // snagfilms.com
  'p#skip-link', // menshealth.com
  'span.hide', // 隐藏内容
  'span.next-item', // menshealth.com
  'span.js-player-shell', // nbcnews.com
  'span.gallery-counters', // mensfitness.com
  'section#single_bottom_posts', // primermagazine.com
  'section#featured-gallery', // ew.com
  'section#video-categories', // mashable.com
  'section.content-sharing', // food52.com
  'section.extra-content', // huffingtonpost.com
  'section.crunchreport', // techcrunch.com
  'section.flipbook', // vh1.com
  'section.mod-27', // foxnews.com
  '.copyright', // 版权信息
  '.robots-nocontent', // 非内容模块
  'header#site-header-container', // theatlantic.com
  'header.article-header div.tags', // techcrunch.com
  'header.header-context-news', // techcrunch.com
  'header.entry-headline', // 头部信息
  'header.m-header', // theverge.com
  'header[role="banner"]', // engadget.com
  'footer,#footer,.footer' // 尾部信息
];

const noChdToRemove = [ // 没有子节点的时候需要删除的标签
  'div',
  'li'
];

const options = {
  headers: { 'User-Agent': userAgent },
  hostnameParse: hostnameParse,
  maybeImgsAttr: maybeImgsAttr,
  nodesToRemove: nodesToRemove,
  noChdToRemove: noChdToRemove,
  // cookieJar: cookies
};
if (urlprocess) options.urlprocess = urlprocess;
if (preprocess) options.preprocess = preprocess;
if (postprocess) options.postprocess = postprocess;
if (asyncprocess) options.asyncprocess = asyncprocess;

const start = new Date();

read(url, options).then(
  result => {
    const { res, article } = result;
    if (res.status != 200) return console.error('status:', res.status);
    if (!article) return console.error('Empty article:', article);

    console.log('res:', res); // Response Object from fetchUrl Lib
    console.log('contentType:', res.responseHeaders['content-type']);

    console.log('dom:', article.dom); // DOM
    console.log('title:', article.title); // Title
    console.log('desc:', article.getDesc(300)); // Description Article
    article.images.then(images => console.log('images:', images)); // Article's Images

    fs.writeFile('article.html', article.html, err => { // HTML Source Code
      if (err) return console.error('error:', err);
      console.log('article(%d) is saved!', article.html.length, new Date() - start);
    });
    fs.writeFile('content.html', article.content, err => { // Main Article
      if (err) return console.error('error:', err);
      console.log('content(%d) is saved!', article.content.length, new Date() - start);
    });

    const sources = [
      { selector: 'script[src]', attr: 'async', val: 'async' },
      { selector: 'link[rel="stylesheet"]', attr: 'href', tag: 'style' }
    ];
    article.getHtmls(sources).then(
      htmls => { // HTML Source Code by replace css files
        fs.writeFile('sources.html', htmls, err => {
          if (err) return console.error('error:', err);
          console.log('sources(%d) is saved!', article.html.length, new Date() - start);
        })
      }
    );

    article.iframes.then(
      iframes => { // Article's Iframes
        iframes.forEach((iframe, index) => {
          fs.writeFile('iframe/' + index + '.html', iframe.buf, err => {
            if (err) return console.error('error:', err);
            console.log('%s(%d) is saved!', iframe.url, index, new Date() - start);
          });
        });
      }
    );
  },
  err => console.error(err)
);