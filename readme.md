# map-vue3

[openlayers](https://openlayers.org/) 与 [vue3](https://cn.vuejs.org/) 封装的地图组件

## 安装

```console
npm install git+http://122.14.216.105:8090/mengxi/map-vue3.git
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
<Map />
```

#### props

| 名称   | 类型   | 默认值    | 说明                 |
| ------ | ------ | --------- | -------------------- |
| center | Array  | [120, 36] | 地图的默认中心点坐标 |
| zoom   | Number | 10        | 地图的默认缩放级别   |

#### expose

| 名称      | 类型                                 | 返回值 | 说明                          |
| --------- | ------------------------------------ | ------ | ----------------------------- |
| map       | Map                                  | -      | 地图对象                      |
| view      | View                                 | -      | 地图容器对象                  |
| setCenter | function([lng<Number>, lat<Number>]) | -      | 控制地图缩放,参数为坐标值数组 |
| vecLayer  | LayerGroup                           | -      | 矢量底图对象                  |
| imgLayer  | LayerGroup                           | -      | 影像底图对象                  |
