<template>
  <div class="mx-auto max-w-5xl p-4">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">📦 Prompt Packs</h2>
        <p class="mt-1 text-sm" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">模板包管理，打包导入导出多条提示词</p>
      </div>
      <button class="rounded-lg px-4 py-2 text-sm font-bold transition active:scale-95"
        :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
        @click="showCreateModal = true">📦 创建 Pack</button>
    </div>

    <!-- Pack list -->
    <div v-if="packs.length" class="space-y-4">
      <div v-for="pack in packs" :key="pack.id"
        class="rounded-xl border overflow-hidden"
        :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <!-- Pack header -->
        <div class="px-4 py-3 border-b" :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ pack.name }}</h4>
                <span v-if="pack.builtIn" class="rounded-full px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700">官方</span>
                <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'">{{ pack.prompts?.length || 0 }} 条</span>
              </div>
              <p v-if="pack.description" class="mt-1 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ pack.description }}</p>
              <div v-if="pack.tags?.length" class="mt-1 flex flex-wrap gap-1">
                <span v-for="tag in pack.tags" :key="tag" class="rounded-full px-2 py-0.5 text-[10px]"
                  :class="darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'">{{ tag }}</span>
              </div>
            </div>
            <div class="flex items-center gap-1 ml-3">
              <button class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
                :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                @click="exportPack(pack)">📤 导出</button>
              <button v-if="!pack.builtIn" class="rounded-lg px-2 py-1.5 text-[11px] font-bold transition active:scale-95 text-red-500"
                :class="darkMode ? 'bg-red-900/20 hover:bg-red-900/40' : 'bg-red-50 hover:bg-red-100'"
                @click="deletePack(pack.id)">✕</button>
            </div>
          </div>
        </div>

        <!-- Pack prompts -->
        <div class="px-4 py-3 space-y-2">
          <div v-if="!pack.prompts?.length" class="text-xs text-center py-4" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">空包，点击下方添加提示词</div>
          <div v-for="(prompt, idx) in pack.prompts" :key="prompt.id || idx"
            class="flex items-center justify-between rounded-lg border px-3 py-2"
            :class="darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-100 bg-slate-50'">
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold truncate" :class="darkMode ? 'text-slate-300' : 'text-slate-700'">{{ prompt.title || `提示词 #${idx + 1}` }}</div>
              <div class="text-[10px] truncate mt-0.5" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">{{ prompt.summary || '—' }}</div>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <button class="rounded px-2 py-1 text-[10px] font-bold transition"
                :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
                @click="$emit('load-prompt', prompt)">加载</button>
              <button v-if="!pack.builtIn" class="rounded px-2 py-1 text-[10px] font-bold text-red-500 transition"
                :class="darkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'"
                @click="removePromptFromPack(pack.id, idx)">✕</button>
            </div>
          </div>
        </div>

        <!-- Pack actions -->
        <div class="px-4 py-2 border-t flex gap-2" :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
          <button class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition"
            :class="darkMode ? 'bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'"
            @click="addCurrentToPack(pack.id)">+ 当前提示词</button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="rounded-xl border p-10 text-center"
      :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <div class="text-4xl mb-3">📦</div>
      <p class="text-sm font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-600'">还没有 Prompt Pack</p>
      <p class="mt-1 text-xs" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">创建一个 Pack 来管理你的提示词模板</p>
    </div>

    <!-- Import -->
    <div class="mt-4">
      <button class="rounded-lg px-4 py-2 text-xs font-bold transition"
        :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="triggerImport">📥 导入 Pack JSON</button>
    </div>
    <input ref="fileInput" class="hidden" type="file" accept=".json" @change="importPack" />

    <!-- Create modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm rounded-2xl p-5 shadow-xl" :class="darkMode ? 'bg-slate-800' : 'bg-white'">
        <h3 class="mb-4 font-bold" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">创建 Prompt Pack</h3>
        <input v-model.trim="newPackName" class="mb-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400"
          :class="darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200'" placeholder="Pack 名称" />
        <input v-model.trim="newPackDesc" class="mb-3 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400"
          :class="darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200'" placeholder="描述（可选）" />
        <input v-model.trim="newPackTags" class="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400"
          :class="darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200'" placeholder="标签，逗号分隔（可选）" />
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg py-2 text-sm font-bold" :class="darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'" @click="showCreateModal = false">取消</button>
          <button class="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white" @click="createPack">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { safeRead, safeWrite } from '../utils/storageManager.js'
import { downloadJson } from '../utils/storage.js'

const props = defineProps({
  darkMode: { type: Boolean, default: false },
  currentDirector: { type: Object, default: () => ({}) },
  currentOutputs: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['load-prompt', 'toast'])

const STORAGE_KEY = 'prompt_market_packs'
const packs = ref([])
const showCreateModal = ref(false)
const newPackName = ref('')
const newPackDesc = ref('')
const newPackTags = ref('')
const fileInput = ref(null)

const BUILT_IN_PACKS = [
  {
    id: 'pack_realistic_portrait',
    name: 'Realistic Portrait Starter Pack',
    description: '写实人像入门包，覆盖日常、夜景、胶片、自拍等常见场景',
    tags: ['人像', '写实', '入门'],
    builtIn: true,
    prompts: [
      {
        id: 'bpp_1',
        title: '午后咖啡馆自然光人像',
        summary: '85mm 自然光 · 咖啡馆 · 温暖亲切',
        director: {
          model: 'GPT Image / 写实人像',
          subject: '一位二十五岁左右的亚洲男性，短发，干净面容，自信微笑',
          scene: '户外咖啡馆露台，午后阳光，背景是模糊的绿植和砖墙',
          composition: '近景特写，头部和肩部，三分法构图，眼睛在上三分线',
          expression: '自然微笑，眼神温和自信，看向镜头略偏左',
          face: '干净皮肤，无妆容，自然肤色，轻微胡茬，真实毛孔纹理',
          hair: '黑色短发，自然纹理，不过度造型，清爽干净',
          body: '肩膀放松，略微侧身，头部微倾',
          clothing: '深蓝色圆领毛衣，内搭白色T恤露出领口，简约干净',
          lighting: '午后自然光，从侧面45度照射，形成柔和明暗过渡，发丝有轮廓光',
          camera: '85mm 人像镜头，f/2.0，自然虚化，肤色还原准确',
          depthOfField: '浅景深，f/2.0，面部清晰，背景咖啡馆柔和虚化',
          background: '模糊的绿植，砖墙，咖啡杯边缘虚化，暖色调',
          atmosphere: '温暖，亲切，自然，适合LinkedIn或社交平台头像',
          caption: '自然光人像，社交头像风格，温暖亲切',
          mustKeep: '真实皮肤纹理，自然表情，准确肤色，眼神光',
          avoid: '过度磨皮，塑料皮肤，HDR效果，夸张滤镜，证件照感',
          ratio: '1:1'
        }
      },
      {
        id: 'bpp_2',
        title: '夜晚便利店冷光半身照',
        summary: '手机质感 · 便利店 · 混合色温',
        director: {
          model: 'Stable Diffusion / 街拍人像',
          subject: '一位二十五岁左右的年轻女性，街拍模特气质，刚从便利店出来，手里拿着一罐饮料',
          scene: '夜晚便利店门口，自动门半开，冷白色灯光从店内透出',
          composition: '近景半身，主体居中偏左，便利店灯光形成背景光晕',
          expression: '看向镜头，表情自然随意，嘴角微微上扬',
          face: '自然底妆，淡眼妆，自然唇色，健康肤色光泽',
          hair: '黑色长发，发丝被微风吹起，自然碎发',
          body: '自然行走中，身体微微转向镜头，一手拿饮料罐',
          clothing: '黑色皮夹克，白色T恤，水洗牛仔裤，帆布鞋',
          lighting: '便利店冷白色灯光，混合室外暖黄路灯光，形成混合色温',
          camera: '手机拍摄，轻微噪点，暖白平衡，社交媒体随手拍质感',
          depthOfField: '浅景深，背景便利店灯光形成柔和光斑',
          background: '便利店招牌，自动售货机，模糊街道，停放的自行车',
          atmosphere: '深夜感，真实生活气息，像深夜出门买东西的随手拍',
          caption: '便利店随手拍，深夜街拍，社交媒体风格',
          mustKeep: '便利店灯光氛围，混合色温，真实皮肤纹理',
          avoid: '过度精修，塑料皮肤，影棚光，商业感，卡通化',
          ratio: '3:4'
        }
      },
      {
        id: 'bpp_3',
        title: '地铁站 CCD 快照',
        summary: 'CCD 老式数码 · 2000年代 · 通勤感',
        director: {
          model: 'Midjourney / CCD 快照',
          subject: '一位二十出头的女性，大学生气质，背双肩包，站在地铁站台上等车',
          scene: '地铁站台，荧光灯照明，金属座椅，屏蔽门，站台广告牌',
          composition: '近景半身，三分法构图，主体略偏离中心，高处俯拍微仰视',
          expression: '抬头看站牌，表情自然，微微皱眉像在确认路线',
          face: '东亚网红妆，浅色底妆，浓郁腮红，亮泽唇彩，眼下美人痣',
          hair: '蓬松短波波头，空气刘海，发尾微微外翘',
          body: '自然站立，重心在一只脚上，肩膀微斜，单手抓着双肩包带',
          clothing: '白色薄纱开衫，V领上衣，樱桃图案印花，深蓝色百褶裙',
          lighting: '地铁站冷白色荧光灯，顶部照明均匀，轻微频闪感',
          camera: 'CCD 老式数码相机，数字噪点，可见颗粒，橙色日期戳，轻微跑焦',
          depthOfField: '全景深，CCD 小传感器特点，前后都相对清晰',
          background: '亮蓝色扶梯扶手，黄色警示线，屏蔽门，离去的行人模糊身影',
          atmosphere: '通勤日常感，真实随意，像随手拍记录',
          caption: 'CCD 快照，地铁通勤，2000年代数码相机质感',
          mustKeep: 'CCD 噪点，橙色日期戳，真实皮肤纹理，地铁环境细节',
          avoid: '过度精修，塑料皮肤，AI生成感，高清锐利，商业棚拍',
          ratio: '3:4'
        }
      },
      {
        id: 'bpp_4',
        title: '雨天车窗电影感肖像',
        summary: '35mm 胶片 · 电影感 · 雨天情绪',
        director: {
          model: 'GPT Image / 电影人像',
          subject: '一位二十五岁左右的年轻女性坐在出租车后座，侧脸轮廓，望向车窗外的雨景',
          scene: '出租车后座，车窗上有雨滴滑落，窗外霓虹灯模糊成光斑',
          composition: '越肩视角，从副驾看向后座，浅景深，车窗雨滴形成前景虚化',
          expression: '侧脸望向窗外，表情略带沉思，眼神迷离但克制',
          face: '自然底妆，淡眼妆，自然唇色，皮肤有真实质感',
          hair: '黑色长发披散，发丝贴在车窗玻璃上，有几缕被雨水沾湿',
          body: '侧坐，身体微微蜷缩，一只手撑在车窗边，姿态放松',
          clothing: '深灰色风衣，内搭黑色高领毛衣，领口微皱',
          lighting: '车窗外霓虹灯和路灯形成暖色光斑，车内偏暗，混合色温',
          camera: '35mm 胶片摄影，胶片颗粒，轻微色偏偏青，自然暗角',
          depthOfField: '浅景深，f/1.8，车窗雨滴前景虚化，窗外霓虹光斑',
          background: '车窗外模糊的霓虹招牌，雨中街道，车流光轨，模糊行人',
          atmosphere: '略迷离，未完成的情绪停顿，深夜雨天的电影感',
          caption: '电影剧照感，胶片摄影，雨天情绪人像',
          mustKeep: '车窗雨滴，胶片颗粒，霓虹光斑，侧脸轮廓，情绪氛围',
          avoid: '过度锐化，塑料皮肤，AI生成感，过度精修，正面直视',
          ratio: '16:9'
        }
      }
    ]
  },
  {
    id: 'pack_creator_utility',
    name: 'Creator Utility Pack',
    description: '创作者实用包，GitHub 封面、产品图、头像等实用场景',
    tags: ['实用', '封面', '产品', '头像'],
    builtIn: true,
    prompts: [
      {
        id: 'bcp_1',
        title: 'GitHub 项目封面图',
        summary: '深色主题 · 代码编辑器 · 16:9',
        director: {
          model: 'GPT Image / UI 设计',
          subject: '一个现代极简的代码编辑器界面截图，深色主题，语法高亮',
          scene: '纯深色渐变背景，从深蓝到深紫，带轻微网格纹理',
          composition: '16:9 宽屏，编辑器居中偏上，下方留白放标题文字',
          expression: '无', face: '无', hair: '无', body: '无', clothing: '无',
          lighting: '界面自带发光效果，代码区域有轻微光晕',
          camera: 'UI 截图风格，矢量清晰，无噪点，像素完美',
          depthOfField: '全画面清晰，无景深效果，矢量风格',
          background: '深蓝到深紫渐变，带极细网格线，科技感',
          atmosphere: '技术感，专业，简洁现代，开发者友好',
          caption: 'GitHub README 封面图，开源项目展示风格',
          mustKeep: '代码可读性，深色主题，语法高亮，清晰的文字',
          avoid: '花哨装饰，过多颜色，模糊，低分辨率，杂乱',
          ratio: '16:9'
        }
      },
      {
        id: 'bcp_2',
        title: '高级电商产品图',
        summary: '柔光箱 · 玻璃瓶 · 商业质感',
        director: {
          model: 'Stable Diffusion / 产品摄影',
          subject: '一瓶透明精华液产品，玻璃瓶身带金色瓶盖，瓶内液体微微泛金',
          scene: '纯白渐变背景，亚克力展示台面，产品居中放置',
          composition: '中心构图，产品居中，留白适当，45度微俯视',
          expression: '无', face: '无', hair: '无', body: '无', clothing: '无',
          lighting: '柔光箱均匀照明，左侧45度主光，右侧补光，无硬阴影',
          camera: '商业产品摄影，微距镜头，f/2.8光圈，高细节，焦点在瓶身标签',
          depthOfField: '浅景深，焦点在产品标签，背景柔和过渡',
          background: '纯白到浅灰渐变背景，无杂物，干净简洁',
          atmosphere: '干净，高级，专业商业质感，品牌感强',
          caption: '商业产品主图，电商详情页风格，高级护肤品质感',
          mustKeep: '产品细节清晰，瓶身质感，液体通透感，色彩准确，水珠反光',
          avoid: '背景混乱，阴影过重，低质量，模糊，文字水印，变形',
          ratio: '1:1'
        }
      },
      {
        id: 'bcp_3',
        title: '个人头像写实摄影',
        summary: '自然光 · 社交头像 · 温暖亲切',
        director: {
          model: 'GPT Image / 写实人像',
          subject: '一位二十五岁左右的亚洲男性，短发，干净面容，自信微笑',
          scene: '户外咖啡馆露台，午后阳光，背景是模糊的绿植和砖墙',
          composition: '近景特写，头部和肩部，三分法构图，眼睛在上三分线',
          expression: '自然微笑，眼神温和自信，看向镜头略偏左',
          face: '干净皮肤，无妆容，自然肤色，轻微胡茬，真实毛孔纹理',
          hair: '黑色短发，自然纹理，不过度造型，清爽干净',
          body: '肩膀放松，略微侧身，头部微倾',
          clothing: '深蓝色圆领毛衣，内搭白色T恤露出领口，简约干净',
          lighting: '午后自然光，从侧面45度照射，形成柔和明暗过渡，发丝有轮廓光',
          camera: '85mm 人像镜头，f/2.0，自然虚化，肤色还原准确',
          depthOfField: '浅景深，f/2.0，面部清晰，背景咖啡馆柔和虚化',
          background: '模糊的绿植，砖墙，咖啡杯边缘虚化，暖色调',
          atmosphere: '温暖，亲切，自然，适合LinkedIn或社交平台头像',
          caption: '自然光人像，社交头像风格，温暖亲切',
          mustKeep: '真实皮肤纹理，自然表情，准确肤色，眼神光',
          avoid: '过度磨皮，塑料皮肤，HDR效果，夸张滤镜，证件照感',
          ratio: '1:1'
        }
      }
    ]
  },
  {
    id: 'pack_dark_street',
    name: 'Dark Street Style Pack',
    description: '暗黑街头风格包，赛博朋克、霓虹、暗调写真',
    tags: ['暗黑', '赛博朋克', '霓虹', '街头'],
    builtIn: true,
    prompts: [
      {
        id: 'bdp_1',
        title: '暗黑赛博街头写真',
        summary: '赛博朋克 · 霓虹 · 变形宽银幕',
        director: {
          model: 'Midjourney / 赛博朋克人像',
          subject: '一位二十五岁左右的年轻女性，赛博朋克风格打扮，站在雨后的霓虹街道上',
          scene: '未来城市小巷，霓虹招牌密集，地面湿润反射光线，蒸汽管道',
          composition: '中景全身，低角度仰拍，主体居中，两侧霓虹灯形成引导线',
          expression: '冷峻表情，微微抬头，眼神锐利，嘴唇微抿',
          face: '暗黑系妆容，深色眼影，哑光黑色唇膏，面部有发光纹身贴',
          hair: '银白色短发，不对称剪裁，一侧剃短，另一侧遮住半边脸',
          body: '站立姿态，重心在后脚，一手插口袋，另一手自然垂下',
          clothing: '黑色皮质短夹克，金属拉链，内搭网状上衣，高腰工装裤，厚底靴',
          lighting: '霓虹灯粉紫色和青色混合，从两侧照射，地面水洼反射霓虹光',
          camera: '电影级摄影，变形宽银幕镜头，anamorphic flare，电影色调',
          depthOfField: '中等景深，主体清晰，背景霓虹灯形成圆形光斑',
          background: '密集的霓虹招牌，日文和中文混合，蒸汽弥漫，模糊的行人剪影',
          atmosphere: '赛博朋克，暗黑未来感，霓虹都市，雨后湿润',
          caption: '赛博朋克电影剧照，霓虹都市人像，暗黑未来风格',
          mustKeep: '霓虹灯色彩反射，湿润地面质感，面部发光纹身，赛博朋克氛围',
          avoid: '过度曝光，白天场景，卡通风格，低质量，模糊，写实自然风格',
          ratio: '2:3'
        }
      },
      {
        id: 'bdp_2',
        title: '深夜停车场暗调写真',
        summary: '荧光灯 · 停车场 · 暗调氛围',
        director: {
          model: 'GPT Image / 暗调人像',
          subject: '一位二十出头的年轻女性，暗系穿搭，靠在停车场水泥柱上',
          scene: '地下停车场，混凝土墙面，荧光灯管照明，地面有车灯光轨',
          composition: '中景半身，主体偏左，右侧留出停车场纵深空间',
          expression: '低头看地面，表情冷淡，嘴角微抿',
          face: '淡妆，深色眼影，裸色唇膏，皮肤有真实质感',
          hair: '黑色长发，自然垂落，遮住半边脸',
          body: '背靠水泥柱，一脚踩在墙上，双手自然下垂',
          clothing: '黑色oversize卫衣，破洞牛仔裤，厚底马丁靴',
          lighting: '头顶荧光灯冷白光，混合远处车灯暖色，形成强烈明暗对比',
          camera: '35mm f/1.4，高ISO噪点，电影色调偏青绿',
          depthOfField: '浅景深，主体清晰，背景荧光灯形成光斑',
          background: '混凝土柱子，模糊车辆，荧光灯管，停车场标识',
          atmosphere: '暗冷，孤独感，城市深夜，地下空间的压迫感',
          caption: '暗调人像，停车场写真，城市孤独感',
          mustKeep: '荧光灯冷调，水泥质感，皮肤真实纹理，暗调氛围',
          avoid: '过度曝光，暖色调，商业感，卡通化，过度精修',
          ratio: '3:4'
        }
      },
      {
        id: 'bdp_3',
        title: '夜晚直闪街拍',
        summary: '直闪 · 夜景 · 湿润路面',
        director: {
          model: 'Stable Diffusion / 街拍人像',
          subject: '一位年轻女性，街头潮流穿搭，夜晚走在湿润的人行道上',
          scene: '夜晚城市街道，湿润路面反射路灯和霓虹灯光，路边停着车辆',
          composition: '近景半身，正面直视，手机闪光灯直闪效果',
          expression: '直视镜头，表情自然随意，略带不羁',
          face: '自然底妆，轻微雀斑，自然唇色',
          hair: '深棕色中长发，微卷，被闪光灯照亮',
          body: '自然行走中，微微停步看向镜头',
          clothing: '黑色皮夹克，白色crop top，宽松工装裤，运动鞋',
          lighting: '手机直闪，硬光，主体过曝高光，背景压暗',
          camera: '手机直闪拍摄，高ISO，JPEG压缩，社交媒体质感',
          depthOfField: '全景深，手机广角，前后都清晰',
          background: '模糊的路灯，湿润路面反光，停放的车辆，远处霓虹',
          atmosphere: '真实，随意，社交媒体街拍感，夜晚城市活力',
          caption: '直闪街拍，夜晚街头，手机拍摄质感',
          mustKeep: '直闪硬光效果，湿润路面反射，真实皮肤质感',
          avoid: '柔光，商业棚拍，过度精修，HDR，白天场景',
          ratio: '3:4'
        }
      },
      {
        id: 'bdp_4',
        title: '废弃工厂暗黑写真',
        summary: '工业废墟 · 自然光 · 暗调质感',
        director: {
          model: 'Midjourney / 暗调人像',
          subject: '一位二十五岁左右的女性，暗系美学穿搭，站在废弃工厂的窗边',
          scene: '废弃工厂内部，斑驳混凝土墙，破碎玻璃窗，灰尘在光束中飘浮',
          composition: '中景全身，窗光从右侧打入，形成强烈明暗分割',
          expression: '侧脸看向窗外，表情平静，若有所思',
          face: '淡妆，自然肤色，皮肤有真实质感和细微瑕疵',
          hair: '深色长发，自然散落，发丝在逆光中透光',
          body: '自然站立，一手扶窗框，身体微微侧向光源',
          clothing: '黑色吊带裙，宽松版型，面料有垂坠感，赤脚',
          lighting: '窗户自然光，单侧照明，强烈明暗对比，光束中的灰尘颗粒',
          camera: '50mm f/1.8，胶片色调偏暖，颗粒感，自然暗角',
          depthOfField: '浅景深，主体清晰，背景工厂设备虚化',
          background: '斑驳混凝土墙，铁锈管道，破碎玻璃窗，灰尘光束',
          atmosphere: '废墟美学，孤独静谧，时光停滞感，暗调文艺',
          caption: '废墟人像，自然光暗调，工业美学',
          mustKeep: '窗光光束，灰尘颗粒，混凝土质感，暗调氛围',
          avoid: '人工光源，暖色调，商业感，过度精修，HDR',
          ratio: '2:3'
        }
      }
    ]
  }
]

function loadPacks() {
  const stored = safeRead(STORAGE_KEY, null)
  if (stored) {
    packs.value = stored
  } else {
    // Initialize with built-in packs
    packs.value = JSON.parse(JSON.stringify(BUILT_IN_PACKS))
    savePacks(packs.value)
  }
}

function savePacks(data) {
  const result = safeWrite(STORAGE_KEY, data)
  if (!result.success) emit('toast', { message: result.error, type: 'error' })
}

function createPack() {
  if (!newPackName.value) { emit('toast', { message: '请输入 Pack 名称', type: 'error' }); return }
  const pack = {
    id: `pack_${Date.now()}`,
    name: newPackName.value,
    description: newPackDesc.value || '',
    tags: newPackTags.value ? newPackTags.value.split(',').map(t => t.trim()).filter(Boolean) : [],
    builtIn: false,
    prompts: [],
    createdAt: new Date().toISOString()
  }
  packs.value = [...packs.value, pack]
  savePacks(packs.value)
  newPackName.value = ''
  newPackDesc.value = ''
  newPackTags.value = ''
  showCreateModal.value = false
  emit('toast', { message: `Pack "${pack.name}" 已创建` })
}

function deletePack(id) {
  packs.value = packs.value.filter(p => p.id !== id)
  savePacks(packs.value)
  emit('toast', { message: 'Pack 已删除' })
}

function addCurrentToPack(packId) {
  const d = props.currentDirector
  if (!d || !Object.values(d).some(v => v && v.trim())) {
    emit('toast', { message: '请先在 Director 中填写内容', type: 'error' })
    return
  }
  const pack = packs.value.find(p => p.id === packId)
  if (!pack) return

  const prompt = {
    id: `p_${Date.now()}`,
    title: d.subject ? d.subject.slice(0, 40) : '未命名提示词',
    summary: [d.scene, d.lighting, d.camera].filter(Boolean).slice(0, 2).join(' · ') || '—',
    director: { ...d },
    outputs: props.currentOutputs ? { ...props.currentOutputs } : {},
    addedAt: new Date().toISOString()
  }
  pack.prompts = [...(pack.prompts || []), prompt]
  savePacks(packs.value)
  emit('toast', { message: `已添加到 "${pack.name}"` })
}

function removePromptFromPack(packId, idx) {
  const pack = packs.value.find(p => p.id === packId)
  if (!pack) return
  pack.prompts.splice(idx, 1)
  savePacks(packs.value)
}

function exportPack(pack) {
  downloadJson(pack, `pack_${pack.name || 'unnamed'}_${Date.now()}.json`)
  emit('toast', { message: `Pack "${pack.name}" 已导出` })
}

function triggerImport() {
  fileInput.value?.click()
}

function importPack(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || '{}'))
      if (!data.name || !data.prompts) {
        emit('toast', { message: '无效的 Pack 文件', type: 'error' })
        return
      }
      const pack = {
        ...data,
        id: data.id || `pack_${Date.now()}`,
        builtIn: false,
        importedAt: new Date().toISOString()
      }
      packs.value = [...packs.value, pack]
      savePacks(packs.value)
      emit('toast', { message: `Pack "${pack.name}" 已导入` })
    } catch { emit('toast', { message: 'JSON 解析失败', type: 'error' }) }
  }
  reader.readAsText(file)
  event.target.value = ''
}

onMounted(loadPacks)
</script>
