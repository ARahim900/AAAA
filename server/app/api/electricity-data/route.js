/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/electricity-data/route";
exports.ids = ["app/api/electricity-data/route"];
exports.modules = {

/***/ "(rsc)/./app/api/electricity-data/route.ts":
/*!*******************************************!*\
  !*** ./app/api/electricity-data/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nasync function GET(request) {\n    try {\n        const filePath = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"public\", \"data\", \"electricity_data.json\");\n        // In a real scenario, data might be in /home/ubuntu/processed_data/electricity_data.json\n        // For Next.js public serving, it's better to place it in the public directory during the build or development setup.\n        // For now, let's assume we've copied it there or will adjust the path.\n        // We'll create a temporary solution to read from the processed_data directory for now.\n        // This is NOT ideal for production Next.js but will work for this development context.\n        const devFilePath = \"/home/ubuntu/processed_data/electricity_data.json\";\n        if (fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(devFilePath)) {\n            const jsonData = fs__WEBPACK_IMPORTED_MODULE_1___default().readFileSync(devFilePath, \"utf-8\");\n            const data = JSON.parse(jsonData);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data);\n        } else {\n            // Fallback or error if the primary path also doesn't exist\n            const publicFilePath = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"public\", \"data\", \"electricity_data.json\");\n            if (fs__WEBPACK_IMPORTED_MODULE_1___default().existsSync(publicFilePath)) {\n                const jsonData = fs__WEBPACK_IMPORTED_MODULE_1___default().readFileSync(publicFilePath, \"utf-8\");\n                const data = JSON.parse(jsonData);\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data);\n            } else {\n                console.error(\"Electricity data file not found at:\", devFilePath, \"or\", publicFilePath);\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    message: \"Data not found\"\n                }, {\n                    status: 404\n                });\n            }\n        }\n    } catch (error) {\n        console.error(\"Error reading electricity data:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Error fetching data\",\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2VsZWN0cmljaXR5LWRhdGEvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQXdEO0FBQ3BDO0FBQ0k7QUFFakIsZUFBZUcsSUFBSUMsT0FBb0I7SUFDNUMsSUFBSTtRQUNGLE1BQU1DLFdBQVdILGdEQUFTLENBQUNLLFFBQVFDLEdBQUcsSUFBSSxVQUFVLFFBQVE7UUFDNUQseUZBQXlGO1FBQ3pGLHFIQUFxSDtRQUNySCx1RUFBdUU7UUFDdkUsdUZBQXVGO1FBQ3ZGLHVGQUF1RjtRQUV2RixNQUFNQyxjQUFjO1FBRXBCLElBQUlSLG9EQUFhLENBQUNRLGNBQWM7WUFDOUIsTUFBTUUsV0FBV1Ysc0RBQWUsQ0FBQ1EsYUFBYTtZQUM5QyxNQUFNSSxPQUFPQyxLQUFLQyxLQUFLLENBQUNKO1lBQ3hCLE9BQU9YLHFEQUFZQSxDQUFDZ0IsSUFBSSxDQUFDSDtRQUMzQixPQUFPO1lBQ0gsMkRBQTJEO1lBQzNELE1BQU1JLGlCQUFpQmYsZ0RBQVMsQ0FBQ0ssUUFBUUMsR0FBRyxJQUFJLFVBQVUsUUFBUTtZQUNsRSxJQUFJUCxvREFBYSxDQUFDZ0IsaUJBQWlCO2dCQUMvQixNQUFNTixXQUFXVixzREFBZSxDQUFDZ0IsZ0JBQWdCO2dCQUNqRCxNQUFNSixPQUFPQyxLQUFLQyxLQUFLLENBQUNKO2dCQUN4QixPQUFPWCxxREFBWUEsQ0FBQ2dCLElBQUksQ0FBQ0g7WUFDN0IsT0FBTztnQkFDSEssUUFBUUMsS0FBSyxDQUFDLHVDQUF1Q1YsYUFBYSxNQUFNUTtnQkFDeEUsT0FBT2pCLHFEQUFZQSxDQUFDZ0IsSUFBSSxDQUFDO29CQUFFSSxTQUFTO2dCQUFpQixHQUFHO29CQUFFQyxRQUFRO2dCQUFJO1lBQzFFO1FBQ0o7SUFDRixFQUFFLE9BQU9GLE9BQU87UUFDZEQsUUFBUUMsS0FBSyxDQUFDLG1DQUFtQ0E7UUFDakQsT0FBT25CLHFEQUFZQSxDQUFDZ0IsSUFBSSxDQUFDO1lBQUVJLFNBQVM7WUFBdUJELE9BQU8sTUFBaUJDLE9BQU87UUFBQyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUM5RztBQUNGIiwic291cmNlcyI6WyIvaG9tZS91YnVudHUvcHJldmlld19kZXBsb3ltZW50L3dhdGVyX2Rhc2hib2FyZC9hcHAvYXBpL2VsZWN0cmljaXR5LWRhdGEvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwicHVibGljXCIsIFwiZGF0YVwiLCBcImVsZWN0cmljaXR5X2RhdGEuanNvblwiKTtcbiAgICAvLyBJbiBhIHJlYWwgc2NlbmFyaW8sIGRhdGEgbWlnaHQgYmUgaW4gL2hvbWUvdWJ1bnR1L3Byb2Nlc3NlZF9kYXRhL2VsZWN0cmljaXR5X2RhdGEuanNvblxuICAgIC8vIEZvciBOZXh0LmpzIHB1YmxpYyBzZXJ2aW5nLCBpdCdzIGJldHRlciB0byBwbGFjZSBpdCBpbiB0aGUgcHVibGljIGRpcmVjdG9yeSBkdXJpbmcgdGhlIGJ1aWxkIG9yIGRldmVsb3BtZW50IHNldHVwLlxuICAgIC8vIEZvciBub3csIGxldCdzIGFzc3VtZSB3ZSd2ZSBjb3BpZWQgaXQgdGhlcmUgb3Igd2lsbCBhZGp1c3QgdGhlIHBhdGguXG4gICAgLy8gV2UnbGwgY3JlYXRlIGEgdGVtcG9yYXJ5IHNvbHV0aW9uIHRvIHJlYWQgZnJvbSB0aGUgcHJvY2Vzc2VkX2RhdGEgZGlyZWN0b3J5IGZvciBub3cuXG4gICAgLy8gVGhpcyBpcyBOT1QgaWRlYWwgZm9yIHByb2R1Y3Rpb24gTmV4dC5qcyBidXQgd2lsbCB3b3JrIGZvciB0aGlzIGRldmVsb3BtZW50IGNvbnRleHQuXG5cbiAgICBjb25zdCBkZXZGaWxlUGF0aCA9IFwiL2hvbWUvdWJ1bnR1L3Byb2Nlc3NlZF9kYXRhL2VsZWN0cmljaXR5X2RhdGEuanNvblwiO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoZGV2RmlsZVBhdGgpKSB7XG4gICAgICBjb25zdCBqc29uRGF0YSA9IGZzLnJlYWRGaWxlU3luYyhkZXZGaWxlUGF0aCwgXCJ1dGYtOFwiKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKGpzb25EYXRhKTtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGYWxsYmFjayBvciBlcnJvciBpZiB0aGUgcHJpbWFyeSBwYXRoIGFsc28gZG9lc24ndCBleGlzdFxuICAgICAgICBjb25zdCBwdWJsaWNGaWxlUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcInB1YmxpY1wiLCBcImRhdGFcIiwgXCJlbGVjdHJpY2l0eV9kYXRhLmpzb25cIik7XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHB1YmxpY0ZpbGVQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QganNvbkRhdGEgPSBmcy5yZWFkRmlsZVN5bmMocHVibGljRmlsZVBhdGgsIFwidXRmLThcIik7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShqc29uRGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRWxlY3RyaWNpdHkgZGF0YSBmaWxlIG5vdCBmb3VuZCBhdDpcIiwgZGV2RmlsZVBhdGgsIFwib3JcIiwgcHVibGljRmlsZVBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogXCJEYXRhIG5vdCBmb3VuZFwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIHJlYWRpbmcgZWxlY3RyaWNpdHkgZGF0YTpcIiwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6IFwiRXJyb3IgZmV0Y2hpbmcgZGF0YVwiLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cblxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImZzIiwicGF0aCIsIkdFVCIsInJlcXVlc3QiLCJmaWxlUGF0aCIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiZGV2RmlsZVBhdGgiLCJleGlzdHNTeW5jIiwianNvbkRhdGEiLCJyZWFkRmlsZVN5bmMiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwianNvbiIsInB1YmxpY0ZpbGVQYXRoIiwiY29uc29sZSIsImVycm9yIiwibWVzc2FnZSIsInN0YXR1cyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/electricity-data/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Felectricity-data%2Froute&page=%2Fapi%2Felectricity-data%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Felectricity-data%2Froute.ts&appDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Felectricity-data%2Froute&page=%2Fapi%2Felectricity-data%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Felectricity-data%2Froute.ts&appDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_ubuntu_preview_deployment_water_dashboard_app_api_electricity_data_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/electricity-data/route.ts */ \"(rsc)/./app/api/electricity-data/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/electricity-data/route\",\n        pathname: \"/api/electricity-data\",\n        filename: \"route\",\n        bundlePath: \"app/api/electricity-data/route\"\n    },\n    resolvedPagePath: \"/home/ubuntu/preview_deployment/water_dashboard/app/api/electricity-data/route.ts\",\n    nextConfigOutput,\n    userland: _home_ubuntu_preview_deployment_water_dashboard_app_api_electricity_data_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjRfcmVhY3QtZG9tQDE5LjEuMF9yZWFjdEAxOS4xLjBfX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZlbGVjdHJpY2l0eS1kYXRhJTJGcm91dGUmcGFnZT0lMkZhcGklMkZlbGVjdHJpY2l0eS1kYXRhJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGZWxlY3RyaWNpdHktZGF0YSUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGdWJ1bnR1JTJGcHJldmlld19kZXBsb3ltZW50JTJGd2F0ZXJfZGFzaGJvYXJkJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGdWJ1bnR1JTJGcHJldmlld19kZXBsb3ltZW50JTJGd2F0ZXJfZGFzaGJvYXJkJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNpQztBQUM5RztBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvdWJ1bnR1L3ByZXZpZXdfZGVwbG95bWVudC93YXRlcl9kYXNoYm9hcmQvYXBwL2FwaS9lbGVjdHJpY2l0eS1kYXRhL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9lbGVjdHJpY2l0eS1kYXRhL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZWxlY3RyaWNpdHktZGF0YVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZWxlY3RyaWNpdHktZGF0YS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL3VidW50dS9wcmV2aWV3X2RlcGxveW1lbnQvd2F0ZXJfZGFzaGJvYXJkL2FwcC9hcGkvZWxlY3RyaWNpdHktZGF0YS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Felectricity-data%2Froute&page=%2Fapi%2Felectricity-data%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Felectricity-data%2Froute.ts&appDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \*********************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.4_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Felectricity-data%2Froute&page=%2Fapi%2Felectricity-data%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Felectricity-data%2Froute.ts&appDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fubuntu%2Fpreview_deployment%2Fwater_dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();