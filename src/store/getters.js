const getters = {
  deployUploadApi: state => state.api.deployUploadApi,
  databaseUploadApi: state => state.api.databaseUploadApi,
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  socketApi: state => state.api.socketApi,
  imagesUploadApi: state => state.api.imagesUploadApi,
  baseApi: state => state.api.baseApi,
  fileUploadApi: state => state.api.fileUploadApi,
  updateAvatarApi: state => state.api.updateAvatarApi,
  qiNiuUploadApi: state => state.api.qiNiuUploadApi,
  sqlApi: state => state.api.sqlApi,
  swaggerApi: state => state.api.swaggerApi,
  sidebarRouters: state => state.permission.sidebarRouters,
  count: state => state.count,
  working(state){
    return {
      saving: state.working.saving,
      draging: state.working.draging,
      editing: state.working.editing
    }
  },
  config(state) {
    return {
      ctrlPanelMin: state => state.config.ctrlPanelMin,
      ctrlPanelWidth: state => state.config.ctrlPanelWidth,
      dividerWidth: state => state.config.dividerWidth,
      defaultLang: state => state.config.defaultLang,
      zoom: state => state.config.zoom
    }
  },
  getMinder: state => state.minder,
  getEditor: state => state.editor
}
// export const count = state => {
//   return state.count;
// }

// export const working = state => {
//   return {
//     saving: state.working.saving,
//     draging: state.working.draging,
//     editing: state.working.editing
//   }
// }
//
// export const config = state => {
//   return {
//     ctrlPanelMin: state.config.ctrlPanelMin,
//     ctrlPanelWidth: state.config.ctrlPanelWidth,
//     dividerWidth: state.config.dividerWidth,
//     defaultLang: state.config.defaultLang,
//     zoom: state.config.zoom
//   }
// }
//
// export const getMinder = state => {
//   return state.minder
// }
//
// export const getEditor = state => {
//   return state.editor
// }
export default getters
