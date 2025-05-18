"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { StpData, useStpData } from "../utils/stp-data";
import { Droplets, Gauge, BarChart2, LineChart2, TrendingUp, Truck, PieChart as PieChartIcon, Calendar } from "lucide-react";

// Color Palette from the existing dashboard
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#694E5F";
const ACCENT_COLOR = "#8ACCD5";
const INFO_COLOR = "#5BC0DE";
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFB347";
const DANGER_COLOR = "#FF6B6B";
const CHART_COLORS = [ACCENT_COLOR, BASE_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR];

// Static data from the provided table
const rawStpData = `Date:\tNumber of Tankers Discharged:\tExpected Tanker Volume (m³) (20 m3)\tDirect In line Sewage (MB)\tTotal Inlet Sewage Received from (MB+Tnk) -m³ \tTotal Treated Water Produced - m³\tTotal TSE Water Output to Irrigation - m³
1/7/2024\t10\t200\t139\t339\t385\t340
2/7/2024\t14\t280\t246\t526\t519\t458
3/7/2024\t13\t260\t208\t468\t479\t425
4/7/2024\t11\t220\t244\t464\t547\t489
5/7/2024\t15\t300\t265\t565\t653\t574
6/7/2024\t14\t280\t222\t502\t552\t492
7/7/2024\t13\t260\t289\t549\t575\t498
8/7/2024\t16\t320\t212\t532\t587\t515
8/7/2024\t16\t320\t219\t539\t589\t515
9/7/2024\t13\t260\t272\t532\t586\t519
10/7/2024\t12\t240\t253\t493\t542\t462
12/7/2024\t12\t240\t266\t506\t533\t468
12/7/2024\t16\t320\t258\t578\t654\t580
13/07/2024\t10\t200\t279\t479\t464\t402
13/07/2024\t10\t200\t279\t479\t464\t402
14/07/2024\t13\t260\t226\t486\t506\t448
15/07/2024\t6\t120\t271\t391\t482\t418
16/07/2024\t18\t360\t216\t576\t670\t600
17/07/2024\t12\t240\t266\t506\t344\t300
18/07/2024\t8\t160\t209\t369\t585\t517
19/07/2024\t15\t300\t314\t614\t687\t605
20/07/2024\t12\t240\t243\t483\t536\t465
21/07/2024\t13\t260\t241\t501\t504\t455
22/07/2024\t13\t260\t220\t480\t549\t492
23/07/2024\t16\t320\t248\t568\t611\t535
24/07/2024\t18\t360\t203\t563\t599\t528
25/07/2024\t14\t280\t135\t415\t517\t444
26/07/2024\t18\t360\t224\t584\t650\t570
27/07/2024\t10\t200\t337\t537\t475\t414
28/07/2024\t12\t240\t213\t453\t512\t449
29/07/2024\t19\t380\t305\t685\t671\t577
30/07/2024\t13\t260\t267\t527\t668\t582
31/07/2024\t17\t340\t266\t606\t613\t529
1/8/2024\t15\t300\t242\t542\t601\t528
2/8/2024\t15\t300\t360\t660\t676\t590
3/8/2024\t13\t260\t233\t493\t544\t474
4/8/2024\t13\t260\t250\t510\t571\t497
5/8/2024\t13\t260\t255\t515\t574\t500
6/8/2024\t16\t320\t284\t604\t643\t554
7/8/2024\t19\t380\t110\t490\t608\t516
8/8/2024\t17\t340\t302\t642\t610\t524
9/8/2024\t12\t240\t291\t531\t630\t550
10/8/2024\t13\t260\t265\t525\t583\t499
11/8/2024\t11\t220\t339\t559\t554\t483
12/8/2024\t12\t240\t229\t469\t606\t531
13/08/2024\t12\t240\t219\t459\t569\t499
14/08/2024\t11\t220\t289\t509\t525\t492
15/08/2024\t13\t260\t281\t541\t579\t502
16/08/2024\t11\t220\t328\t548\t591\t516
17/08/2024\t14\t280\t232\t512\t466\t414
18/08/2024\t13\t260\t218\t478\t591\t516
19/08/2024\t11\t220\t210\t430\t529\t470
20/08/2024\t13\t260\t261\t521\t579\t495
21/08/2024\t12\t240\t238\t478\t586\t500
22/08/2024\t13\t260\t292\t552\t486\t437
23/08/2024\t12\t240\t209\t449\t564\t478
24/08/2024\t9\t180\t281\t461\t581\t505
25/08/2024\t8\t160\t209\t369\t488\t420
26/08/2024\t8\t160\t249\t409\t371\t291
27/08/2024\t8\t160\t231\t391\t453\t417
28/08/2024\t9\t180\t355\t535\t642\t557
29/08/2024\t9\t180\t188\t368\t413\t360
30/08/2024\t14\t280\t346\t626\t624\t551
31/08/2024\t9\t180\t285\t465\t535\t473
1/9/2024\t11\t220\t257\t477\t504\t441
2/9/2024\t5\t100\t270\t370\t355\t317
3/9/2024\t9\t180\t261\t441\t540\t481
4/9/2024\t4\t80\t252\t332\t358\t300
5/9/2024\t6\t120\t330\t450\t547\t483
6/9/2024\t14\t280\t209\t489\t518\t474
7/9/2024\t12\t240\t319\t559\t568\t504
8/9/2024\t9\t180\t299\t479\t478\t422
9/9/2024\t9\t180\t283\t463\t515\t459
10/9/2024\t7\t140\t282\t422\t453\t396
11/9/2024\t12\t240\t279\t519\t566\t495
12/9/2024\t10\t200\t257\t457\t489\t437
13/09/2024\t14\t280\t284\t564\t671\t611
14/09/2024\t5\t100\t243\t343\t357\t311
15/09/2024\t7\t140\t208\t348\t354\t307
16/09/2024\t8\t160\t283\t443\t412\t366
17/09/2024\t8\t160\t143\t303\t352\t314
18/09/2024\t8\t160\t220\t380\t424\t371
19/09/2024\t9\t180\t198\t378\t441\t401
20/09/2024\t14\t280\t231\t511\t581\t519
20/09/2024\t14\t280\t231\t511\t581\t519
21/09/2024\t9\t180\t254\t434\t452\t391
22/09/2024\t9\t180\t190\t370\t355\t317
23/09/2024\t5\t100\t191\t291\t292\t262
24/09/2024\t8\t160\t302\t462\t555\t498
25/09/2024\t10\t200\t190\t390\t364\t319
26/09/2024\t7\t140\t212\t352\t386\t342
27/09/2024\t11\t220\t269\t489\t519\t467
28/09/2024\t8\t160\t323\t483\t539\t469
29/09/2024\t9\t180\t268\t448\t557\t503
30/09/2024\t6\t120\t304\t424\t388\t350
30/09/2024\t6\t120\t304\t424\t388\t350
1/10/2024\t5\t100\t305\t405\t482\t417
2/10/2024\t8\t160\t273\t433\t419\t361
3/10/2024\t9\t180\t295\t475\t575\t520
4/10/2024\t15\t300\t247\t547\t602\t506
5/10/2024\t8\t160\t362\t522\t555\t515
6/10/2024\t8\t160\t297\t457\t425\t365
7/10/2024\t11\t220\t324\t544\t592\t533
8/10/2024\t11\t220\t269\t489\t524\t462
9/10/2024\t11\t220\t312\t532\t637\t568
10/10/2024\t11\t220\t274\t494\t559\t491
11/10/2024\t12\t240\t309\t549\t541\t438
12/10/2024\t8\t160\t351\t511\t526\t512
13/10/2024\t6\t120\t212\t332\t405\t345
14/10/2024\t7\t140\t369\t509\t601\t548
15/10/2024\t10\t200\t381\t581\t569\t489
16/10/2024\t8\t160\t388\t548\t607\t538
17/10/2024\t11\t220\t416\t636\t659\t575
18/10/2024\t10\t200\t365\t565\t677\t597
19/10/2024\t8\t160\t429\t589\t583\t509
20/10/2024\t10\t200\t337\t537\t614\t542
21/10/2024\t12\t240\t299\t539\t585\t513
22/10/2024\t9\t180\t345\t525\t606\t528
23/10/2024\t11\t220\t372\t592\t614\t532
24/10/2024\t11\t220\t326\t546\t522\t442
25/10/2024\t9\t180\t423\t603\t601\t524
26/10/2024\t12\t240\t348\t588\t636\t557
27/10/2024\t6\t120\t403\t523\t594\t487
28/10/2024\t9\t180\t415\t595\t586\t535
29/10/2024\t7\t140\t371\t511\t613\t535
30/10/2024\t9\t180\t363\t543\t583\t506
31/10/2024\t7\t140\t437\t577\t577\t500
1/11/2024\t5\t100\t376\t476\t553\t476
2/11/2024\t8\t160\t393\t553\t609\t513
3/11/2024\t8\t160\t338\t498\t494\t419
4/11/2024\t6\t120\t310\t430\t542\t480
5/11/2024\t9\t180\t301\t481\t570\t489
6/11/2024\t7\t140\t231\t371\t423\t351
7/11/2024\t12\t240\t369\t609\t516\t449
8/11/2024\t11\t220\t296\t516\t621\t538
9/11/2024\t13\t260\t257\t517\t581\t500
10/11/2024\t6\t120\t344\t464\t573\t495
11/11/2024\t11\t220\t229\t449\t588\t505
12/11/2024\t8\t160\t306\t466\t567\t494
13/11/2024\t8\t160\t386\t546\t578\t495
14/11/2024\t9\t180\t324\t504\t567\t484
15/11/2024\t6\t120\t369\t489\t572\t488
16/11/2024\t9\t180\t340\t520\t559\t474
17/11/2024\t5\t100\t361\t461\t448\t363
18/11/2024\t10\t200\t275\t475\t534\t466
19/11/2024\t8\t160\t319\t479\t567\t484
20/11/2024\t6\t120\t345\t465\t579\t494
21/11/2024\t6\t120\t358\t478\t551\t461
22/11/2024\t7\t140\t354\t494\t574\t488
23/11/2024\t7\t140\t277\t417\t518\t427
24/11/2024\t4\t80\t307\t387\t507\t434
25/11/2024\t8\t160\t400\t560\t569\t474
26/11/2024\t10\t200\t301\t501\t561\t471
27/11/2024\t9\t180\t344\t524\t539\t447
28/11/2024\t7\t140\t347\t487\t548\t456
29/11/2024\t6\t120\t283\t403\t560\t464
30/11/2024\t6\t120\t400\t520\t520\t427
1/12/2024\t5\t100\t381\t481\t542\t447
2/12/2024\t6\t120\t376\t496\t526\t442
3/12/2024\t5\t100\t362\t462\t539\t442
4/12/2024\t5\t100\t257\t357\t537\t449
5/12/2024\t9\t180\t415\t595\t551\t455
6/12/2024\t4\t80\t357\t437\t484\t403
7/12/2024\t4\t80\t376\t456\t550\t462
8/12/2024\t5\t100\t362\t462\t570\t474
9/12/2024\t6\t120\t309\t429\t531\t450
10/12/2024\t8\t160\t293\t453\t493\t412
11/12/2024\t5\t100\t396\t496\t586\t501
12/12/2024\t5\t100\t341\t441\t554\t461
13/12/2024\t8\t160\t281\t441\t507\t439
14/12/2024\t8\t160\t346\t506\t585\t515
15/12/2024\t7\t140\t361\t501\t493\t414
16/12/2024\t6\t120\t318\t438\t541\t468
17/12/2024\t9\t180\t373\t553\t580\t476
18/12/2024\t7\t140\t356\t496\t581\t498
19/12/2024\t8\t160\t382\t542\t560\t471
20/12/2024\t8\t160\t280\t440\t585\t488
21/12/2024\t6\t120\t382\t502\t575\t475
22/12/2024\t7\t140\t396\t536\t606\t513
23/12/2024\t7\t140\t308\t448\t587\t497
24/12/2024\t4\t80\t446\t526\t542\t449
25/12/2024\t6\t120\t397\t517\t614\t513
26/12/2024\t8\t160\t371\t531\t590\t495
27/12/2024\t5\t100\t442\t542\t621\t517
28/12/2024\t7\t140\t401\t541\t611\t524
29/12/2024\t7\t140\t388\t528\t605\t511
30/12/2024\t7\t140\t385\t525\t598\t509
31/12/2024\t4\t80\t455\t535\t600\t506
1/1/2025\t3\t60\t433\t493\t601\t504
2/1/2025\t3\t60\t468\t528\t600\t491
3/1/2025\t4\t80\t370\t450\t577\t494
4/1/2025\t4\t80\t427\t507\t587\t486
5/1/2025\t4\t80\t393\t473\t532\t445
6/1/2025\t4\t80\t365\t445\t572\t472
7/1/2025\t7\t140\t409\t549\t610\t506
8/1/2025\t5\t100\t411\t511\t526\t454
9/1/2025\t6\t120\t394\t514\t589\t494
10/1/2025\t8\t160\t375\t535\t637\t528
11/1/2025\t3\t60\t376\t436\t552\t459
12/1/2025\t6\t120\t353\t473\t508\t419
13/01/2025\t6\t120\t336\t456\t581\t489
14/01/2025\t8\t160\t353\t513\t594\t502
15/01/2025\t8\t160\t334\t494\t593\t504
16/01/2025\t10\t200\t309\t509\t521\t438
17/01/2025\t7\t140\t362\t502\t595\t518
18/01/2025\t8\t160\t377\t537\t608\t526
19/01/2025\t8\t160\t400\t560\t605\t523
20/01/2025\t8\t160\t357\t517\t595\t503
21/01/2025\t8\t160\t392\t552\t602\t517
22/01/2025\t6\t120\t362\t482\t576\t498
23/01/2025\t6\t120\t357\t477\t599\t526
24/01/2025\t7\t140\t364\t504\t606\t499
25/01/2025\t8\t160\t383\t543\t601\t523
26/01/2025\t8\t160\t349\t509\t605\t516
27/01/2025\t8\t160\t359\t519\t601\t515
28/01/2025\t11\t220\t362\t582\t607\t519
29/01/2025\t9\t180\t341\t521\t615\t529
30/01/2025\t9\t180\t339\t519\t598\t510
31/01/2025\t7\t140\t373\t513\t619\t526
1/2/2025\t8\t160\t351\t511\t527\t456
2/2/2025\t9\t180\t331\t511\t505\t423
3/2/2025\t8\t160\t336\t496\t584\t489
4/2/2025\t9\t180\t365\t545\t578\t484
5/2/2025\t6\t120\t407\t527\t582\t482
6/2/2025\t8\t160\t322\t482\t588\t493
7/2/2025\t6\t120\t365\t485\t576\t482
8/2/2025\t4\t80\t451\t531\t582\t478
9/2/2025\t9\t180\t341\t521\t586\t489
10/2/2025\t6\t120\t394\t514\t594\t495
11/2/2025\t7\t140\t406\t546\t589\t501
12/2/2025\t5\t100\t428\t528\t614\t527
13/02/2025\t4\t80\t423\t503\t620\t525
14/02/2025\t4\t80\t474\t554\t614\t527
15/02/2025\t4\t80\t458\t538\t627\t533
16/02/2025\t5\t100\t461\t561\t630\t539
17/02/2025\t5\t100\t444\t544\t628\t539
18/02/2025\t5\t100\t417\t517\t609\t520
19/02/2025\t4\t80\t459\t539\t582\t489
20/02/2025\t2\t40\t442\t482\t553\t459
21/02/2025\t1\t20\t458\t478\t518\t419
24/02/2025\t0\t0\t491\t491\t437\t361
25/02/2025\t0\t0\t334\t334\t247\t159
26/02/2025\t0\t0\t342\t342\t272\t226
27/02/2025\t0\t0\t502\t502\t595\t512
28/02/2025\t2\t40\t458\t498\t571\t468
1/3/2025\t0\t0\t487\t487\t583\t476
2/3/2025\t1\t20\t473\t493\t592\t514
3/3/2025\t1\t20\t477\t497\t598\t517
4/3/2025\t5\t100\t461\t561\t600\t516
5/3/2025\t3\t60\t443\t503\t608\t521
6/3/2025\t6\t120\t424\t544\t607\t530
7/3/2025\t5\t100\t452\t552\t621\t532
8/3/2025\t6\t120\t450\t570\t617\t531
9/3/2025\t4\t80\t388\t468\t607\t521
10/3/2025\t6\t120\t480\t600\t610\t524
11/3/2025\t3\t60\t476\t536\t607\t511
12/3/2025\t6\t120\t391\t511\t601\t509
13/03/2025\t3\t60\t472\t532\t606\t508
14/03/2025\t6\t120\t399\t519\t609\t507
15/03/2025\t2\t40\t494\t534\t602\t504
16/03/2025\t4\t80\t434\t514\t591\t494
17/03/2025\t4\t80\t442\t522\t591\t500
18/03/2025\t5\t100\t369\t469\t578\t480
19/03/2025\t3\t60\t466\t526\t565\t467
20/03/2025\t4\t80\t424\t504\t610\t511
21/03/2025\t4\t80\t425\t505\t619\t519
22/03/2025\t5\t100\t435\t535\t616\t523
23/03/2025\t6\t120\t466\t586\t627\t541
24/03/2025\t6\t120\t422\t542\t630\t540
25/03/2025\t5\t100\t488\t588\t613\t522
26/03/2025\t8\t160\t353\t513\t631\t541
27/03/2025\t7\t140\t513\t653\t627\t538
28/03/2025\t3\t60\t478\t538\t631\t546
29/03/2025\t4\t80\t559\t639\t623\t534
30/03/2025\t3\t60\t471\t531\t640\t558
31/03/2025\t3\t60\t471\t531\t640\t558
1/4/2025\t5\t100\t485\t585\t639\t551
2/4/2025\t6\t120\t475\t595\t650\t560
3/4/2025\t5\t100\t473\t573\t634\t556
4/4/2025\t4\t80\t529\t609\t656\t573
5/4/2025\t5\t100\t495\t595\t648\t569
6/4/2025\t6\t120\t439\t559\t658\t579
7/4/2025\t7\t140\t410\t550\t653\t574
8/4/2025\t8\t160\t481\t641\t648\t562
9/4/2025\t5\t100\t478\t578\t656\t568
10/4/2025\t6\t120\t497\t617\t654\t558
11/4/2025\t6\t120\t456\t576\t671\t582
12/4/2025\t8\t160\t460\t620\t660\t576
13/04/2025\t5\t100\t517\t617\t676\t595
14/04/2025\t8\t160\t441\t601\t673\t592
15/04/2025\t7\t140\t421\t561\t641\t557
16/04/2025\t8\t160\t483\t643\t674\t590
17/04/2025\t6\t120\t444\t564\t665\t581
18/04/2025\t7\t140\t449\t589\t660\t577
19/04/2025\t7\t140\t449\t589\t660\t577
19/04/2025\t8\t160\t446\t606\t647\t563
20/04/2025\t7\t140\t514\t654\t647\t553
21/04/2025\t6\t120\t404\t524\t635\t524
22/04/2025\t3\t60\t525\t585\t647\t565
23/04/2025\t5\t100\t489\t589\t688\t578
24/04/2025\t6\t120\t486\t606\t695\t594
25/04/2025\t6\t120\t478\t598\t712\t609
26/04/2025\t6\t120\t518\t638\t706\t584
27/04/2025\t5\t100\t480\t580\t714\t603
28/04/2025\t5\t100\t473\t573\t716\t607
29/04/2025\t9\t180\t444\t624\t710\t602
30/04/2025\t9\t180\t462\t642\t710\t646
1/5/2025\t9\t180\t451\t631\t717\t631
2/5/2025\t11\t220\t471\t691\t703\t626
3/5/2025\t9\t180\t496\t676\t681\t608
4/5/2025\t8\t160\t472\t632\t709\t635
5/5/2025\t9\t180\t365\t545\t672\t593
6/5/2025\t11\t220\t374\t594\t657\t569
7/5/2025\t10\t200\t445\t645\t700\t627
8/5/2025\t12\t240\t351\t591\t666\t593
9/5/2025\t10\t200\t455\t655\t667\t592
10/5/2025\t10\t200\t463\t663\t705\t630
11/5/2025\t8\t160\t464\t624\t725\t646
12/5/2025\t9\t180\t489\t669\t623\t645
13/05/2025\t9\t180\t466\t646\t674\t592
14/05/2025\t11\t220\t467\t687\t720\t647
15/05/2025\t10\t200\t432\t632\t708\t626
16/05/2025\t9\t180\t479\t659\t725\t646`;

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label, unit = "m³" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#4E4456] shadow-md rounded-md">
        <p className="font-medium mb-1 text-[#4E4456]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {Number(entry.value).toLocaleString()} {unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// KPI Card Component
function KPICard({ 
  title, 
  value, 
  unit, 
  icon, 
  trendValue, 
  trendLabel 
}: { 
  title: string; 
  value: string | number; 
  unit?: string;
  icon?: React.ReactNode;
  trendValue?: number;
  trendLabel?: string;
}) {
  const formattedValue = typeof value === 'number' 
    ? (value > 1000 ? (value / 1000).toFixed(1) + 'k' : value.toLocaleString()) 
    : value;
  
  const trendColor = trendValue ? (trendValue > 0 ? 'text-green-500' : 'text-red-500') : '';
  const trendIcon = trendValue ? (trendValue > 0 ? '↑' : '↓') : '';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-800">{formattedValue}</span>
        {unit && <span className="ml-1 text-gray-500">{unit}</span>}
      </div>
      {trendValue && (
        <div className={`flex items-center mt-2 text-sm ${trendColor}`}>
          <span>{trendIcon} {Math.abs(trendValue).toFixed(1)}%</span>
          <span className="ml-1 text-gray-500">vs previous {trendLabel || 'period'}</span>
        </div>
      )}
    </div>
  );
}

export default function StpPlantDashboard() {
  const { daily, monthly } = useStpData(rawStpData);
  const isMobile = useMobile();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  
  // Find the most recent month in the data
  useEffect(() => {
    if (monthly.length > 0 && !selectedMonth) {
      setSelectedMonth(`${monthly[monthly.length - 1].year}-${monthly[monthly.length - 1].month}`);
    }
  }, [monthly, selectedMonth]);

  // Calculate monthly KPIs
  const monthlyKPIs = useMemo(() => {
    if (!selectedMonth || !monthly.length) return null;
    
    const currentMonthIndex = monthly.findIndex(
      m => `${m.year}-${m.month}` === selectedMonth
    );
    
    if (currentMonthIndex === -1) return null;
    
    const currentMonth = monthly[currentMonthIndex];
    const previousMonth = currentMonthIndex > 0 ? monthly[currentMonthIndex - 1] : null;
    
    // Calculate trends
    const getTrend = (current: number, previous: number | undefined) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };
    
    return {
      currentMonth,
      tankerTrips: {
        value: currentMonth.totalTankers,
        trend: getTrend(currentMonth.totalTankers, previousMonth?.totalTankers)
      },
      inletSewage: {
        value: currentMonth.totalInletSewage,
        trend: getTrend(currentMonth.totalInletSewage, previousMonth?.totalInletSewage)
      },
      treatedWater: {
        value: currentMonth.totalTreatedWater,
        trend: getTrend(currentMonth.totalTreatedWater, previousMonth?.totalTreatedWater)
      },
      tseOutput: {
        value: currentMonth.totalTseOutput,
        trend: getTrend(currentMonth.totalTseOutput, previousMonth?.totalTseOutput)
      },
      efficiency: {
        value: currentMonth.avgEfficiency,
        trend: getTrend(currentMonth.avgEfficiency, previousMonth?.avgEfficiency)
      },
      utilizationRate: {
        value: currentMonth.utilizationRate,
        trend: getTrend(currentMonth.utilizationRate, previousMonth?.utilizationRate)
      }
    };
  }, [selectedMonth, monthly]);

  // Filter daily data for the selected month
  const filteredDailyData = useMemo(() => {
    if (!selectedMonth || !daily.length) return [];
    
    const [year, month] = selectedMonth.split('-');
    return daily.filter(record => {
      const dateParts = record["Date:"].split('/');
      const recordMonth = parseInt(dateParts[1]);
      const recordYear = parseInt(dateParts[2]);
      
      return recordYear === parseInt(year) && 
             (typeof month === 'string' ? 
               recordMonth === new Date(0, 0, 1, 0, 0, 0, 0).toLocaleString('default', { month: 'numeric' }) : 
               true);
    });
  }, [selectedMonth, daily]);

  // Data for daily trend chart
  const dailyTrendData = useMemo(() => {
    return filteredDailyData.map(record => {
      const dateParts = record["Date:"].split('/');
      return {
        date: `${dateParts[0]}/${dateParts[1]}`,
        inlet: record["Total Inlet Sewage Received from (MB+Tnk) -m³"],
        treated: record["Total Treated Water Produced - m³"],
        tseOutput: record["Total TSE Water Output to Irrigation - m³"],
      };
    });
  }, [filteredDailyData]);

  // Data for tanker vs direct sewage source breakdown
  const sourceBreakdownData = useMemo(() => {
    if (!monthlyKPIs) return [];
    const { currentMonth } = monthlyKPIs;
    
    return [
      { 
        name: "Tanker Volume", 
        value: currentMonth.totalTankerVolume, 
        percentage: ((currentMonth.totalTankerVolume / currentMonth.totalInletSewage) * 100).toFixed(1) 
      },
      { 
        name: "Direct Inline Sewage (MB)", 
        value: currentMonth.totalDirectSewage, 
        percentage: ((currentMonth.totalDirectSewage / currentMonth.totalInletSewage) * 100).toFixed(1) 
      },
    ];
  }, [monthlyKPIs]);

  // Data for monthly comparison chart
  const monthlyComparisonData = useMemo(() => {
    return monthly.map(m => ({
      month: m.month.substring(0, 3),
      year: m.year,
      inlet: m.totalInletSewage,
      treated: m.totalTreatedWater,
      tseOutput: m.totalTseOutput,
      efficiency: m.avgEfficiency,
    }));
  }, [monthly]);

  // Data for tanker trips by month
  const tankerTripsData = useMemo(() => {
    return monthly.map(m => ({
      month: m.month.substring(0, 3),
      year: m.year,
      totalTrips: m.totalTankers,
      avgPerDay: m.daysInMonth ? m.totalTankers / m.daysInMonth : 0,
    }));
  }, [monthly]);

  // Capacity utilization data
  const capacityUtilizationData = useMemo(() => {
    return monthly.map(m => ({
      month: m.month.substring(0, 3),
      year: m.year,
      utilization: m.utilizationRate,
      // Calculate proximity to optimal efficiency (90-95% is typically optimal)
      optimalEfficiency: m.avgEfficiency > 95 ? 100 : (m.avgEfficiency / 95) * 100,
    }));
  }, [monthly]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#4E4456] py-4">
        <div className="container mx-auto px-6">
          <div className="mb-4 flex items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Muscat Bay STP Plant Dashboard</h1>
              <p className="text-gray-300 text-sm">Membrane Based Technology - Bio-Reactor MBR | Plant Capacity: 750 m³/day</p>
            </div>
          </div>
          
          {/* Month selector */}
          <div className="flex overflow-x-auto py-2 bg-[#3d3545] rounded-t-lg">
            {monthly.map((m, index) => (
              <button
                key={`${m.year}-${m.month}`}
                onClick={() => setSelectedMonth(`${m.year}-${m.month}`)}
                className={cn(
                  "px-4 py-2 mx-1 whitespace-nowrap rounded",
                  selectedMonth === `${m.year}-${m.month}`
                    ? "bg-[#8ACCD5] text-[#4E4456]"
                    : "bg-transparent text-gray-300 hover:bg-white/10"
                )}
              >
                {m.month.substring(0, 3)} {m.year}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Monthly KPI Cards */}
        {monthlyKPIs && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KPICard
              title="Monthly Tanker Trips"
              value={monthlyKPIs.tankerTrips.value}
              unit="trips"
              icon={<Truck className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.tankerTrips.trend}
              trendLabel="month"
            />
            <KPICard
              title="Monthly TSE Water Output"
              value={monthlyKPIs.tseOutput.value}
              unit="m³"
              icon={<Droplets className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.tseOutput.trend}
              trendLabel="month"
            />
            <KPICard
              title="Total Inlet Sewage"
              value={monthlyKPIs.inletSewage.value}
              unit="m³"
              icon={<TrendingUp className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.inletSewage.trend}
              trendLabel="month"
            />
            <KPICard
              title="Treatment Efficiency"
              value={monthlyKPIs.efficiency.value.toFixed(1)}
              unit="%"
              icon={<Gauge className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.efficiency.trend}
              trendLabel="month"
            />
            <KPICard
              title="Plant Utilization Rate"
              value={monthlyKPIs.utilizationRate.value.toFixed(1)}
              unit="%"
              icon={<BarChart2 className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.utilizationRate.trend}
              trendLabel="month"
            />
            <KPICard
              title="Total Treated Water"
              value={monthlyKPIs.treatedWater.value}
              unit="m³"
              icon={<LineChart2 className="h-5 w-5 text-[#8ACCD5]" />}
              trendValue={monthlyKPIs.treatedWater.trend}
              trendLabel="month"
            />
          </div>
        )}

        {/* Main content with tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
            <TabsTrigger value="daily">Daily Details</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily water flow trends chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Water Flow Trends</h3>
                  <p className="text-sm text-gray-500 mb-4">Inlet, Treated, and TSE Output (m³)</p>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="inlet" 
                          name="Total Inlet" 
                          stroke={WARNING_COLOR} 
                          fill={WARNING_COLOR} 
                          fillOpacity={0.6} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="treated" 
                          name="Treated Water" 
                          stroke={SUCCESS_COLOR} 
                          fill={SUCCESS_COLOR} 
                          fillOpacity={0.6} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="tseOutput" 
                          name="TSE Output" 
                          stroke={INFO_COLOR} 
                          fill={INFO_COLOR} 
                          fillOpacity={0.6} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Inlet source breakdown chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Inlet Source Breakdown</h3>
                  <p className="text-sm text-gray-500 mb-4">Tanker vs Direct Inline Sewage</p>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={sourceBreakdownData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={isMobile ? 50 : 70} 
                          outerRadius={isMobile ? 80 : 110} 
                          paddingAngle={3} 
                          dataKey="value" 
                          nameKey="name" 
                          labelLine={false} 
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                        >
                          {sourceBreakdownData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CHART_COLORS[index % CHART_COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [
                          `${Number(value).toLocaleString()} m³ (${props.payload.percentage}%)`, 
                          name
                        ]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly comparison and plant capacity utilization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Volume Comparison</h3>
                  <p className="text-sm text-gray-500 mb-4">Inlet, Treated, and TSE Output (m³)</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="inlet" name="Total Inlet" fill={WARNING_COLOR} />
                        <Bar dataKey="treated" name="Treated Water" fill={SUCCESS_COLOR} />
                        <Bar dataKey="tseOutput" name="TSE Output" fill={INFO_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Plant Capacity Utilization</h3>
                  <p className="text-sm text-gray-500 mb-4">Plant Capacity: 750 m³/day</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={capacityUtilizationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis yAxisId="left" orientation="left" label={{ value: 'Utilization %', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Efficiency %', angle: -90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="utilization" name="Capacity Utilization %" fill={BASE_COLOR} />
                        <Line yAxisId="right" type="monotone" dataKey="optimalEfficiency" name="Treatment Efficiency %" stroke={ACCENT_COLOR} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plant description and key indicators */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">STP Plant Information</h3>
                <p className="text-sm text-gray-500 mb-4">Membrane Based Technology - Bio-Reactor MBR</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-[#4E4456]">Plant Specifications</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Type: Membrane Based Technology - Bio-Reactor (MBR)</li>
                      <li>Design Capacity: 750 m³/day</li>
                      <li>Treatment Stages: Primary, Secondary, and Tertiary</li>
                      <li>Output: Treated Sewage Effluent (TSE) for Irrigation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-[#4E4456]">Operational Highlights</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Dual Inlet Sources: Direct Pipeline and Tanker Delivery</li>
                      <li>Average Daily Flow: {monthlyKPIs ? (monthlyKPIs.inletSewage.value / 30).toFixed(1) : "N/A"} m³/day</li>
                      <li>Average Treatment Efficiency: {monthlyKPIs ? monthlyKPIs.efficiency.value.toFixed(1) : "N/A"}%</li>
                      <li>Average System Utilization: {monthlyKPIs ? monthlyKPIs.utilizationRate.value.toFixed(1) : "N/A"}%</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Monthly Analysis Tab */}
          <TabsContent value="monthly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly water volume chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Water Volumes</h3>
                  <p className="text-sm text-gray-500 mb-4">Comparing Inlet, Treated, and TSE Output</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="inlet" name="Total Inlet" fill={WARNING_COLOR} />
                        <Bar dataKey="treated" name="Treated Water" fill={SUCCESS_COLOR} />
                        <Bar dataKey="tseOutput" name="TSE Output" fill={INFO_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly efficiency chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Efficiency Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">Treatment Efficiency over Time</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis domain={[80, 100]} label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Efficiency']} />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" name="Treatment Efficiency" stroke={ACCENT_COLOR} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tanker trips analysis */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Monthly Tanker Trips Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">Total Trips and Daily Average</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={tankerTripsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis yAxisId="left" orientation="left" label={{ value: 'Total Trips', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Avg/Day', angle: -90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="totalTrips" name="Total Trips" fill={BASE_COLOR} />
                        <Line yAxisId="right" type="monotone" dataKey="avgPerDay" name="Avg Trips per Day" stroke={ACCENT_COLOR} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Plant utilization rate */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Plant Utilization Rate</h3>
                  <p className="text-sm text-gray-500 mb-4">Monthly Average vs 750 m³/day Capacity</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={capacityUtilizationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey={(data) => `${data.month} ${data.year}`}
                          tick={{ fontSize: 10 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Utilization']} />
                        <Legend />
                        <Bar dataKey="utilization" name="Capacity Utilization %" fill={ACCENT_COLOR}>
                          {capacityUtilizationData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.utilization < 70 ? WARNING_COLOR : 
                                    entry.utilization > 95 ? DANGER_COLOR : 
                                    SUCCESS_COLOR} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Daily Details Tab */}
          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily flow chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Water Flow Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4">Detail View for Selected Month</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="inlet" name="Total Inlet" stroke={WARNING_COLOR} dot={true} />
                        <Line type="monotone" dataKey="treated" name="Treated Water" stroke={SUCCESS_COLOR} dot={true} />
                        <Line type="monotone" dataKey="tseOutput" name="TSE Output" stroke={INFO_COLOR} dot={true} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Daily tanker discharge chart */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Daily Tanker Discharge</h3>
                  <p className="text-sm text-gray-500 mb-4">Number of Tankers and Volume</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={filteredDailyData.map(d => ({
                        date: d["Date:"].split('/').slice(0, 2).join('/'),
                        tankers: d["Number of Tankers Discharged:"],
                        volume: d["Expected Tanker Volume (m³) (20 m3)"]
                      }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="tankers" name="Number of Tankers" fill={BASE_COLOR} />
                        <Line yAxisId="right" type="monotone" dataKey="volume" name="Tanker Volume (m³)" stroke={ACCENT_COLOR} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Daily efficiency calculations */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Daily Treatment Efficiency</h3>
                <p className="text-sm text-gray-500 mb-4">Efficiency and Loss Analysis</p>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={filteredDailyData.map(d => {
                        const efficiency = (d["Total Treated Water Produced - m³"] / d["Total Inlet Sewage Received from (MB+Tnk) -m³"]) * 100;
                        const tseRatio = (d["Total TSE Water Output to Irrigation - m³"] / d["Total Treated Water Produced - m³"]) * 100;
                        return {
                          date: d["Date:"].split('/').slice(0, 2).join('/'),
                          efficiency: isNaN(efficiency) ? 0 : efficiency,
                          tseRatio: isNaN(tseRatio) ? 0 : tseRatio,
                          capacity: (d["Total Inlet Sewage Received from (MB+Tnk) -m³"] / 750) * 100 // Daily capacity utilization
                        };
                      })} 
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 120]} />
                      <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" name="Treatment Efficiency %" stroke={SUCCESS_COLOR} />
                      <Line type="monotone" dataKey="tseRatio" name="TSE to Treated Water Ratio %" stroke={INFO_COLOR} />
                      <Bar dataKey="capacity" name="Capacity Utilization %" fill={BASE_COLOR} fillOpacity={0.3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Metrics Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Treatment efficiency trends */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Treatment Efficiency Trends</h3>
                  <p className="text-sm text-gray-500 mb-4">Monthly Performance Analysis</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthly.map(m => ({
                        month: `${m.month.substring(0, 3)} ${m.year}`,
                        efficiency: m.avgEfficiency,
                        tseRate: (m.totalTseOutput / m.totalTreatedWater) * 100
                      }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[50, 100]} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="efficiency" name="Treatment Efficiency %" stroke={SUCCESS_COLOR} />
                        <Line type="monotone" dataKey="tseRate" name="TSE Utilization Rate %" stroke={INFO_COLOR} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Plant utilization and operational rating */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-1">Operational Rating</h3>
                  <p className="text-sm text-gray-500 mb-4">Plant Performance vs Capacity</p>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={monthly.map(m => {
                          // Calculate operational rating (0-100%)
                          // This is a combination of proper utilization and high efficiency
                          // Optimal range is 70-90% utilization with >95% efficiency
                          const utilizationScore = m.utilizationRate > 90 ? 90 - (m.utilizationRate - 90) * 2 : // Penalize over-utilization
                                                m.utilizationRate < 50 ? m.utilizationRate : // Low utilization is scored as is
                                                50 + (m.utilizationRate - 50) * 1.25; // Boost mid-range utilization
                                                
                          const efficiencyScore = m.avgEfficiency;
                          
                          // Weight utilization and efficiency equally
                          const operationalRating = (utilizationScore * 0.5) + (efficiencyScore * 0.5);
                          
                          return {
                            month: `${m.month.substring(0, 3)} ${m.year}`,
                            utilization: m.utilizationRate,
                            efficiency: m.avgEfficiency,
                            operationalRating: operationalRating
                          };
                        })} 
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, '']} />
                        <Legend />
                        <Bar dataKey="utilization" name="Capacity Utilization %" stackId="a" fill={BASE_COLOR} />
                        <Bar dataKey="efficiency" name="Treatment Efficiency %" stackId="b" fill={SUCCESS_COLOR} />
                        <Line type="monotone" dataKey="operationalRating" name="Operational Rating %" stroke={ACCENT_COLOR} strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System KPIs and Operational Metrics */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">System Performance KPIs</h3>
                <p className="text-sm text-gray-500 mb-4">Key Performance Indicators for STP Plant</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-[#4E4456] border-b pb-1">Efficiency Metrics</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Average Treatment Efficiency:</span>
                        <span className="font-medium">{monthly.reduce((sum, m) => sum + m.avgEfficiency, 0) / monthly.length}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Best Month Efficiency:</span>
                        <span className="font-medium">
                          {Math.max(...monthly.map(m => m.avgEfficiency)).toFixed(1)}% 
                          ({monthly.find(m => m.avgEfficiency === Math.max(...monthly.map(m => m.avgEfficiency)))?.month})
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">TSE to Treated Water Ratio:</span>
                        <span className="font-medium">
                          {(monthly.reduce((sum, m) => sum + m.totalTseOutput, 0) / 
                           monthly.reduce((sum, m) => sum + m.totalTreatedWater, 0) * 100).toFixed(1)}%
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Water Loss in Treatment:</span>
                        <span className="font-medium">
                          {(monthly.reduce((sum, m) => sum + (m.totalTreatedWater - m.totalTseOutput), 0) / 
                           monthly.reduce((sum, m) => sum + m.totalTreatedWater, 0) * 100).toFixed(1)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 text-[#4E4456] border-b pb-1">Capacity and Volume Metrics</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Average Plant Utilization:</span>
                        <span className="font-medium">
                          {(monthly.reduce((sum, m) => sum + m.utilizationRate, 0) / monthly.length).toFixed(1)}%
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Peak Monthly Inlet Volume:</span>
                        <span className="font-medium">
                          {Math.max(...monthly.map(m => m.totalInletSewage)).toLocaleString()} m³ 
                          ({monthly.find(m => m.totalInletSewage === Math.max(...monthly.map(m => m.totalInletSewage)))?.month})
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Direct Sewage vs Tanker Ratio:</span>
                        <span className="font-medium">
                          {(monthly.reduce((sum, m) => sum + m.totalDirectSewage, 0) / 
                          monthly.reduce((sum, m) => sum + m.totalInletSewage, 0) * 100).toFixed(1)}% : 
                          {(monthly.reduce((sum, m) => sum + m.totalTankerVolume, 0) / 
                          monthly.reduce((sum, m) => sum + m.totalInletSewage, 0) * 100).toFixed(1)}%
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Average Daily Flow:</span>
                        <span className="font-medium">
                          {(monthly.reduce((sum, m) => sum + m.totalInletSewage, 0) / 
                          monthly.reduce((sum, m) => sum + (m.daysInMonth || 30), 0)).toFixed(1)} m³/day
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
