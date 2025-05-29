<template>
  <div class="dialog-parent">
    <el-dialog v-model="dialogVisible" title="位置拾取/定位" width="400px" :modal="false" :close-on-click-modal="false" draggable
      @close="handleClose" class="position-dialog">
      <el-form label-width="60px">
        <el-form-item label="位置">
          <!-- 使用 el-autocomplete 实现搜索建议 -->
          <el-autocomplete v-model="searchPosition" :fetch-suggestions="fetchSuggestions" placeholder="请输入位置"
            :trigger-on-focus="false" @select="handleSelect" clearable>
            <!-- 自定义下拉选项样式 -->
            <template #default="{ item }">
              <div class="suggestion-item">
                <span class="name">{{ item.name }}</span>
                <span>{{ ' - ' }}</span>
                <span class="address">{{ item.address || item.district_text }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="经度" required>
          <el-input v-model="longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" required>
          <el-input v-model="latitude" placeholder="请输入纬度" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="pickCoordinate" type="primary">拾取</el-button>
        <el-button @click="locatePosition" type="success">定位</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { onUnmounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { flyTo, createMarker } from '../helper/helper'
import { debounce } from 'lodash-es'; // 防抖函数
const tdtToken = import.meta.env.VITE_TDT_TOKEN;

const props = defineProps({
  modelValue: Boolean,
  map: {
    type: Object,
    require: true
  }
})

const emit = defineEmits(['update:modelValue'])

const picked = ref(false)

const dialogVisible = ref(false)
const longitude = ref('')
const latitude = ref('')
const searchPosition = ref('')
let clickListener = null

// 同步v-model
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
  if (!val) {
    // removeClickListener()
  }
})

// 拾取坐标
const pickCoordinate = () => {
  picked.value = true
  // dialogVisible.value = false
  if (!props.map) {
    ElMessage.warning('地图未加载完成')
    return
  }

  ElMessage.info('请在地图上点击选择位置')

  // 移除之前的监听器
  removeClickListener()

  // 添加新的点击监听
  clickListener = props.map.on('click', (evt) => {
    console.log(evt)
    const coordinate = evt.coordinate
    longitude.value = coordinate[0].toFixed(6)
    latitude.value = coordinate[1].toFixed(6)
  })
}

// 定位到指定坐标
const locatePosition = () => {
  if ((!longitude.value || !latitude.value)) {
    ElMessage.warning('请输入经纬度坐标或通过位置搜索')
    return
  }

  const lng = parseFloat(longitude.value)
  const lat = parseFloat(latitude.value)
  if (isNaN(lng) || isNaN(lat)) {
    ElMessage.warning('请输入有效的经纬度坐标')
    return
  }
  if (lng < 114.8 || lng > 122.7 || lat < 34.37 || lat > 38.4) {
    ElMessage.warning('经纬度范围超出山东省范围')
    return
  }
  createMarker(props.map, [lng, lat])
  flyTo(props.map, [lng, lat], 15)
}

// 移除点击监听器
const removeClickListener = () => {
  if (clickListener) {
    props.map.un('click', clickListener.listener)
    clickListener = null
  }
}

const fetchSuggestions = debounce(async (query, cb) => {
  if (!query) {
    cb([]);
    return;
  }
  const results = await getSearchApiData(query);
  cb(results.features.map(item => ({
    value: `${item.name} - ${item.address || item.district_text}`, // 显示的名称（带分隔符）
    name: item.name,  // 实际存储的名称
    address: item.address || item.district_text, // 地址
    lng: item.lng,    // 经度
    lat: item.lat,     // 纬度
  })));
}, 300);
// 用户选择某一项时触发
const handleSelect = (item) => {
  longitude.value = item.lng;
  latitude.value = item.lat;
};
// 搜索地名
const getSearchApiData = async () => {
  if (!searchPosition.value.trim()) return;

  try {
    const searchUrl = `http://59.206.217.36/search?tk=${tdtToken}&st=LocalSearch&category=f_poi&city=山东&words=${encodeURIComponent(searchPosition.value)}`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    if (data && data.result) {
      console.log(data.result)
      return data.result
    } else {
      console.log('未找到相关地点');
    }
  } catch (error) {
    console.error('搜索失败:', error);
    console.log('搜索失败，请稍后重试');
  }
};

// 关闭对话框
const handleClose = () => {
  removeClickListener()
  longitude.value = ''
  latitude.value = ''
  searchPosition.value = null
}

onUnmounted(() => {
  handleClose()
})
</script>

<style scoped>
.dialog-parent {
  pointer-events: none;
}
.position-dialog {
  top: 150px;
}
:deep(.el-form) {
  padding-right: 10px;
}
/* 移除或修改以下样式 */
:deep(.el-dialog) {
  user-select: none;
  background-color: rgba(15, 30, 55, 0.85);
  pointer-events: auto;
  margin-top: 20vh !important;
}

/* 修改为以下样式 */
:deep(.el-dialog__body) {
  padding: 10px !important;
  pointer-events: auto;
  background-color: rgba(15, 30, 55, 0.65);
  user-select: none;
}

:deep(.el-dialog__header),
:deep(.el-dialog__footer) {
  pointer-events: auto;
  background-color: rgba(15, 30, 55, 0.65);
  user-select: none;
}

:deep(.el-dialog__header) {
  padding: 15px;
  margin-right: auto;
  background-color: rgba(15, 30, 55, 0.9);
}

:deep(.el-dialog__footer) {
  padding-top: 0;
}

:deep(.el-dialog) {
  background-color: transparent;
  box-shadow: none;
}
:deep(.el-autocomplete) {
  width: 100%;
}
</style>