# map-vue3

[openlayers](https://openlayers.org/) 与 [vue3](https://cn.vuejs.org/) 封装的地图组件

## 安装

```console
npm install git+http://122.14.216.105:8090/mengxi/map-vue3.git
pnpm install git+http://122.14.216.105:8090/mengxi/map-vue3.git
yarn add git+http://122.14.216.105:8090/mengxi/map-vue3.git
```

main.js 中

```javascript
import Map from 'map-vue3'

app.use(Map)
```

## 组件

组件类型分为地图`基础底图`，`图层`，`要素`

### Map

底图组件，展示底图

```
<Map></Map>
```

#### props

| 名称   | 类型   | 默认值    | 说明                 |
| ------ | ------ | --------- | -------------------- |
| center | Array  | [120, 36] | 地图的默认中心点坐标 |
| zoom   | Number | 10        | 地图的默认缩放级别   |

#### expose

| 名称      | 类型                 | 返回值 | 说明                          |
| --------- | -------------------- | ------ | ----------------------------- |
| map       | Map                  | -      | 地图对象                      |
| view      | View                 | -      | 地图容器对象                  |
| setCenter | function([lng, lat]) | -      | 控制地图缩放,参数为坐标值数组 |
| vecLayer  | LayerGroup           | -      | 矢量底图对象                  |
| imgLayer  | LayerGroup           | -      | 影像底图对象                  |

---

### VectorLayer

矢量要素图层，所有的矢量要素放在 VectorLayer 下

```
<VectorLayer></VectorLayer>
```

#### props

#### expose

| 名称         | 类型         | 返回值 | 说明           |
| ------------ | ------------ | ------ | -------------- |
| vectorLayer  | VectorLayer  | -      | 矢量图层对象   |
| vectorSource | VectorSource | -      | 矢量图层源对象 |

---

### Line

矢量线要素

```
<Line />
```

#### props

| 名称         | 类型            | 默认值    | 说明 |
| ------------ | --------------- | --------- | ---- |
| coordinates  | Array.< Array > | -         | 坐标 |
| stroke-color | String          | '#0000ff' | 颜色 |
| stroke-width | Number          | 3         | 线宽 |

#### expose

| 名称 | 类型    | 返回值 | 说明         |
| ---- | ------- | ------ | ------------ |
| line | Feature | -      | 线要素的对象 |

---

### Point

矢量点要素

```
<Point />
```

#### props

| 名称         | 类型   | 默认值    | 说明       |
| ------------ | ------ | --------- | ---------- |
| coordinates  | Array  | -         | 坐标       |
| radius       | Number | 10        | 点大小     |
| fill-color   | String | '#ff0000' | 点颜色     |
| stroke-color | String | '#ffffff' | 外边线颜色 |
| stroke-width | Number | 2         | 外边线宽度 |

#### expose

| 名称  | 类型    | 返回值 | 说明         |
| ----- | ------- | ------ | ------------ |
| point | Feature | -      | 点要素的对象 |
