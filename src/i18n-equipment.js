// Public equipment descriptions. Contracts, plans and completed deliveries stay distinct.
const rows = [
['수중 환경에서 활동하는 국내 잠수함을 살펴보세요.','Explore a Korean submarine operating underwater.','水中で活動する韓国の潜水艦を見てみましょう。','了解在水下活动的韩国潜艇。'],
['방위사업청은 2021년 8월 13일 도산안창호함 인도·인수 및 취역식을 발표했습니다. 당시 공개된 후속 전력화 계획과 실제 완료 실적은 구분합니다.','DAPA announced the delivery, acceptance and commissioning ceremony for Dosan Ahn Chang-ho on 13 August 2021. Follow-on deployment plans announced then are distinguished from completed milestones.','防衛事業庁は2021年8月13日、島山安昌浩艦の引き渡し・受領・就役式を発表しました。当時の追加配備計画と実際に完了した実績は区別しています。','防卫事业厅于2021年8月13日宣布岛山安昌浩舰交付、接收及入役仪式。当时公布的后续部署计划与已完成的成果分别说明。'],
['국내 조선 기술이 연결된 해군 함정을 만나보세요.','Discover a naval ship built with Korean shipbuilding technology.','韓国の造船技術を生かした海軍艦艇を見てみましょう。','了解采用韩国造船技术的海军舰艇。'],
['2024년 12월 18일 방위사업청은 울산 HD현대중공업에서 울산급 Batch-III 선도함 충남함의 해군 인도식을 개최했다고 밝혔습니다. 이는 국내 인도이며 해외 수출 사건으로 집계하지 않습니다.','On 18 December 2024, DAPA announced the Navy handover ceremony for Chungnam, the lead Ulsan-class Batch III frigate, at HD Hyundai Heavy Industries in Ulsan. This domestic delivery is not counted as an export.','2024年12月18日、防衛事業庁は蔚山のHD現代重工業で蔚山級Batch III先導艦・忠南艦の海軍引き渡し式を開催したと発表しました。国内への引き渡しであり、輸出実績には数えません。','2024年12月18日，防卫事业厅宣布在蔚山HD现代重工举行蔚山级Batch III首舰忠南舰的海军交付仪式。这是国内交付，不计为出口事件。'],
['지상에서 기동하는 전차를 만나보세요.','Meet a tank designed to move across land.','地上を移動する戦車を見てみましょう。','了解在地面机动的坦克。'],
['방위사업청은 폴란드의 K2 1차 이행계약을 설명했습니다. 현대로템 연혁에는 2025년 8월 1일 2차 이행계약이 기록되어 있습니다.','DAPA describes Poland’s first K2 execution contract. Hyundai Rotem’s history records a second execution contract on 1 August 2025.','防衛事業庁はポーランド向けK2の第1次履行契約を説明しています。現代ロテムの沿革には2025年8月1日の第2次履行契約が記載されています。','防卫事业厅介绍了波兰K2首批执行合同。现代Rotem沿革记录了2025年8月1日的第二批执行合同。'],
['이동형 포 체계와 관련 수출 사례를 살펴보세요.','Explore mobile artillery and its documented export contracts.','移動式の砲と公開された輸出事例を見てみましょう。','了解机动火炮及其公开出口案例。'],
['방위사업청 공개자료에 폴란드 K9 1차 이행계약과 2023년 2차 이행계약이 설명되어 있습니다.','DAPA’s public material describes Poland’s first K9 execution contract and the second contract in 2023.','防衛事業庁の公開資料はポーランド向けK9の第1次履行契約と2023年の第2次契約を説明しています。','防卫事业厅公开资料介绍了波兰K9首批执行合同及2023年的第二批合同。'],
['지상 체계가 세계와 연결되는 이야기를 찾아보세요.','Explore how Korean land systems connect with other countries.','韓国の地上装備が世界とつながる話を探してみましょう。','探索韩国地面装备与世界各国的联系。'],
['방위사업청 공개자료에 폴란드 천무 1차 이행계약과 2024년 2차 이행계약이 설명되어 있습니다.','DAPA’s public material describes Poland’s first Chunmoo execution contract and the second contract in 2024.','防衛事業庁の公開資料はポーランド向け天舞の第1次履行契約と2024年の第2次契約を説明しています。','防卫事业厅公开资料介绍了波兰天舞首批执行合同及2024年的第二批合同。'],
['공중의 기술과 공개된 해외 계약 사례를 만나보세요.','Discover aviation technology and documented overseas contracts.','航空技術と公開された海外契約の事例を見てみましょう。','了解航空技术及公开的海外合同案例。'],
['방위사업청은 2022년 폴란드와 체결한 4종 무기체계 1차 이행계약에 FA-50이 포함된다고 설명했습니다.','DAPA states that FA-50 was included in the first execution contracts for four weapon systems signed with Poland in 2022.','防衛事業庁によると、2022年にポーランドと締結した4種類の装備の第1次履行契約にFA-50が含まれます。','防卫事业厅说明，FA-50属于2022年与波兰签订的四种武器系统首批执行合同。'],
['사람이 탑승하지 않는 항공기의 공개 사업을 알아보세요.','Learn about a publicly documented aircraft program with no pilot onboard.','人が搭乗しない航空機の公開事業を知りましょう。','了解无需人员搭乘的飞机公开项目。'],
['2024년 1월 25일 방위사업청은 중고도정찰용무인항공기 양산사업 착수를 발표했습니다. 수출은 이 자료에서 미래 기대이며 확정 실적으로 표시하지 않습니다.','On 25 January 2024, DAPA announced the start of mass production for the medium-altitude reconnaissance UAV. Exports are a future prospect in this source, not confirmed results.','2024年1月25日、防衛事業庁は中高度偵察用無人機の量産事業開始を発表しました。この資料で輸出は将来の期待であり、確定実績ではありません。','2024年1月25日，防卫事业厅宣布启动中空侦察无人机量产项目。资料中的出口属于未来展望，并非已确认成果。'],
['지상과 해상을 잇는 해병대 체계를 살펴보세요.','Explore a Marine Corps vehicle connecting land and sea.','陸と海をつなぐ海兵隊の装備を見てみましょう。','了解连接陆地与海洋的海军陆战队装备。'],
['방위사업청은 2023년 12월 26일 해병대 운용 상륙돌격장갑차용 복합화기 원격사격통제체계 전력화 완료를 발표했습니다.','On 26 December 2023, DAPA announced completed fielding of a combined-weapon remote firing-control system for Marine Corps amphibious assault vehicles.','2023年12月26日、防衛事業庁は海兵隊の水陸両用装甲車向け複合火器遠隔射撃統制システムの配備完了を発表しました。','2023年12月26日，防卫事业厅宣布完成海军陆战队两栖突击装甲车复合武器遥控射击控制系统的列装。'],
['우주 기술과 연구기관의 협력 관계를 만나보세요.','Explore space technology and cooperation among research institutes.','宇宙技術と研究機関の協力を見てみましょう。','了解空间技术及研究机构之间的合作。'],
['425사업 1호기는 2024년 8월 전투용 적합 판정을 획득했습니다. 2025년 11월 2일에는 5호기가 발사되어 목표 궤도 진입과 지상국 통신이 확인됐습니다. 발사 성공과 각 위성의 임무 운용 상태는 구분합니다.','The first Project 425 satellite was deemed suitable for combat use in August 2024. The fifth launched on 2 November 2025, with its target orbit and ground-station communications confirmed. Launch success is distinguished from each satellite’s operational status.','425事業の1号機は2024年8月に戦闘用適合判定を取得しました。5号機は2025年11月2日に打ち上げられ、目標軌道への投入と地上局との通信が確認されました。打ち上げ成功と各衛星の任務運用状況は区別します。','425项目首颗卫星于2024年8月获得作战适用判定。第五颗于2025年11月2日发射，确认进入目标轨道并与地面站通信。发射成功与各卫星的任务运行状态分别说明。'],
['국방과 국민 안전 분야에 연결되는 우주 연구를 살펴보세요.','Explore space research supporting defense and public safety.','国防と国民の安全につながる宇宙研究を見てみましょう。','了解服务国防与公众安全的空间研究。'],
['2025년 4월 4일 공개자료는 상세설계검토회의와 개발 진행을 설명합니다. 향후 활용 계획과 이미 완료된 성과를 구분합니다.','The public release of 4 April 2025 describes a critical design review and ongoing development. Future applications are distinguished from completed achievements.','2025年4月4日の公開資料は詳細設計審査と開発の進行を説明しています。将来の活用計画と完了した成果は区別します。','2025年4月4日公开资料介绍了详细设计审查会议及开发进展。未来应用计划与已完成成果分别说明。'],
['보병 수송과 차체 탑재 장비가 결합된 궤도형 장갑차입니다.','A tracked armored vehicle combining infantry transport with onboard equipment.','歩兵の輸送と車載装備を組み合わせた履帯式装甲車です。','结合步兵运输与车载装备的履带式装甲车。'],
['K9에 탄약을 공급하는 지원 차량으로 자주포와 구분되는 체계입니다.','A support vehicle that resupplies K9 ammunition; it is a separate system from the howitzer.','K9に弾薬を補給する支援車両で、自走砲とは別の装備です。','向K9补充弹药的支援车辆，与自行火炮是不同的系统。'],
['8륜 차륜형장갑차로 궤도형 K21과 차체 구성이 다릅니다.','An eight-wheeled armored vehicle with a different chassis from the tracked K21.','8輪の装甲車で、履帯式K21とは車体構成が異なります。','八轮装甲车，其车体结构不同于履带式K21。'],
['호주군 공급을 위해 개발한 보병전투장갑차입니다. 2023년 129대 계약은 인도 완료와 구분합니다.','An infantry fighting vehicle developed for the Australian Army. The 2023 contract for 129 vehicles is not a claim of completed delivery.','豪州軍向けに開発された歩兵戦闘車です。2023年の129両契約と引き渡し完了は区別します。','为澳大利亚军队开发的步兵战车。2023年129辆的合同与交付完成分别说明。'],
['국내 항공산업의 전투기 개발·양산 프로그램입니다. 해외 판매 목표를 확정 수출 실적으로 집계하지 않습니다.','A Korean fighter development and production program. Overseas sales goals are not counted as confirmed exports.','韓国航空産業の戦闘機開発・量産事業です。海外販売目標を確定輸出実績には数えません。','韩国航空工业的战斗机开发及量产项目。海外销售目标不计为已确认的出口成果。'],
['국산 기동헬기 플랫폼입니다. 보고서는 이라크 수출을 소개하지만 이번 지도는 별도 계약일 검증 전이라 수출 사건으로 집계하지 않습니다.','A Korean utility helicopter platform. The report mentions an Iraqi export, but this map does not count it as an export event until the contract date is separately verified.','韓国製の多用途ヘリコプターです。報告書はイラク向け輸出を紹介していますが、この地図では契約日の個別確認前のため輸出事例に数えていません。','韩国国产通用直升机平台。报告介绍了对伊拉克出口，但在单独核实合同日期前，本地图不将其计为出口事件。'],
['소형무장헬기 개발 프로그램을 소개합니다. 형식과 공개 외형을 기동헬기와 비교할 수 있습니다.','Explore the light armed helicopter development program and compare its type and public exterior with a utility helicopter.','小型武装ヘリの開発事業を紹介します。形式と公開外観を多用途ヘリと比較できます。','介绍轻型武装直升机开发项目，可将其型号和公开外形与通用直升机比较。'],
['전투기 조종사 양성을 위한 고등훈련기입니다. FA-50 경공격기와 임무가 다릅니다.','An advanced trainer for fighter pilots, with a different role from the FA-50 light combat aircraft.','戦闘機操縦士を育成する高等練習機で、FA-50軽攻撃機とは任務が異なります。','培养战斗机飞行员的高级教练机，任务不同于FA-50轻型战斗机。'],
['기본 비행훈련을 수행하는 프로펠러 항공기입니다. 초음속 고등훈련기와 구분합니다.','A propeller aircraft for basic flight training, distinct from a supersonic advanced trainer.','基本飛行訓練を行うプロペラ機で、超音速高等練習機とは区別します。','用于基础飞行训练的螺旋桨飞机，有别于超音速高级教练机。'],
['위성을 우주로 운송하는 국내 발사체입니다. 민간 우주 기술 기반으로 소개하며 무기나 수출 완료 체계로 분류하지 않습니다.','A Korean launch vehicle carrying satellites into space. It is presented as civilian space infrastructure, not a weapon or a completed export.','衛星を宇宙に運ぶ韓国の打ち上げ機です。民間宇宙技術の基盤として紹介し、武器や輸出完了装備には分類しません。','将卫星送入太空的韩国运载火箭。作为民用航天技术基础介绍，不分类为武器或已完成出口的系统。'],
['한화시스템이 개발한 네트워크 제어와 위성단말 구성품을 소개합니다. 위성 본체의 국내 제조를 의미하지 않습니다.','Explore network control and satellite-terminal components developed by Hanwha Systems. This does not mean the satellite itself was manufactured in Korea.','ハンファシステムが開発したネットワーク制御と衛星端末の構成品を紹介します。衛星本体の韓国製造を意味しません。','介绍韩华系统开发的网络控制与卫星终端部件，不代表卫星本体由韩国制造。'],
['발사대·탐지·유도 구성품이 연결된 중거리 방공체계입니다. 이번 전시는 공개 제품 소개를 기준으로 합니다.','A medium-range air-defense system linking launchers, detection and guidance. This exhibit uses public product descriptions.','発射機・探知・誘導を結ぶ中距離防空システムです。展示は公開製品紹介に基づきます。','连接发射装置、探测与制导部件的中程防空系统。展览依据公开产品介绍。'],
['2020년 해군에 인도된 교육훈련함입니다. 해상 교육뿐 아니라 의무·구호 지원 공간을 갖췄습니다.','A training ship delivered to the Navy in 2020, with spaces for maritime training, medical care and relief.','2020年に海軍へ引き渡された練習艦で、海上教育と医療・救援支援の空間を備えます。','2020年交付海军的训练舰，设有海上教学及医疗救援支援空间。'],
['우주에서 지구를 관찰하는 군 정찰위성 사업입니다.','A military reconnaissance satellite program observing Earth from space.','宇宙から地球を観測する軍偵察衛星事業です。','从太空观测地球的军用侦察卫星项目。'],
['수중에서 활동하는 도산안창호급 잠수함입니다. 지상·공중 체계와 다른 수중 환경을 살펴보세요.','A Dosan Ahn Chang-ho-class submarine. Explore an underwater environment distinct from land and air.','島山安昌浩級潜水艦です。地上や空中とは異なる水中環境を見てみましょう。','岛山安昌浩级潜艇，了解不同于陆地与空中的水下环境。'],
['승무원을 보호하면서 지상에서 이동하는 전차입니다.','A tank that protects its crew while moving on land.','乗員を守りながら地上を移動する戦車です。','在地面行驶并保护乘员的坦克。'],
['차량과 포가 하나로 결합된 자주포입니다. 지상에서 화력 지원 역할을 합니다.','A self-propelled howitzer combining a vehicle and gun to provide fire support on land.','車両と砲を組み合わせた自走砲で、地上の火力支援を担います。','将车辆与火炮结合的自行火炮，提供地面火力支援。'],
['여러 발사관을 차량에 탑재한 다연장로켓 체계입니다.','A multiple-launch rocket system carrying several launch tubes on a vehicle.','複数の発射管を車両に搭載する多連装ロケットシステムです。','车辆搭载多个发射管的多管火箭系统。'],
['바다를 감시하고 해양 권익을 보호하는 해군 호위함입니다.','A naval frigate monitoring the sea and protecting maritime interests.','海を監視し海洋権益を守る海軍フリゲートです。','监视海洋并保护海洋权益的海军护卫舰。'],
['T-50을 바탕으로 발전한 경공격기입니다. 항공 기술과 임무 장비가 결합된 체계입니다.','A light combat aircraft developed from T-50, combining aviation technology and mission equipment.','T-50を基に発展した軽攻撃機で、航空技術と任務装備を組み合わせています。','以T-50为基础发展的轻型战斗机，结合航空技术与任务装备。'],
['조종사가 탑승하지 않고 지상 정보를 관찰하는 감시·정찰 항공기입니다.','An unmanned surveillance and reconnaissance aircraft observing the ground without a pilot onboard.','操縦士が搭乗せず地上を観測する監視・偵察機です。','无需飞行员搭乘、观测地面信息的监视侦察飞机。'],
['물과 육지를 오가며 이동하는 해병대 장갑차입니다. 공개된 RCWS 사업은 승무원이 차체 내부에서 장비를 원격 운용하도록 개선했습니다.','A Marine Corps armored vehicle moving between water and land. The documented RCWS upgrade lets crew operate equipment remotely from inside the vehicle.','水と陸を行き来する海兵隊装甲車です。公開されたRCWS改修では乗員が車内から装備を遠隔操作できます。','在水面与陆地间移动的海军陆战队装甲车。公开的RCWS升级使乘员能在车内遥控装备。'],
['작은 위성들을 활용해 한반도와 주변 해역을 관찰하는 개발사업입니다. 국민 안전 분야 활용도 계획합니다.','A development program using small satellites to observe the Korean Peninsula and surrounding seas, with planned public-safety applications.','小型衛星で朝鮮半島と周辺海域を観測する開発事業で、国民の安全への活用も計画しています。','利用小型卫星观测朝鲜半岛及周边海域的开发项目，也计划用于公众安全。'],
];
export const equipmentTranslations = Object.fromEntries(rows.map(([ko,en,ja,zh]) => [ko,{en,ja,zh}]));
const labels = `
도산안창호급|Dosan Ahn Chang-ho class|島山安昌浩級|岛山安昌浩级
잠수함 · 장보고-III|Submarine · KSS-III|潜水艦 · KSS-III|潜艇 · KSS-III
충남함|ROKS Chungnam|忠南艦|忠南舰
호위함 · 울산급 Batch-III|Frigate · Ulsan Batch III|フリゲート · 蔚山級Batch III|护卫舰 · 蔚山级Batch III
울산급 Batch-III|Ulsan class Batch III|蔚山級Batch III|蔚山级Batch III
장보고-III Batch-I|KSS-III Batch I|張保皐III Batch I|张保皋III Batch I
전차|Tank|戦車|坦克
자주포|Self-propelled howitzer|自走砲|自行火炮
다연장로켓|Multiple-launch rockets|多連装ロケット|多管火箭
항공기|Aircraft|航空機|飞机
중고도 무인항공기|Medium-altitude UAV|中高度無人機|中空无人机
상륙돌격장갑차|Amphibious assault vehicle|水陸両用装甲車|两栖突击装甲车
해병대 · 지상과 해상|Marines · land and sea|海兵隊 · 陸と海|海军陆战队 · 陆地与海洋
군 정찰위성|Military reconnaissance satellite|軍偵察衛星|军用侦察卫星
425사업|Project 425|425事業|425项目
초소형위성체계|Small satellite system|超小型衛星システム|小型卫星系统
우주 · 연구개발|Space · research and development|宇宙 · 研究開発|太空 · 研究开发
육군|Army|陸軍|陆军
해군|Navy|海軍|海军
공군|Air Force|空軍|空军
해병대|Marine Corps|海兵隊|海军陆战队
합동|Joint|統合|联合
수중|Underwater|水中|水下
해상|At sea|海上|海上
기동|Mobility|機動|机动
화력 지원|Fire support|火力支援|火力支援
항공|Aviation|航空|航空
감시·정찰|Surveillance and reconnaissance|監視・偵察|监视与侦察
상륙·기동|Amphibious mobility|上陸・機動|登陆与机动
기동·보병 지원|Mobility and infantry support|機動・歩兵支援|机动与步兵支援
탄약 지원|Ammunition support|弾薬支援|弹药支援
기동·수송|Mobility and transport|機動・輸送|机动与运输
공중 기동|Air mobility|航空機動|空中机动
항공 지원|Air support|航空支援|航空支援
비행 교육|Flight training|飛行教育|飞行训练
우주 수송|Space transport|宇宙輸送|太空运输
위성 통신|Satellite communications|衛星通信|卫星通信
방공|Air defense|防空|防空
교육·의무 지원|Training and medical support|教育・医療支援|训练与医疗支援
보병전투장갑차|Infantry fighting vehicle|歩兵戦闘車|步兵战车
탄약운반장갑차|Ammunition resupply vehicle|弾薬補給車|弹药补给装甲车
차륜형장갑차|Wheeled armored vehicle|装輪装甲車|轮式装甲车
수출형 보병전투장갑차|Export infantry fighting vehicle|輸出型歩兵戦闘車|出口型步兵战车
한국형 전투기|Korean fighter|韓国型戦闘機|韩国型战斗机
기동헬기|Utility helicopter|多用途ヘリ|通用直升机
소형무장헬기|Light armed helicopter|小型武装ヘリ|轻型武装直升机
고등훈련기|Advanced trainer|高等練習機|高级教练机
기본훈련기|Basic trainer|基本練習機|初级教练机
우주발사체 · 민간 우주 기반|Launch vehicle · civilian space infrastructure|打ち上げ機 · 民間宇宙基盤|运载火箭 · 民用航天基础
군 위성통신체계|Military satellite communications|軍衛星通信システム|军用卫星通信系统
중거리 지대공 체계|Medium-range surface-to-air system|中距離地対空システム|中程地空系统
해상 교육훈련함|Naval training ship|海上練習艦|海上训练舰
폴란드|Poland|ポーランド|波兰
루마니아|Romania|ルーマニア|罗马尼亚
이집트|Egypt|エジプト|埃及
호주|Australia|オーストラリア|澳大利亚
말레이시아|Malaysia|マレーシア|马来西亚
필리핀|Philippines|フィリピン|菲律宾
이행계약|Execution contract|履行契約|执行合同
2차 이행계약|Second execution contract|第2次履行契約|第二批执行合同
공급 계약|Supply contract|供給契約|供应合同
패키지 공급 계약|Package supply contract|パッケージ供給契約|成套供应合同
18대 공급 계약|Contract for 18 aircraft|18機供給契約|18架供应合同
공급 사례 · 브로슈어 연도|Supply example · brochure year|供給事例 · パンフレット記載年|供应案例 · 手册记载年份
기업|Company|企業|企业
사업기관|Program agency|事業機関|项目机构
연구기관|Research institute|研究機関|研究机构
공식 공개 사업·제품 소개|Official public program and product overview|公式公開事業・製品紹介|官方公开项目与产品介绍
`;
for (const line of labels.trim().split('\n')) {const [ko,en,ja,zh]=line.split('|');equipmentTranslations[ko]={en,ja,zh};}
const details = `
우주 관측 기술과 연구개발 협력|Space observation and research cooperation|宇宙観測技術と研究開発協力|空间观测技术与研发合作
국내 독자 설계·건조 잠수함과 수중 환경|Korean-designed submarine and underwater environment|韓国独自設計・建造潜水艦と水中環境|韩国自主设计建造潜艇与水下环境
기동 플랫폼과 국내 제작 기술|Mobility platform and Korean manufacturing|機動基盤と韓国の製造技術|机动平台与韩国制造技术
이동형 화력 플랫폼|Mobile fire-support platform|移動式火力基盤|机动火力平台
차량과 발사 장치의 결합|Vehicle and launcher integration|車両と発射装置の結合|车辆与发射装置的结合
조선·탐지·전투체계의 통합|Shipbuilding, sensors and combat-system integration|造船・探知・戦闘システムの統合|造船、探测与作战系统集成
기체와 항공전자 기술의 연결|Airframe and avionics integration|機体と航空電子技術の連携|机体与航空电子技术连接
비행체·센서·통신의 통합|Aircraft, sensors and communications integration|機体・センサー・通信の統合|飞机、传感器与通信集成
상륙 기동과 승무원 보호|Amphibious mobility and crew protection|上陸機動と乗員保護|登陆机动与乘员保护
국방·우주·해양 분야의 공동 활용|Shared defense, space and maritime applications|国防・宇宙・海洋分野の共同利用|国防、航天与海洋领域共同应用
2021년 선도함 건조·인도|Lead ship construction and delivery in 2021|2021年先導艦建造・引き渡し|2021年首舰建造交付
인도·취역 공개 발표|Public delivery and commissioning announcement|引き渡し・就役の公開発表|公开交付及入役公告
K2 제작·해외 계약|K2 manufacturing and overseas contracts|K2製造・海外契約|K2制造与海外合同
공개 수출 계약 발표|Public export-contract announcement|輸出契約の公開発表|公开出口合同公告
K9 제품 제작|K9 manufacturing|K9製造|K9制造
공개 계약 사례 발표|Public contract announcement|契約事例の公開発表|公开合同案例公告
천무 제품 제작|Chunmoo manufacturing|天舞製造|天舞制造
울산급 Batch-III 선도함 건조|Construction of the lead Ulsan Batch III frigate|蔚山級Batch III先導艦建造|蔚山级Batch III首舰建造
함정 인도 발표|Ship delivery announcement|艦艇引き渡し発表|舰艇交付公告
FA-50 기체 사업|FA-50 airframe program|FA-50機体事業|FA-50机体项目
T-50·FA-50 항공전자 사업|T-50 and FA-50 avionics program|T-50・FA-50航空電子事業|T-50与FA-50航空电子项目
MUAV 체계종합·구성품 통합|MUAV system and component integration|MUAVシステム・構成品統合|MUAV系统与部件集成
주요 구성품 개발 참여|Major-component development participation|主要構成品開発への参加|参与主要部件开发
사업 협력 연구기관|Research partner for the program|事業協力研究機関|项目合作研究机构
출고식 주관|Rollout ceremony organizer|出庫式主催|出厂仪式主办方
상륙돌격장갑차 RCWS 사업 업체|Amphibious vehicle RCWS contractor|水陸両用装甲車RCWS事業企業|两栖突击装甲车RCWS项目企业
RCWS 전력화 발표|RCWS fielding announcement|RCWS配備発表|RCWS列装公告
공개자료의 연구개발 협력|Research cooperation documented in public sources|公開資料の研究開発協力|公开资料中的研发合作
425사업 1호기 개발 성과 발표|Project 425 first-satellite development announcement|425事業1号機開発成果発表|425项目首颗卫星开发成果公告
총괄연구기관|Lead research institute|総括研究機関|牵头研究机构
공개된 연구 참여기관|Publicly listed research partners|公開された研究参加機関|公开列明的研究参与机构
다부처 협력사업|Interagency cooperation program|複数省庁協力事業|跨部门合作项目
본문: 울산급 Batch-III 선도함 인도식|Body: lead Ulsan Batch III frigate handover|本文：蔚山級Batch III先導艦引き渡し式|正文：蔚山级Batch III首舰交付仪式
본문: 2022년 4종 체계 1차 이행계약 및 후속 이행계약 설명|Body: 2022 first execution contracts for four systems and follow-on contracts|本文：2022年4種装備の第1次履行契約と後続契約|正文：2022年四种系统首批执行合同及后续合同
2025: 폴란드 K2 2차 이행계약|2025: second Polish K2 execution contract|2025年：ポーランドK2第2次履行契約|2025年：波兰K2第二批执行合同
본문: 중고도정찰용무인항공기 양산사업 착수|Body: medium-altitude reconnaissance UAV production launch|本文：中高度偵察無人機量産開始|正文：中空侦察无人机量产项目启动
본문: 2024-08-13 425사업 1호기 전투용 적합 판정|Body: first Project 425 satellite combat-suitability decision, 2024-08-13|本文：2024年8月13日425事業1号機戦闘用適合判定|正文：2024年8月13日425项目首颗卫星作战适用判定
본문: 2025년 11월 2일 발사·목표 궤도 진입·지상국 통신 확인|Body: 2 November 2025 launch, target orbit and ground-station contact|本文：2025年11月2日打ち上げ・目標軌道・地上局通信確認|正文：2025年11月2日发射、进入目标轨道及地面站通信确认
본문: 해병대 운용 상륙돌격장갑차와 RCWS|Body: Marine Corps amphibious assault vehicle and RCWS|本文：海兵隊水陸両用装甲車とRCWS|正文：海军陆战队两栖突击装甲车与RCWS
본문: 상세설계검토회의 및 군·국민 안전 분야 활용 계획|Body: design review and planned military and public-safety applications|本文：詳細設計審査と軍・国民安全への活用計画|正文：详细设计审查及军事、公众安全应用计划
인도·인수·취역식 및 당시 전력화 계획|Delivery, acceptance, commissioning and deployment plans at publication|引き渡し・受領・就役式と当時の配備計画|交付、接收、入役仪式及当时部署计划
제품 목록: K9 자주포·천무 발사대|Product list: K9 howitzer and Chunmoo launcher|製品一覧：K9自走砲・天舞発射機|产品列表：K9自行火炮、天舞发射装置
FA-50 소개와 사천 본사 공개 주소|FA-50 overview and public Sacheon headquarters address|FA-50紹介と泗川本社の公開住所|FA-50介绍及泗川总部公开地址
고등훈련기·경공격기 사업 소개|Advanced trainer and light combat aircraft programs|高等練習機・軽攻撃機事業紹介|高级教练机及轻型战斗机项目介绍
체계종합·주요 구성품 통합·부산 출고식|System integration, key components and Busan rollout|システム・主要構成品統合と釜山出庫式|系统集成、主要部件整合及釜山出厂仪式
창원공장 공개 주소|Public Changwon factory address|昌原工場の公開住所|昌原工厂公开地址
공식 제품·사업 소개 또는 계약 발표 본문|Official product/program overview or contract-announcement body|公式製品・事業紹介または契約発表本文|官方产品、项目介绍或合同公告正文
발행일 미표기 · 2026-10-08 확인|Publication date not listed · accessed 2026-10-08|発行日記載なし · 2026-10-08確認|未注明发布日期 · 2026-10-08查阅
발행일 미표기 · 2026-10-12 확인|Publication date not listed · accessed 2026-10-12|発行日記載なし · 2026-10-12確認|未注明发布日期 · 2026-10-12查阅
공공누리 제1유형|Korea Open Government License Type 1|公共ヌリ第1類型|韩国公共开放许可证第1类型
공개 사진 기반 외형 재구성 · 제조사 CAD 아님|Exterior reconstructed from public photos · not manufacturer CAD|公開写真に基づく外形再構成 · メーカーCADではありません|公开照片外形重建 · 非制造商CAD
함교 외부 · 추정 시점|Outside the bridge · estimated viewpoint|艦橋外部 · 推定視点|舰桥外部 · 估算视点
조종석 관측 · 추정 시점|Cockpit observation · estimated viewpoint|操縦席観察 · 推定視点|驾驶舱观察 · 估算视点
KAI 공개 치수와 실물 사진을 참고한 외형 재구성|Exterior reconstruction using KAI public dimensions and photos|KAI公開寸法と実物写真を参考にした外形再構成|参考KAI公开尺寸与实物照片的外形重建
KARI 공개 치수·사진 기반 외형 재구성|Exterior reconstruction from KARI public dimensions and photos|KARI公開寸法・写真に基づく外形再構成|基于KARI公开尺寸和照片的外形重建
도산안창호급 실물 사진 · 개별 함 식별이나 3D 잠항 동작을 의미하지 않습니다|Dosan-class photograph · does not identify an individual ship or represent a 3D diving simulation|島山級の実物写真 · 個別艦の識別や3D潜航動作を意味しません|岛山级实物照片 · 不代表单舰识别或3D潜航动作
상세 외형 3D · 원본의 금속 재질 표현이며 실물 위장 도색과 다릅니다|Detailed exterior 3D · original metallic materials differ from actual camouflage paint|詳細外形3D · 原作の金属表現は実物迷彩塗装と異なります|详细外形3D · 原模型金属材质不同于实物迷彩涂装
실제 천무 발사대 사진 · 회전 가능한 3D 자산은 아직 확보되지 않았습니다|Actual Chunmoo launcher photo · rotatable 3D asset not yet obtained|天舞発射機の実物写真 · 回転可能な3D素材は未取得|天舞发射装置实物照片 · 尚未取得可旋转3D资源
실제 장비 사진 · 3D 메시와 실물 CAD가 아닙니다|Actual equipment photo · not a 3D mesh or manufacturer CAD|実物装備写真 · 3Dメッシュや実物CADではありません|实物装备照片 · 非3D网格或实物CAD
수리온 시제기 실사진 · 양산형과 구성이 다를 수 있습니다|Surion prototype photo · configuration may differ from production aircraft|スリオン試作機写真 · 量産型と構成が異なる場合があります|Surion原型机实物照片 · 配置可能与量产型不同
누리호 2021년 발사 실사진 · 민간 우주발사체|Actual 2021 Nuri launch photo · civilian space launch vehicle|ヌリ号2021年打ち上げ写真 · 民間宇宙打ち上げ機|Nuri号2021年发射实物照片 · 民用运载火箭
실제 K9 자주포 사진 · 회전 가능한 3D 메시가 아닙니다|Actual K9 howitzer photo · not a rotatable 3D mesh|K9自走砲実物写真 · 回転可能な3Dメッシュではありません|K9自行火炮实物照片 · 非可旋转3D网格
`;
for(const line of details.trim().split('\n')){const [ko,en,ja,zh]=line.split('|');equipmentTranslations[ko]={en,ja,zh};}
const names = `
대우조선해양 (현재 한화오션)|Daewoo Shipbuilding (now Hanwha Ocean)|大宇造船海洋（現ハンファオーシャン）|大宇造船海洋（现韩华海洋）
HD현대중공업|HD Hyundai Heavy Industries|HD現代重工業|HD现代重工
현대로템|Hyundai Rotem|現代ロテム|现代Rotem
한화에어로스페이스|Hanwha Aerospace|ハンファエアロスペース|韩华航空航天
한국항공우주산업(KAI)|Korea Aerospace Industries (KAI)|韓国航空宇宙産業（KAI）|韩国航空宇宙产业（KAI）
대한항공|Korean Air|大韓航空|大韩航空
항우연 · 국과연 · 국내 기업|KARI · ADD · Korean companies|KARI · ADD · 韓国企業|KARI · ADD · 韩国企业
방사청 · 우주항공청 · 해경|DAPA · KASA · Korea Coast Guard|防衛事業庁 · 宇宙航空庁 · 海洋警察|防卫事业厅 · 宇宙航空厅 · 海警
K808 백호|K808 Baekho|K808白虎|K808白虎
AS21 레드백|AS21 Redback|AS21レッドバック|AS21红背
KF-21 보라매|KF-21 Boramae|KF-21ポラメ|KF-21猎鹰
KUH-1 수리온|KUH-1 Surion|KUH-1スリオン|KUH-1 Surion
T-50 골든이글|T-50 Golden Eagle|T-50ゴールデンイーグル|T-50金鹰
KT-1 웅비|KT-1 Woongbi|KT-1ウンビ|KT-1雄飞
누리호|Nuri|ヌリ号|Nuri号
한국항공우주연구원|Korea Aerospace Research Institute|韓国航空宇宙研究院|韩国航空宇宙研究院
한화시스템|Hanwha Systems|ハンファシステム|韩华系统
천무|Chunmoo|天舞|天舞
천궁-II|Cheongung II|天弓II|天弓II
한화에어로스페이스 · LIG넥스원 · 한화시스템|Hanwha Aerospace · LIG Nex1 · Hanwha Systems|ハンファエアロスペース · LIG Nex1 · ハンファシステム|韩华航空航天 · LIG Nex1 · 韩华系统
한산도함|ROKS Hansando|閑山島艦|闲山岛舰
방위사업청|Defense Acquisition Program Administration|防衛事業庁|防卫事业厅
한국항공우주산업|Korea Aerospace Industries|韓国航空宇宙産業|韩国航空宇宙产业
호주 국방부|Australian Department of Defence|豪州国防省|澳大利亚国防部
대한민국 정부 Korea.net|Korean government · Korea.net|韓国政府 · Korea.net|韩国政府 · Korea.net
대한민국 정부 Korea.net · 국방부 발표 인용|Korean government Korea.net · citing Ministry of National Defense|韓国政府Korea.net · 国防部発表引用|韩国政府Korea.net · 引用国防部公告
한화|Hanwha|ハンファ|韩华
한국항공우주연구원 · 국방과학연구소|KARI · Agency for Defense Development|韓国航空宇宙研究院 · 国防科学研究所|韩国航空宇宙研究院 · 国防科学研究所
LIG D&A · 한화시스템|LIG D&A · Hanwha Systems|LIG D&A · ハンファシステム|LIG D&A · 韩华系统
국방과학연구소|Agency for Defense Development|国防科学研究所|国防科学研究所
한국항공우주연구원 · 전자통신연구원 등|KARI · ETRI and other institutes|KARI · ETRIなど|KARI · ETRI等机构
방위사업청 · 우주항공청 · 해양경찰청|DAPA · KASA · Korea Coast Guard|防衛事業庁 · 宇宙航空庁 · 海洋警察庁|防卫事业厅 · 宇宙航空厅 · 海洋警察厅
경남 사천|Sacheon, Gyeongnam|慶南・泗川|庆南泗川
울산|Ulsan|蔚山|蔚山
경남 창원|Changwon, Gyeongnam|慶南・昌原|庆南昌原
부산|Busan|釜山|釜山
항공 산업|Aviation industry|航空産業|航空工业
함정 건조|Naval shipbuilding|艦艇建造|舰艇建造
지상 체계 산업|Land-system industry|地上装備産業|地面装备产业
무인항공기 체계종합|UAV system integration|無人機システム統合|无人机系统集成
KAI 공식 소개에 공개된 사천 본사와 항공기 사업을 연결했습니다.|Links KAI’s publicly listed Sacheon headquarters with its aircraft programs.|KAI公式紹介の泗川本社と航空機事業を関連付けています。|将KAI官方公开的泗川总部与航空项目连接。
울산 HD현대중공업에서 열린 충남함 인도식 기록을 연결했습니다.|Links the Chungnam handover ceremony at HD Hyundai Heavy Industries in Ulsan.|蔚山HD現代重工業の忠南艦引き渡し式記録を関連付けています。|连接蔚山HD现代重工忠南舰交付仪式记录。
현대로템의 공개 창원 사업장과 K2 제품 사업을 연결했습니다.|Links Hyundai Rotem’s publicly listed Changwon site with its K2 program.|現代ロテムの公開昌原事業場とK2事業を関連付けています。|连接现代Rotem公开昌原厂区与K2项目。
부산 대한항공 테크센터의 MUAV 양산 1호기 출고식 기록입니다.|Record of the first production MUAV rollout at Korean Air’s Busan Tech Center.|釜山大韓航空テックセンターのMUAV量産1号機出庫式記録です。|大韩航空釜山技术中心首架量产MUAV出厂仪式记录。
대한민국 국방부|Republic of Korea Ministry of National Defense|大韓民国国防部|大韩民国国防部
ROKAF / KAI 공개 사진|ROKAF / KAI public photo|韓国空軍 / KAI公開写真|韩国空军 / KAI公开照片
대한민국 국군 Republic of Korea Armed Forces|Republic of Korea Armed Forces|大韓民国国軍|大韩民国国军
권순삼, 국방시민연대 (Defense Citizen Network)|Kwon Soon-sam, Defense Citizen Network|クォン・スンサム、国防市民連帯|权顺三，国防市民联合
국방부 - ROK Ministry of National Defense|ROK Ministry of National Defense|韓国国防部|韩国国防部
대한민국 국방부 - Ministry of National Defense of the Republic of Korea|Republic of Korea Ministry of National Defense|大韓民国国防部|大韩民国国防部
방위사업청 - Defense Acquisition Program Administration (DAPA)|Defense Acquisition Program Administration (DAPA)|防衛事業庁（DAPA）|防卫事业厅（DAPA）
한국항공우주연구원 (Korea Aerospace Research Institute)|Korea Aerospace Research Institute (KARI)|韓国航空宇宙研究院（KARI）|韩国航空宇宙研究院（KARI）
`;
for(const line of names.trim().split('\n')){const [ko,en,ja,zh]=line.split('|');equipmentTranslations[ko]={en,ja,zh};}
const combinations=['기동·보병 지원 · 보병전투장갑차','탄약 지원 · 탄약운반장갑차','기동·수송 · 차륜형장갑차','기동·보병 지원 · 수출형 보병전투장갑차','항공 · 한국형 전투기','공중 기동 · 기동헬기','항공 지원 · 소형무장헬기','비행 교육 · 고등훈련기','비행 교육 · 기본훈련기','우주 수송 · 우주발사체 · 민간 우주 기반','위성 통신 · 군 위성통신체계','방공 · 중거리 지대공 체계','교육·의무 지원 · 해상 교육훈련함'];
equipmentTranslations['우주발사체']={en:'Launch vehicle',ja:'宇宙打ち上げ機',zh:'运载火箭'};
equipmentTranslations['민간 우주 기반']={en:'Civilian space infrastructure',ja:'民間宇宙基盤',zh:'民用航天基础'};
for(const ko of combinations) equipmentTranslations[ko]=Object.fromEntries(['en','ja','zh'].map(lang=>[lang,ko.split(' · ').map(part=>equipmentTranslations[part][lang]).join(' · ')]));
for(const ko of ['K21 프로그램','K10 프로그램','K808 백호 프로그램','AS21 레드백 프로그램','KF-21 보라매 프로그램','KUH-1 수리온 프로그램','LAH 프로그램','T-50 골든이글 프로그램','KT-1 웅비 프로그램','누리호 프로그램','ANASIS-II 프로그램','천궁-II 프로그램','한산도함 프로그램']){
 const base=ko.replace(' 프로그램','');equipmentTranslations[ko]=Object.fromEntries(['en','ja','zh'].map(lang=>[lang,(equipmentTranslations[base]?.[lang]||base)+({en:' program',ja:'事業',zh:'项目'}[lang])]));
}
const documents = `
K2 전차|K2 tank|K2戦車|K2坦克
K9 자주포|K9 self-propelled howitzer|K9自走砲|K9自行火炮
중고도정찰용무인항공기 양산|Medium-altitude reconnaissance UAV production|中高度偵察無人機量産|中空侦察无人机量产
상륙돌격장갑차 RCWS|Amphibious assault vehicle RCWS|水陸両用装甲車RCWS|两栖突击装甲车RCWS
군 정찰위성 425사업|Military reconnaissance satellite Project 425|軍偵察衛星425事業|军用侦察卫星425项目
초소형위성체계 개발|Small satellite system development|超小型衛星システム開発|小型卫星系统开发
K방산 기술집약체 충남함 해군 인도|Chungnam, integrating Korean defense technologies, delivered to Navy|韓国防衛技術を集約した忠南艦を海軍へ引き渡し|集成韩国防务技术的忠南舰交付海军
폴란드 K2 추가계약 발표 및 기존 이행계약|Additional Polish K2 contract announcement and existing execution contracts|ポーランドK2追加契約発表と既存履行契約|波兰K2追加合同公告及现有执行合同
현대로템 연혁|Hyundai Rotem history|現代ロテム沿革|现代Rotem沿革
감시·정찰능력 향상과 미래 방산수출에 기여한다|Improving surveillance and reconnaissance; supporting future defense exports|監視・偵察能力向上と将来の防衛輸出への貢献|提升监视侦察能力并支持未来防务出口
킬체인의 눈, 본격 임무 시작!|The eyes of Kill Chain begin missions|キルチェーンの目、本格任務開始|杀伤链之眼开始执行任务
425사업 5호 정찰위성 목표 궤도 진입|Fifth Project 425 reconnaissance satellite reaches target orbit|425事業5号偵察衛星が目標軌道へ|425项目第五颗侦察卫星进入目标轨道
상륙돌격장갑차 원격사격통제체계 전력화 완료|Amphibious vehicle remote firing-control system fielding completed|水陸両用装甲車遠隔射撃統制システム配備完了|两栖突击装甲车遥控射击控制系统列装完成
초소형위성체계 개발 정상 추진 중|Small satellite system development progressing|超小型衛星システム開発を推進中|小型卫星系统开发正常推进
국내 독자 설계·건조 도산안창호함 취역|Korean-designed and built Dosan Ahn Chang-ho commissioned|韓国独自設計・建造の島山安昌浩艦就役|韩国自主设计建造的岛山安昌浩舰入役
K9·천무 공식 제품 소개|Official K9 and Chunmoo product overview|K9・天舞公式製品紹介|K9与天舞官方产品介绍
FA-50 공식 제품 소개|Official FA-50 product overview|FA-50公式製品紹介|FA-50官方产品介绍
T-50·FA-50 항공전자|T-50 and FA-50 avionics|T-50・FA-50航空電子|T-50与FA-50航空电子
MUAV 양산 1호기 출고|First production MUAV rollout|MUAV量産1号機出庫|首架量产MUAV出厂
현대로템 국내 사업장|Hyundai Rotem Korean sites|現代ロテム韓国内事業場|现代Rotem韩国厂区
K10·K21 지상 제품|K10 and K21 land products|K10・K21地上製品|K10与K21地面产品
KAI 지속가능성보고서 2025|KAI Sustainability Report 2025|KAI持続可能性報告書2025|KAI可持续发展报告2025
K808/K806 차륜형장갑차|K808/K806 wheeled armored vehicles|K808/K806装輪装甲車|K808/K806轮式装甲车
Redback 129대 공급 계약|Contract to supply 129 Redback vehicles|レッドバック129両供給契約|129辆红背供应合同
루마니아 K9·K10 공급 계약|Romanian K9 and K10 supply contract|ルーマニアK9・K10供給契約|罗马尼亚K9与K10供应合同
이집트 K9 패키지 계약|Egyptian K9 package contract|エジプトK9パッケージ契約|埃及K9成套合同
말레이시아 FA-50 18대 계약|Malaysian contract for 18 FA-50s|マレーシアFA-50 18機契約|马来西亚18架FA-50合同
Global Capabilities 공식 브로슈어|Official Global Capabilities brochure|Global Capabilities公式パンフレット|Global Capabilities官方手册
한국형발사체 누리호|Korean launch vehicle Nuri|韓国型打ち上げ機ヌリ号|韩国运载火箭Nuri号
ANASIS-II 통신체계|ANASIS-II communications system|ANASIS-II通信システム|ANASIS-II通信系统
항공·방공 사업 소개|Aviation and air-defense programs|航空・防空事業紹介|航空与防空项目介绍
해상 교육훈련함 한산도함 인도|Naval training ship Hansando delivered|海上練習艦閑山島艦引き渡し|海上训练舰闲山岛舰交付
`;
for(const line of documents.trim().split('\n')){const [ko,en,ja,zh]=line.split('|');equipmentTranslations[ko]={en,ja,zh};}
