
import { Route, Celebrity, SpecialItem } from '../types';
import * as googleSheetSync from './googleSheetSync';

/**
 * 从 Google Sheets 加载数据
 * 优先使用本地缓存，24小时后自动更新
 */

// 初始化时从 Google Sheets 加载（支持离线访问）
let LOADED_ROUTES: Route[] | null = null;
let LOADED_CELEBRITIES: Celebrity[] | null = null;
let LOADED_SPECIALS: SpecialItem[] | null = null;

/**
 * 初始化数据加载
 */
export const initializeData = async () => {
  const data = await googleSheetSync.getAllDataFromSheet();
  LOADED_ROUTES = data.routes;
  LOADED_CELEBRITIES = data.celebrities;
  LOADED_SPECIALS = data.specials;
};

/**
 * 手动刷新数据（从 Google Sheets）
 */
export const refreshData = async () => {
  const data = await googleSheetSync.getAllDataFromSheet(true);
  LOADED_ROUTES = data.routes;
  LOADED_CELEBRITIES = data.celebrities;
  LOADED_SPECIALS = data.specials;
  return data;
};

/**
 * 获取缓存状态
 */
export const getCacheInfo = () => googleSheetSync.getCacheStatus();

// =====================
// 导出数据 (支持降级到本地)
// =====================

// 若 Google Sheets 加载失败，使用备用静态数据
export const STATIC_ROUTES: Route[] = LOADED_ROUTES || [
  {
    name: "红色革命追忆路线",
    category: "历史文化",
    description: "追寻革命足迹，感受红色历史的激情与荣耀。",
    imagePrompt: "Red revolution memorial hall china vintage atmosphere",
    imageUrl: "http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/640%20%281%29.webp?e=1763669811&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:_o4-enIGCd1VQCX9fQGKaOnR0NQ=",
    spots: [
      {
        id: "poi_red_001",
        name: "永春辛亥革命纪念馆",
        coord: "118.20524049,25.23411225",
        distance: "约0米",
        intro_short: "缅怀先烈，传承红色基因",
        intro_txt: "永春为闽南著名侨乡，辛亥革命时期，有大批旅居海外的永春籍华侨和留学生，和郑玉指一样，感愤清廷腐败，谋求民族振兴，出资出力支持民主革命。纪念馆依托东里村郑氏宗祠基础上修建而成，展示永春人与辛亥革命的渊源。",
        imagePrompt: "chinese ancestral hall memorial museum architecture",
        imageUrl: "http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/shuyuan.webp-50?e=1763669915&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:rgb5WuVZsu13hdeiQlA9hLwEZtE=",
        position: { top: "40%", left: "45%" },
        tags: ["红色地标", "辛亥历史", "爱国主义"],
        postcardText: "革命星火 代代相传",
        audioUrl: "/audio/spots/poi_red_001.mp3"
      },
      {
        id: "poi_red_002",
        name: "旌义状石碑",
        coord: "118.20423698,25.23566419",
        distance: "约200米",
        intro_short: "孙中山亲颁，见证华侨爱国情",
        intro_txt: "1912年孙中山为表彰郑玉指对革命的贡献，特颁发旌义状。此旌义状于民国年间被刻于石碑，立于郑玉指的家乡—东里村。这块石碑，见证了郑玉指的爱国情怀，是极其珍贵的历史文物。",
        imagePrompt: "ancient stone tablet chinese inscription pavilion",
        position: { top: "35%", left: "50%" },
        tags: ["孙中山亲颁", "石碑文物", "华侨之光"],
        postcardText: "旌义千秋 丹心报国",
        audioUrl: "/audio/spots/poi_red_002.mp3"
      },
      {
        id: "poi_red_003",
        name: "古炮楼",
        coord: "118.206120,25.236500", // Approximate based on context
        distance: "约500米",
        intro_short: "百年沧桑，守护村庄安宁",
        intro_txt: "始建于明代，清末重建，抗日战争时期作为瞭望哨使用，位于布兜山顶，可俯瞰全村。斑驳的墙体诉说着抗倭、抗匪、抗战的历史沧桑。",
        imagePrompt: "old chinese watchtower brick defense structure rural",
        position: { top: "20%", left: "60%" },
        tags: ["军事遗址", "全村俯瞰", "百年炮楼"],
        postcardText: "岁月无声 炮楼巍峨",
        audioUrl: "/audio/spots/poi_red_003.mp3"
      },
      {
        id: "poi_red_004",
        name: "集庆廊桥",
        coord: "118.203500,25.233800", // Approximate
        distance: "约300米",
        intro_short: "风雨廊桥，连接历史与未来",
        intro_txt: "清末始建，1956年旅菲侨亲重修，2016年旅星侨亲郑少华捐资重建。它是侨胞参与家乡建设的历史见证，展现了传统闽南建筑工艺的精巧。",
        imagePrompt: "chinese covered bridge wooden architecture stream",
        position: { top: "55%", left: "40%" },
        tags: ["闽南廊桥", "侨胞捐建", "非遗建筑"],
        postcardText: "廊桥遗梦 风雨同舟",
        audioUrl: "/audio/spots/poi_red_004.mp3"
      },
      {
        id: "poi_red_005",
        name: "洋杆尾古民居",
        coord: "118.207000,25.234500", // Approximate
        distance: "约400米",
        intro_short: "红砖古厝，诉说侨乡往事",
        intro_txt: "包含革命烈士郑拔桶故居，典型的闽南传统民居建筑群。燕尾脊、红砖墙，展现了浓郁的侨乡文化特色，也记录了华侨抗日、支援革命的峥嵘岁月。",
        imagePrompt: "traditional chinese red brick house minnan style",
        position: { top: "45%", left: "65%" },
        tags: ["烈士故居", "红砖古厝", "建筑艺术"],
        postcardText: "红砖燕尾 故土情深",
        audioUrl: "/audio/spots/poi_red_005.mp3"
      },
      {
        id: "poi_red_006",
        name: "昭灵宫",
        coord: "118.205000,25.235000", // Approximate
        distance: "约150米",
        intro_short: "信仰中心，祈福平安",
        intro_txt: "武安尊王圣诞巡境的重要场所，承载着村民的信仰与寄托。每年农历六月十七举行盛大巡境活动，热闹非凡，是体验当地民俗文化的绝佳之地。",
        imagePrompt: "chinese temple colorful roof intricate details",
        position: { top: "38%", left: "48%" },
        tags: ["民间信仰", "巡境活动", "雕梁画栋"],
        postcardText: "香火鼎盛 祈愿安康",
        audioUrl: "/audio/spots/poi_red_006.mp3"
      }
    ]
  },
  {
    name: "自然生态民俗游",
    category: "自然风景",
    description: "亲近自然，体验乡村生态乐趣。",
    imagePrompt: "Green terraced fields mountains misty china village",
    spots: [
      {
        id: "poi_eco_001",
        name: "仙灵瀑布",
        coord: "118.201000,25.238000", // Approximate
        distance: "约1.5公里",
        intro_short: "飞流直下，山间清凉秘境",
        intro_txt: "垂直落差120米，福建省内落差最大瀑布之一。中段有水帘古道，下有深潭。置身其中，水雾扑面，清凉沁脾，是自然探险和摄影的胜地。",
        imagePrompt: "huge waterfall nature green forest cliff",
        position: { top: "10%", left: "20%" },
        tags: ["百米飞瀑", "避暑胜地", "水帘洞天"],
        postcardText: "飞流直下 亦幻亦真",
        audioUrl: "/audio/spots/poi_eco_001.mp3"
      },
      {
        id: "poi_eco_002",
        name: "豆磨古寨",
        coord: "118.202000,25.239000", // Approximate
        distance: "约1.8公里",
        intro_short: "云端古寨，俯瞰千亩梯田",
        intro_txt: "明嘉靖年间抗倭历史遗址，位于山顶，视野极佳。可俯瞰全村梯田与山林，感受山地生态系统的壮美，遥想当年抗倭的烽火岁月。",
        imagePrompt: "mountain peak ancient ruins view of valley",
        position: { top: "5%", left: "30%" },
        tags: ["抗倭遗址", "登高望远", "云海梯田"],
        postcardText: "古寨雄风 山河壮丽",
        audioUrl: "/audio/spots/poi_eco_002.mp3"
      },
      {
        id: "poi_eco_003",
        name: "东里水库",
        coord: "118.20442982,25.23773823",
        distance: "约800米",
        intro_short: "湖光山色，漫步油桐花海",
        intro_txt: "东里村的主要水源地，湖光山色，碧水蓝天。每年四五月，岸边油桐花盛开，如雪花般飘落，漫步其间，仿佛置身童话世界。",
        imagePrompt: "calm lake reservoir reflection mountains white flowers",
        position: { top: "25%", left: "35%" },
        tags: ["油桐花海", "湖畔漫步", "生态水源"],
        postcardText: "湖光潋滟 花雨纷飞",
        audioUrl: "/audio/spots/poi_eco_003.mp3"
      },
      {
        id: "poi_eco_004",
        name: "功能农业基地",
        coord: "118.206000,25.232000", // Approximate
        distance: "约1公里",
        intro_short: "科技助农，健康养生新体验",
        intro_txt: "展示了高花色苷黑米、高β胡萝卜素甘薯等13种防癌功能作物。在这里，您可以了解现代农业科技，体验采摘乐趣，购买健康农产品。",
        imagePrompt: "agriculture farm crops green fields",
        position: { top: "70%", left: "70%" },
        tags: ["农业科普", "亲子采摘", "健康养生"],
        postcardText: "耕耘大地 收获健康",
        audioUrl: "/audio/spots/poi_eco_004.mp3"
      },
      {
        id: "poi_eco_005",
        name: "特色果园",
        coord: "118.208000,25.233000", // Approximate
        distance: "约1.2公里",
        intro_short: "四季飘香，甜蜜的田园时光",
        intro_txt: "种植有百香果、黄金果等特色水果。果园内瓜果飘香，您可以亲手采摘成熟的果实，品尝“树上熟”的鲜甜，享受惬意的田园时光。",
        imagePrompt: "orchard fruit trees passion fruit garden",
        imageUrl: "http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/caizhai2.webp?e=1763669873&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:8d9oOb5gjQQoyX0JHrFnie9cki8=",
        position: { top: "65%", left: "80%" },
        tags: ["百香果园", "甜蜜采摘", "田园风光"],
        postcardText: "硕果累累 甜蜜满园",
        audioUrl: "/audio/spots/poi_eco_005.mp3"
      }
    ]
  },
  {
    name: "深度民俗文化体验",
    category: "美食体验", // mapped to 'Folk' conceptually but using existing category types
    description: "沉浸传统文化，体验非遗技艺，品味地道民俗。",
    imagePrompt: "Traditional chinese lantern festival dragon dance night",
    spots: [
      {
        id: "poi_folk_001",
        name: "传统婚庆习俗",
        coord: "118.205500,25.234800", // Approximate (Cultural Center)
        distance: "约100米",
        intro_short: "十里红妆，体验闽南古韵婚礼",
        intro_txt: "体验“新扇换旧扇”、“过风炉”等独特的闽南传统婚俗环节。穿上凤冠霞帔，坐上大红花轿，沉浸式感受传统婚嫁文化的喜庆与庄重。",
        imagePrompt: "chinese traditional wedding red dress palanquin",
        position: { top: "42%", left: "55%" },
        tags: ["闽南婚俗", "凤冠霞帔", "非遗体验"],
        postcardText: "良缘永结 琴瑟和鸣",
        audioUrl: "/audio/spots/poi_folk_001.mp3"
      },
      {
        id: "poi_folk_002",
        name: "池头古民居",
        coord: "118.203000,25.235500", // Approximate
        distance: "约600米",
        intro_short: "青砖黛瓦，触摸历史的温度",
        intro_txt: "保存完好的传统闽南民居建筑群，展示了精湛的建筑工艺和淳朴的民间生活形态。漫步古巷，仿佛穿越时空，回到了那个车马慢的年代。",
        imagePrompt: "old alleyway chinese village stone path lantern",
        position: { top: "30%", left: "25%" },
        tags: ["古村落", "建筑美学", "慢生活"],
        postcardText: "古巷幽幽 岁月静好",
        audioUrl: "/audio/spots/poi_folk_002.mp3"
      },
      {
        id: "poi_folk_003",
        name: "迎龙灯",
        coord: "118.205000,25.234000", // Approximate (Main Street)
        distance: "活动期间",
        intro_short: "火龙蜿蜒，祈求风调雨顺",
        intro_txt: "东里村最隆重的传统民俗活动。每逢春节，村民自发组织，巨型龙灯在村巷中穿梭巡游，锣鼓喧天，火光映天，寓意国泰民安，五谷丰登。",
        imagePrompt: "dragon dance festival night fire lights crowd",
        position: { top: "50%", left: "50%" },
        tags: ["非遗龙灯", "春节民俗", "热闹非凡"],
        postcardText: "龙腾盛世 福泽万家",
        audioUrl: "/audio/spots/poi_folk_003.mp3"
      }
    ]
  }
];

export const CELEBRITY_DATA: Celebrity[] = LOADED_CELEBRITIES || [
  {
    id: "cel_001",
    name: "郑玉指",
    title: "辛亥革命元老",
    description: "追随孙中山先生参加辛亥革命，为推翻帝制、建立共和立下汗马功劳。",
    imageUrl: "http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/shuyuan.webp-50?e=1763669915&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:rgb5WuVZsu13hdeiQlA9hLwEZtE=", 
    detailText: "郑玉指，福建永春东里村人。早年旅居马来西亚，加入同盟会。1911年武昌起义爆发后，毅然回国投身革命。孙中山先生曾亲颁“旌义状”以表彰其贡献。他在家乡兴办教育，修桥铺路，深受乡亲爱戴。",
    role: "爱国侨领",
    era: "民国时期",
    tags: ["历史名人", "辛亥革命", "东里骄傲"],
    category: "革命先辈"
  },
  {
    id: "cel_002",
    name: "李铁民",
    title: "著名爱国侨领",
    description: "一生致力于华侨教育事业和抗日救亡运动，被誉为“华侨旗幜”。",
    imageUrl: "http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/%E6%9D%8E%E9%93%81%E6%B0%91.jpg?e=1763669601&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:vshvF183VpJxjmV69Qy3ac2wngs=",
    detailText: "李铁民，祖籍永春。抗战期间，他在南洋积极组织华侨捐资助馕，支援祖国抗战。新中国成立后，他归国投身建设，为家乡的发展做出了巨大贡献。",
    role: "抗日英雄",
    era: "近现代",
    tags: ["爱国侨领", "教育家", "社会活动家"],
    category: "革命先辈"
  }
];

export const SPECIALS_DATA: SpecialItem[] = LOADED_SPECIALS || [
  {
    id: "spec_001",
    title: "东里红菇",
    category: "特产",
    subcategory: "风物特产",
    priceOrTime: "¥ 800 / 斤",
    imageUrl: "https://images.unsplash.com/photo-1596245362947-a89b88308800?q=80&w=800&auto=format&fit=crop", 
    description: "产自深山的野生红菇，营养价值极高，炖汤滋补佳品。",
    rating: "⭐⭐⭐⭐⭐",
    tags: ["滋补", "野生", "炖汤"]
  },
  {
    id: "spec_002",
    title: "永春白鸭汤",
    category: "美食",
    subcategory: "风物特产",
    priceOrTime: "¥ 68 / 份",
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop", 
    description: "选用当地药用白鸭，加入多种中草药慢火熬制，汤鲜味美，具有清热解毒之功效。",
    rating: "⭐⭐⭐⭐⭐",
    tags: ["药膳", "老字号", "清热解毒"]
  },
  {
    id: "spec_003",
    title: "纸织画体验",
    category: "活动",
    subcategory: "文化民俗",
    priceOrTime: "约 1 小时",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7b454989ab?q=80&w=800&auto=format&fit=crop", 
    description: "亲手体验国家级非物质文化遗产——永春纸织画的编织技艺，感受传统艺术的魅力。",
    rating: "⭐⭐⭐⭐",
    tags: ["非遗", "亲子", "手工艺"]
  },
   {
    id: "spec_004",
    title: "老醋猪脚",
    category: "美食",
    subcategory: "风物特产",
    priceOrTime: "¥ 58 / 份",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
    description: "使用永春老醋炖煮的猪脚，酸甜适口，肥而不腻，是当地宴席必不可少的一道硬菜。",
    rating: "⭐⭐⭐⭐⭐",
    tags: ["永春老醋", "地道风味", "硬菜"]
  },
   {
    id: "spec_005",
    title: "芦柑采摘",
    category: "活动",
    subcategory: "文化民俗",
    priceOrTime: "¥ 30 / 人",
    imageUrl: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop",
    description: "在果园亲手采摘\"东方佳果\"永春芦柑，个大皮薄，汁多味甜。",
    rating: "⭐⭐⭐⭐",
    tags: ["户外", "采摘", "时令水果"]
  }
];
