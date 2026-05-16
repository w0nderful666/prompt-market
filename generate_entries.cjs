const fs = require('fs');
const path = 'D:\\test\\AAA2027\\ewnew\\prompt-market-react\\src\\data\\showcaseData.ts';

let output = '';

function add(id, name, subtitle, tags, category, model, score, dir) {
  const t = JSON.stringify(tags);
  output += `  {\n    id: '${id}',\n    name: '${name}',\n    subtitle: '${subtitle}',\n    tags: ${t},\n    category: '${category}',\n    model: '${model}',\n    score: ${score},\n    director: {\n      model: '${dir.model}',\n      subject: '${dir.subject}',\n      scene: '${dir.scene}',\n      composition: '${dir.composition}',\n      expression: '${dir.expression}',\n      face: '${dir.face}',\n      hair: '${dir.hair}',\n      body: '${dir.body}',\n      clothing: '${dir.clothing}',\n      lighting: '${dir.lighting}',\n      camera: '${dir.camera}',\n      depthOfField: '${dir.depthOfField}',\n      background: '${dir.background}',\n      atmosphere: '${dir.atmosphere}',\n      caption: '${dir.caption}',\n      mustKeep: '${dir.mustKeep}',\n      avoid: '${dir.avoid}',\n      ratio: '${dir.ratio}'\n    }\n  },\n`;
}

console.log('Script loaded. Ready to generate entries.');
add("daily_01","清晨窗边咖啡","晨光 · 热咖啡 · 宁静时刻",["清晨","咖啡","窗边","晨光","宁静","日常"],"daily","GPT Image",91,{
  model: "GPT Image / 写实日常",
  subject: "一位二十八岁的女性，身穿宽松白色针织衫，双手捧着冒热气的陶瓷咖啡杯，坐在窗边木椅上",
  scene: "普通公寓的明亮客厅，窗户朝东，清晨阳光斜照进来，米白色百叶窗半开",
  composition: "横构图，中景，主体在画面右侧三分之一处，咖啡杯在画面中心偏下",
  expression: "眼神温和地看向窗外，嘴角带着淡淡的微笑，神情放松而满足",
  face: "素颜，皮肤清透有自然光泽，淡淡的卧蚕，眉毛未经修饰的自然形态",
  hair: "及肩黑发松松扎成低马尾，几缕碎发垂在耳侧，发尾微卷",
  body: "微微侧坐，双腿交叠，双手稳稳捧着杯子，肩膀放松下沉",
  clothing: "米白色宽松针织开衫，内搭白色棉麻吊带，浅灰色棉质家居长裤",
  lighting: "柔和的晨光从侧面窗户射入，在脸颊和颈部形成柔光过渡，暖色调光线",
  camera: "微单相机，35mm定焦，f/2.8，自然日光白平衡",
  depthOfField: "中等景深，背景家具略微虚化但可辨认",
  background: "浅灰色墙壁，木质书架上摆着绿植和书籍，窗帘边缘透光",
  atmosphere: "宁静安详的早晨，独处时光，舒适而温暖的生活气息",
  caption: "晨间独处，热咖啡和初升的太阳是最好的陪伴",
  mustKeep: "真实皮肤质感，自然光线过渡，暖色调晨光氛围",
  avoid: "过度磨皮，冷白皮，浓妆，影棚灯光，刻意摆拍感",
  ratio: "4:5"
});
