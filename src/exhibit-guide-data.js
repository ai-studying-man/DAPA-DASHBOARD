export const guideLanguages = {
  ko: { label: '한국어', locale: 'ko-KR' },
  en: { label: 'English', locale: 'en-US' },
  ja: { label: '日本語', locale: 'ja-JP' },
  zh: { label: '中文', locale: 'zh-CN' },
};

export const exhibitGuides = {
  kaav: {
    intro: {
      ko: 'KAAV는 해상과 지상에서 운용하는 상륙 인원 수송 장갑차입니다. 이 전시는 공개 사진을 참고한 외형 재구성이며, 제조사 CAD나 검증된 내부 모델이 아닙니다.',
      en: 'KAAV is an amphibious armored troop carrier for operations at sea and on land. This exhibit reconstructs its exterior from public photographs; it is not manufacturer CAD or a verified interior.',
      ja: 'KAAVは海上と陸上で運用する水陸両用の装甲人員輸送車です。この展示は公開写真を参考にした外観の再構成で、メーカーのCADや検証済みの内部モデルではありません。',
      zh: 'KAAV是用于海上和陆地行动的两栖装甲人员运输车。本展品依据公开照片重建外观，并非制造商CAD或经验证的内部模型。',
    },
    components: [
      {
        id: 'bow',
        title: { ko: '선수와 파도막이', en: 'Bow and wave deflector', ja: '車体前部と波よけ', zh: '车体前部与挡浪板' },
        text: {
          ko: '공개 상륙훈련 사진에서 보이는 경사진 선수와 파도막이를 살펴봅니다. 모델의 형상과 치수는 사진 기반 추정입니다.',
          en: 'Observe the sloped bow and wave deflector visible in public landing-exercise photographs. Their modeled shape and dimensions are estimates.',
          ja: '公開された上陸訓練写真に見える傾斜した車体前部と波よけを観察します。モデルの形状と寸法は写真に基づく推定です。',
          zh: '观察公开登陆训练照片中可见的倾斜车体前部和挡浪板。模型形状与尺寸均为依据照片的估计。',
        },
        focus: [0, 3.8, 1.45], range: 8,
        source: 'https://commons.wikimedia.org/wiki/File:2010.7.7_해병_1사단_KAAV한국형상륙돌격장갑차_상륙훈련_(7445513192).jpg',
      },
      {
        id: 'tracks',
        title: { ko: '궤도와 전륜', en: 'Tracks and road wheels', ja: '履帯と転輪', zh: '履带与负重轮' },
        text: {
          ko: '육상 이동을 위한 궤도와 편측 여섯 개 전륜을 표현했습니다. 움직임이나 현가장치 성능을 검증한 시뮬레이션은 아닙니다.',
          en: 'The reconstruction depicts tracks and six road wheels on each side for land movement. It does not validate suspension performance or motion.',
          ja: '陸上移動用の履帯と片側六個の転輪を表現しています。動作や懸架装置の性能を検証するシミュレーションではありません。',
          zh: '模型表现了用于陆地移动的履带和每侧六个负重轮，并不验证悬架性能或实际运动。',
        },
        focus: [1.4, 0, .65], range: 7,
        source: 'https://commons.wikimedia.org/wiki/File:2010.7.7_해병_1사단_KAAV한국형상륙돌격장갑차_상륙훈련_(7445513192).jpg',
      },
      {
        id: 'roof',
        title: { ko: '상부 해치', en: 'Roof hatch', ja: '上部ハッチ', zh: '顶部舱口' },
        text: {
          ko: '차체 상부의 해치와 관측 위치를 살펴봅니다. 전시 시점은 외형에 맞춘 추정 위치이며 승무원실 내부를 재현하지 않습니다.',
          en: 'Explore the roof hatch and viewing position. The exhibit viewpoint is estimated from the exterior and does not reproduce the crew compartment.',
          ja: '車体上部のハッチと観察位置を見ます。展示の視点は外観に合わせた推定位置で、乗員室内部を再現していません。',
          zh: '查看顶部舱口和观察位置。展示视点依据外观估计，不再现乘员舱内部。',
        },
        focus: [-.62, 2.7, 2.25], range: 6,
        source: 'https://commons.wikimedia.org/wiki/File:2010.7.7_해병_1사단_KAAV한국형상륙돌격장갑차_상륙훈련_(7445513192).jpg',
      },
    ],
    benchmark: {
      title: 'DOES · Hanwha WebGL showroom', url: 'https://www.does.kr/project/hanwha-aero-en/',
      text: { ko: '제작사 DOES는 한화의 K9·REDBACK·누리호 WebGL 전시 제작을 설명합니다. KAAV 전시 사례는 아닙니다. 여기서는 유사한 부위 선택과 해설 관람 방식을 적용했습니다.', en: 'DOES describes creating Hanwha’s WebGL exhibits for K9, REDBACK and Nuri, not KAAV. This exhibit applies a comparable component-selection and guided-commentary approach.', ja: '制作会社DOESは韓華のK9、REDBACK、ヌリ号のWebGL展示制作を紹介しています。KAAVの展示事例ではありません。ここでは類似の部位選択と解説付き観覧方式を採用しています。', zh: '制作公司DOES介绍了韩华K9、REDBACK和Nuri的WebGL展览制作，并非KAAV案例。本展品采用类似的部位选择与解说导览方式。' },
    },
  },
  fa50: {
    intro: {
      ko: 'FA-50은 KAI의 2인승 전투기입니다. 공개 외형 사진과 공식 자료를 참고한 전시 재구성이며, 조종석과 착륙장치 세부는 설명용입니다.',
      en: 'FA-50 is a two-seat fighter produced by KAI. This exhibit uses public exterior photographs and official references; cockpit and landing-gear details are illustrative.',
      ja: 'FA-50はKAI製の複座戦闘機です。公開外観写真と公式資料を参考にした展示で、操縦席と降着装置の細部は説明用です。',
      zh: 'FA-50是KAI制造的双座战斗机。本展品参考公开外观照片与官方资料，座舱和起落架细节仅作展示说明。',
    },
    components: [
      {
        id: 'canopy', title: { ko: '복좌 캐노피', en: 'Tandem canopy', ja: '複座キャノピー', zh: '串列双座座舱盖' },
        text: { ko: '앞뒤 두 좌석을 덮는 캐노피를 살펴봅니다. 제조사 자료는 2인승을 명시하지만, 이 모델의 좌석과 시점은 실측 검증 자료가 아닙니다.', en: 'Observe the canopy over the tandem seats. KAI specifies two occupants, but this model’s seats and viewpoints are not measured or verified interiors.', ja: '前後の座席を覆うキャノピーを観察します。KAIは二人乗りと明記していますが、このモデルの座席と視点は実測・検証された内部資料ではありません。', zh: '观察覆盖前后座位的座舱盖。KAI注明载员两人，但模型中的座位和视点并非实测或经验证的内部资料。' },
        focus: [0, 3, 2.85], range: 7, source: 'https://www.koreaaero.com/EN/Business/FA50.aspx',
      },
      {
        id: 'wing', title: { ko: '주익', en: 'Main wing', ja: '主翼', zh: '主翼' },
        text: { ko: '기체 양쪽의 주익과 외형을 관찰합니다. 외형 재구성의 패널과 장착부는 전시용 추정이며 공력이나 무장 운용을 시뮬레이션하지 않습니다.', en: 'Inspect the main wing and aircraft outline. Reconstructed panels and mounts are exhibit estimates, not an aerodynamic or weapons-operation simulation.', ja: '主翼と機体外形を観察します。パネルや取付部は展示用の推定で、空力や兵装運用のシミュレーションではありません。', zh: '观察主翼与机体轮廓。重建的面板和挂载部位是展示估计，不进行气动或武器操作模拟。' },
        focus: [2.7, -.5, 2.15], range: 9, source: 'https://www.koreaaero.com/EN/Business/FA50.aspx',
      },
      {
        id: 'engine', title: { ko: '후방 엔진 출구', en: 'Rear engine outlet', ja: '後部エンジン出口', zh: '后部发动机出口' },
        text: { ko: '기체 후방의 엔진 출구 외형을 살펴봅니다. KAI는 F404-GE-102 엔진을 소개합니다. 내부 엔진 구조와 작동은 이 전시에서 재현하지 않습니다.', en: 'Observe the rear engine outlet. KAI identifies the F404-GE-102 engine; its internal structure and operation are not reproduced here.', ja: '機体後部のエンジン出口を観察します。KAIはF404-GE-102エンジンを紹介しています。内部構造や作動は再現していません。', zh: '观察机体后部的发动机出口。KAI介绍的发动机为F404-GE-102，本展品不再现其内部结构或运行。' },
        focus: [0, -6.3, 2.17], range: 6, source: 'https://www.koreaaero.com/VIRTUAL_EX/PDF/FA50_ExportVersion/FA-50_ENG_BROCHURE_202510.pdf',
      },
    ],
    benchmark: {
      title: 'KAI · FA-50 Training System', url: 'https://www.koreaaero.com/EN/Business/TrainingSystem.aspx',
      text: { ko: 'KAI는 FA-50 훈련체계를 공식 소개합니다. 여기서는 외형 부위 선택과 해설을 연결해 관람을 안내합니다. 실제 훈련체계나 검증된 조종석을 복제한 것은 아닙니다.', en: 'KAI officially presents its FA-50 training system. Here, component selection and commentary guide exterior viewing; this is not a reproduction of the training system or a verified cockpit.', ja: 'KAIはFA-50訓練体系を公式に紹介しています。ここでは外観の部位選択と解説を連動させて観覧を案内します。実際の訓練体系や検証済み操縦席の複製ではありません。', zh: 'KAI官方介绍FA-50训练体系。本展品通过外观部位选择和解说引导参观，并非实际训练系统或经验证座舱的复制。' },
    },
  },
  dosan: {
    intro: {
      ko: '도산안창호급 잠수함의 공개 외형 사진을 참고한 전시입니다. 선체와 세일의 형상은 추정 재구성이며, 특정 함정의 제조사 CAD나 검증된 내부 구조가 아닙니다.',
      en: 'This exhibit references public exterior imagery of the Dosan Ahn Changho submarine class. Hull and sail shapes are estimated reconstructions, not manufacturer CAD or verified interiors of an individual vessel.',
      ja: '島山安昌浩級潜水艦の公開外観写真を参考にした展示です。船体とセイルは推定による再構成で、特定艦のメーカーCADや検証済み内部構造ではありません。',
      zh: '本展品参考岛山安昌浩级潜艇的公开外观照片。艇体和围壳为估计重建，并非某一艘艇的制造商CAD或经验证的内部结构。',
    },
    components: [
      {
        id: 'hull', title: { ko: '선체 외형', en: 'Hull exterior', ja: '船体外形', zh: '艇体外观' },
        text: { ko: '긴 선체와 둥근 함수 외형을 관찰합니다. 사진에 드러나지 않은 수중부는 설명용 추정이며 실제 선체 치수를 검증한 모델이 아닙니다.', en: 'Observe the long hull and rounded bow. Underwater areas absent from the reference image are illustrative estimates; this is not a verified dimensional model.', ja: '長い船体と丸みを帯びた艦首を観察します。写真に見えない水中部分は説明用の推定で、実寸を検証したモデルではありません。', zh: '观察修长的艇体与圆润艇首。参考照片中不可见的水下部分仅作示意估计，模型尺寸未经实艇验证。' },
        focus: [0, 32, 5.35], range: 35, source: 'https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png',
      },
      {
        id: 'sail', title: { ko: '세일과 상부 마스트', en: 'Sail and upper masts', ja: 'セイルと上部マスト', zh: '围壳与上部桅杆' },
        text: { ko: '선체 위로 솟은 세일과 마스트 외형을 살펴봅니다. 세부 장비의 형식과 위치는 추정 표현이며 센서 성능이나 내부 구조를 검증하지 않습니다.', en: 'Inspect the sail and mast outlines above the hull. Equipment types and positions are estimated; sensor performance and internal structures are not validated.', ja: '船体上のセイルとマストの外形を見ます。装備の形式と位置は推定で、センサー性能や内部構造は検証していません。', zh: '观察艇体上方的围壳与桅杆轮廓。设备类型和位置为估计，不验证传感器性能或内部结构。' },
        focus: [0, 17, 15.75], range: 19, source: 'https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png',
      },
      {
        id: 'deck', title: { ko: '상부 갑판', en: 'Upper deck', ja: '上部甲板', zh: '上部甲板' },
        text: { ko: '선체 상부의 갑판과 해치 표현을 관찰합니다. 갑판 관측 시점은 전시용으로 정한 위치이며 실제 함교 운용이나 승조원실을 재현하지 않습니다.', en: 'Explore the represented deck and hatches. The deck viewpoint is an exhibit choice, not a reproduction of bridge operation or crew spaces.', ja: '甲板とハッチの表現を観察します。甲板視点は展示用に設定した位置で、実際の艦橋操作や乗員区画は再現していません。', zh: '观察甲板和舱口的展示形态。甲板视点是展示设置，并不再现实际舰桥操作或艇员舱室。' },
        focus: [0, 0, 10.1], range: 25, source: 'https://commons.wikimedia.org/wiki/File:ROKS_Dosan_Ahn_Changho_class_submarine.png',
      },
    ],
    benchmark: {
      title: 'Naval Group · Naval XPlore (DEFEA 2023)', url: 'https://www.naval-group.com/en/presse/naval-group-participates-defea-greece',
      text: { ko: 'Naval Group은 DEFEA 2023에서 맞춤형 몰입형 3D 고객 설명 공간 Naval XPlore를 소개했습니다. 도산안창호급 모델 사례는 아닙니다. 여기서는 부위별 카메라와 해설을 연결하는 관람 방식을 적용했습니다.', en: 'At DEFEA 2023, Naval Group presented Naval XPlore, a customizable immersive 3D customer briefing space, not a Dosan-class model. Here, component camera views are linked with commentary.', ja: 'Naval GroupはDEFEA 2023で、個別対応できる没入型3D顧客説明空間Naval XPloreを紹介しました。島山安昌浩級モデルの事例ではありません。ここでは部位別カメラと解説を連動させています。', zh: 'Naval Group在DEFEA 2023介绍了可定制的沉浸式3D客户展示空间Naval XPlore，并非岛山安昌浩级模型案例。本展品将部位镜头与解说相连接。' },
    },
  },
  nuri: {
    intro: {
      ko: '누리호는 한국의 무인 우주발사체입니다. KARI 공식 자료의 높이 47.2미터와 최대 직경 3.5미터를 참고한 외형 전시 재구성이며, 제조사 CAD나 발사 물리 시뮬레이션이 아닙니다.',
      en: 'Nuri is an uncrewed Korean space launch vehicle. This exterior exhibit references KARI’s 47.2-meter height and 3.5-meter maximum diameter; it is not manufacturer CAD or a launch-physics simulation.',
      ja: 'ヌリ号は韓国の無人宇宙打上げ機です。KARIの高さ47.2メートル、最大直径3.5メートルを参考にした外観展示で、メーカーCADや打上げ物理シミュレーションではありません。',
      zh: '“世界”号Nuri是韩国的无人运载火箭。本外观展品参考KARI公布的47.2米高度和3.5米最大直径，并非制造商CAD或发射物理模拟。',
    },
    components: [
      {
        id: 'engines', title: { ko: '1단과 엔진 구성', en: 'First stage and engine configuration', ja: '第1段とエンジン構成', zh: '第一级与发动机配置' },
        text: { ko: 'KARI는 1단에 75톤급 엔진 네 개를 사용한다고 설명합니다. 전시의 네 노즐은 외형 설명용이며 엔진 내부나 연소를 재현하지 않습니다.', en: 'KARI describes four 75-ton-class engines in the first stage. The four exhibit nozzles illustrate the exterior, not engine internals or combustion.', ja: 'KARIは第1段に75トン級エンジン四基を使用すると説明しています。展示の四つのノズルは外観説明用で、内部や燃焼は再現していません。', zh: 'KARI说明第一级使用四台75吨级发动机。展品的四个喷管用于外观说明，不再现发动机内部或燃烧。' },
        focus: [0, 0, 10], range: 36, source: 'https://www.kari.re.kr/vrshowroom/nuriho/index.html',
      },
      {
        id: 'stages', title: { ko: '3단 구성', en: 'Three-stage configuration', ja: '3段構成', zh: '三级结构' },
        text: { ko: '누리호는 세 단계로 구성됩니다. KARI 공식 전시는 각 단의 역할을 설명합니다. 이 모델의 세부 단 길이와 외부 덮개는 공개 자료 기반 추정입니다.', en: 'Nuri has three stages. KARI’s official exhibit explains their roles. Detailed stage lengths and external covers in this model are estimates from public references.', ja: 'ヌリ号は3段構成です。KARIの公式展示では各段の役割を説明しています。このモデルの細かな段長や外部カバーは公開資料に基づく推定です。', zh: 'Nuri由三级组成，KARI官方展览说明各级作用。模型中的细分级段长度和外部盖板依据公开资料估计。' },
        focus: [0, 0, 26.5], range: 30, source: 'https://www.kari.re.kr/vrshowroom/nuriho/index.html',
      },
      {
        id: 'fairing', title: { ko: '위성 보호 페어링', en: 'Payload fairing', ja: '衛星保護フェアリング', zh: '载荷整流罩' },
        text: { ko: '맨 위의 페어링은 발사 초기 환경에서 탑재 위성을 보호하는 덮개입니다. KARI의 공식 설명을 참고했으며 전시 형상은 추정 외형입니다.', en: 'The fairing at the top protects the satellite payload during early flight. This follows KARI’s official explanation; the exhibit shape is an estimated exterior.', ja: '最上部のフェアリングは打上げ初期に搭載衛星を保護する覆いです。KARIの公式説明を参考にしており、展示形状は推定外観です。', zh: '顶部整流罩在飞行初期保护搭载的卫星。说明依据KARI官方资料，展示形状为估计外观。' },
        focus: [0, 0, 44.4], range: 12, source: 'https://www.kari.re.kr/vrshowroom/nuriho/index.html',
      },
    ],
    benchmark: {
      title: 'KARI · Nuri VR SHOWROOM', url: 'https://www.kari.re.kr/vrshowroom/nuriho/index.html',
      text: { ko: 'KARI 공식 VR에서 엔진과 탱크, 페어링 설명을 확인합니다. 공식 웹 열람과 CAD 원본 확보는 구분됩니다.', en: 'KARI’s official VR explains engines, tanks and the fairing. Viewing the official site does not mean obtaining original CAD.', ja: 'KARIの公式VRでエンジン、タンク、フェアリングの説明を確認できます。公式サイトの閲覧とCAD原本の取得は別です。', zh: '在KARI官方VR中了解发动机、贮箱和整流罩。浏览官方网站不等于获得原始CAD。' },
    },
  },
};

export const foreignGuideExample = {
  title: 'Saab · Gripen E WAD (2018)',
  url: 'https://www.saab.com/newsroom/press-releases/2018/saab-presents-gripen-e-simulator-with-wide-area-display',
  text: {
    ko: 'Saab은 2018년 Defexpo에서 대형 조종석 화면 WAD를 갖춘 Gripen E 시뮬레이터를 전시한다고 발표했습니다. 이 전시는 부위 선택·카메라·해설 연결 방식을 참고합니다. 해당 시뮬레이터나 검증된 조작계를 재현한 것은 아닙니다.',
    en: 'Saab announced a Gripen E simulator with a Wide Area Display for Defexpo 2018. This exhibit takes inspiration for linking component selection, cameras and commentary; it does not reproduce that simulator or validated controls.',
    ja: 'Saabは2018年のDefexpoで大画面WADを備えたGripen Eシミュレーターを展示すると発表しました。本展示は部位選択、カメラ、解説の連動を参考にしており、そのシミュレーターや検証済み操作装置の再現ではありません。',
    zh: 'Saab宣布在2018年Defexpo展出配备广域显示器WAD的Gripen E模拟器。本展品借鉴部位选择、镜头与解说的联动方式，并不复制该模拟器或经验证的操纵系统。',
  },
};
