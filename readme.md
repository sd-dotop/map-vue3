# map-vue3

[openlayers](https://openlayers.org/) 与 [vue3](https://cn.vuejs.org/) 封装的地图组件

## 安装

```console
npm install git+https://github.com/sd-dotop/map-vue3
pnpm install git+https://github.com/sd-dotop/map-vue3
yarn add git+https://github.com/sd-dotop/map-vue3
```

main.js 中

```javascript
import Map from 'map-vue3'

app.use(Map)
```

## 范例

[查看范例](http://122.14.216.105:8090/mengxi/map-vue3/wikis/home)

## 组件

组件类型分为地图`基础底图`，`图层`，`要素`

### Map

底图组件，展示底图

```
<Map></Map>
```

#### props

| 名称         | 类型     | 默认值    | 说明                                      |
| ------------ | -------- | --------- | ----------------------------------------- |
| center       | Array    | [120, 36] | 地图的默认中心点坐标                      |
| zoom         | Number   | 10        | 地图的默认缩放级别                        |
| single-click | Function | -         | 地图单击的绑定函数,返回内容为地图点击事件 |

#### expose

| 名称              | 类型                 | 返回值 | 说明                                   |
| ----------------- | -------------------- | ------ | -------------------------------------- |
| map               | Map                  | -      | 地图对象                               |
| view              | View                 | -      | 地图容器对象                           |
| setCenter         | function([lng, lat]) | -      | 控制地图缩放,参数为坐标值数组          |
| vecLayer          | LayerGroup           | -      | 矢量底图对象                           |
| imgLayer          | LayerGroup           | -      | 影像底图对象                           |
| getFeatureByPixel | Promise              | -      | 通过像素坐标获取当前像素坐标位置的要素 |

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

---

### Icon

图标点要素

```
<Icon />
```

#### props

| 名称        | 类型   | 默认值 | 说明       |
| ----------- | ------ | ------ | ---------- |
| coordinates | Array  | -      | 坐标       |
| src         | String | -      | 点图标地址 |

#### expose

| 名称 | 类型    | 返回值 | 说明         |
| ---- | ------- | ------ | ------------ |
| icon | Feature | -      | 点要素的对象 |

---

### Polygon

多边形要素

```
<Polygon />
```

#### props

| 名称         | 类型                      | 默认值    | 说明       |
| ------------ | ------------------------- | --------- | ---------- |
| coordinates  | Array.< Array. < Array> > | -         | 坐标       |
| stroke-color | String                    | #ff3333   | 外边线颜色 |
| stroke-width | Number                    | 2         | 外边线宽度 |
| fill-color   | String                    | #ff333333 | 填充颜色   |

#### expose

| 名称    | 类型    | 返回值 | 说明             |
| ------- | ------- | ------ | ---------------- |
| polygon | Feature | -      | 多边形要素的对象 |

---

### WMS

WMS 瓦片服务图层

```
<WMS />
```

#### props

| 名称   | 类型   | 默认值 | 说明         |
| ------ | ------ | ------ | ------------ |
| url    | String | -      | wms 服务地址 |
| params | Object | -      | wms 请求参数 |

#### expose

| 名称                     | 类型      | 返回值 | 说明                                                    |
| ------------------------ | --------- | ------ | ------------------------------------------------------- |
| wms                      | SourceWMS | -      | wms 源对象                                              |
| layer                    | TileLayer | -      | 瓦片图层对象                                            |
| getFatureInfoByCoodinate | Promise   | -      | 通过坐标获取 wms 要素的服务,返回体为 wms 服务返回的内容 |

### WMTS

WMTS 瓦片服务图层

```
<WMTS />
```

#### props

| 名称   | 类型   | 默认值 | 说明         |
| ------ | ------ | ------ | ------------ |
| url    | String | -      | WMTS 服务地址 |
| layer  | String | -      | 图层标识     |
| matrixSet  | String | -      | matrixSet     |
| srs        | String | -      | 坐标系，用于获取 projection     |
| version    | String | -      | 版本号，default：1.0.0     |
| format     | String | -      | format，default：image/png     |
| style      | String | -      | 样式，default：default     |
| maxZoom    | Number | -      | 最大缩放层级     |
| prefix     | String | -      | 瓦片 matrixIds 前缀，示例prefix=EPSG:4326, 则 matrixIds值为：`EPSG:4326:0`     |

#### expose

| 名称                     | 类型      | 返回值 | 说明                                                    |
| ------------------------ | --------- | ------ | ------------------------------------------------------- |
| wmts                      | SourceWMS | -      | wms 源对象                                              |
| layer                    | TileLayer | -      | 瓦片图层对象                                            |
| getFatureInfoByCoodinate | Promise   | -      | 通过坐标获取 wmts 要素的服务, 未实现 |

