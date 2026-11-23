import { onRequestPost as __api_auth_login_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\auth\\login.js"
import { onRequestPost as __api_auth_logout_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\auth\\logout.js"
import { onRequestGet as __api_auth_me_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\auth\\me.js"
import { onRequestPost as __api_auth_register_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\auth\\register.js"
import { onRequestGet as __api_public_track_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\public\\track.js"
import { onRequestGet as __api_reports_income_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\reports\\income.js"
import { onRequestGet as __api_reports_orders_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\reports\\orders.js"
import { onRequestGet as __api_settings_tenant_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\settings\\tenant.js"
import { onRequestPut as __api_settings_tenant_js_onRequestPut } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\settings\\tenant.js"
import { onRequestDelete as __api_customers__id__js_onRequestDelete } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\customers\\[id].js"
import { onRequestGet as __api_customers__id__js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\customers\\[id].js"
import { onRequestPut as __api_customers__id__js_onRequestPut } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\customers\\[id].js"
import { onRequestDelete as __api_orders__id__js_onRequestDelete } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\orders\\[id].js"
import { onRequestGet as __api_orders__id__js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\orders\\[id].js"
import { onRequestPut as __api_orders__id__js_onRequestPut } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\orders\\[id].js"
import { onRequestDelete as __api_team__id__js_onRequestDelete } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\team\\[id].js"
import { onRequestGet as __api_team__id__js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\team\\[id].js"
import { onRequestPut as __api_team__id__js_onRequestPut } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\team\\[id].js"
import { onRequestGet as __api_account_index_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\account\\index.js"
import { onRequestPut as __api_account_index_js_onRequestPut } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\account\\index.js"
import { onRequestGet as __api_customers_index_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\customers\\index.js"
import { onRequestPost as __api_customers_index_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\customers\\index.js"
import { onRequestGet as __api_dashboard_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\dashboard.js"
import { onRequestGet as __api_health_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\health.js"
import { onRequestGet as __api_notifications_index_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\notifications\\index.js"
import { onRequestPatch as __api_notifications_index_js_onRequestPatch } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\notifications\\index.js"
import { onRequestGet as __api_orders_index_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\orders\\index.js"
import { onRequestPost as __api_orders_index_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\orders\\index.js"
import { onRequestGet as __api_payments_index_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\payments\\index.js"
import { onRequestPost as __api_payments_index_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\payments\\index.js"
import { onRequestGet as __api_team_index_js_onRequestGet } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\team\\index.js"
import { onRequestPost as __api_team_index_js_onRequestPost } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\team\\index.js"
import { onRequest as __api__middleware_js_onRequest } from "D:\\programs\\unair\\kwu\\TailorHub\\functions\\api\\_middleware.js"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestGet],
    },
  {
      routePath: "/api/auth/register",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_register_js_onRequestPost],
    },
  {
      routePath: "/api/public/track",
      mountPath: "/api/public",
      method: "GET",
      middlewares: [],
      modules: [__api_public_track_js_onRequestGet],
    },
  {
      routePath: "/api/reports/income",
      mountPath: "/api/reports",
      method: "GET",
      middlewares: [],
      modules: [__api_reports_income_js_onRequestGet],
    },
  {
      routePath: "/api/reports/orders",
      mountPath: "/api/reports",
      method: "GET",
      middlewares: [],
      modules: [__api_reports_orders_js_onRequestGet],
    },
  {
      routePath: "/api/settings/tenant",
      mountPath: "/api/settings",
      method: "GET",
      middlewares: [],
      modules: [__api_settings_tenant_js_onRequestGet],
    },
  {
      routePath: "/api/settings/tenant",
      mountPath: "/api/settings",
      method: "PUT",
      middlewares: [],
      modules: [__api_settings_tenant_js_onRequestPut],
    },
  {
      routePath: "/api/customers/:id",
      mountPath: "/api/customers",
      method: "DELETE",
      middlewares: [],
      modules: [__api_customers__id__js_onRequestDelete],
    },
  {
      routePath: "/api/customers/:id",
      mountPath: "/api/customers",
      method: "GET",
      middlewares: [],
      modules: [__api_customers__id__js_onRequestGet],
    },
  {
      routePath: "/api/customers/:id",
      mountPath: "/api/customers",
      method: "PUT",
      middlewares: [],
      modules: [__api_customers__id__js_onRequestPut],
    },
  {
      routePath: "/api/orders/:id",
      mountPath: "/api/orders",
      method: "DELETE",
      middlewares: [],
      modules: [__api_orders__id__js_onRequestDelete],
    },
  {
      routePath: "/api/orders/:id",
      mountPath: "/api/orders",
      method: "GET",
      middlewares: [],
      modules: [__api_orders__id__js_onRequestGet],
    },
  {
      routePath: "/api/orders/:id",
      mountPath: "/api/orders",
      method: "PUT",
      middlewares: [],
      modules: [__api_orders__id__js_onRequestPut],
    },
  {
      routePath: "/api/team/:id",
      mountPath: "/api/team",
      method: "DELETE",
      middlewares: [],
      modules: [__api_team__id__js_onRequestDelete],
    },
  {
      routePath: "/api/team/:id",
      mountPath: "/api/team",
      method: "GET",
      middlewares: [],
      modules: [__api_team__id__js_onRequestGet],
    },
  {
      routePath: "/api/team/:id",
      mountPath: "/api/team",
      method: "PUT",
      middlewares: [],
      modules: [__api_team__id__js_onRequestPut],
    },
  {
      routePath: "/api/account",
      mountPath: "/api/account",
      method: "GET",
      middlewares: [],
      modules: [__api_account_index_js_onRequestGet],
    },
  {
      routePath: "/api/account",
      mountPath: "/api/account",
      method: "PUT",
      middlewares: [],
      modules: [__api_account_index_js_onRequestPut],
    },
  {
      routePath: "/api/customers",
      mountPath: "/api/customers",
      method: "GET",
      middlewares: [],
      modules: [__api_customers_index_js_onRequestGet],
    },
  {
      routePath: "/api/customers",
      mountPath: "/api/customers",
      method: "POST",
      middlewares: [],
      modules: [__api_customers_index_js_onRequestPost],
    },
  {
      routePath: "/api/dashboard",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_dashboard_js_onRequestGet],
    },
  {
      routePath: "/api/health",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_health_js_onRequestGet],
    },
  {
      routePath: "/api/notifications",
      mountPath: "/api/notifications",
      method: "GET",
      middlewares: [],
      modules: [__api_notifications_index_js_onRequestGet],
    },
  {
      routePath: "/api/notifications",
      mountPath: "/api/notifications",
      method: "PATCH",
      middlewares: [],
      modules: [__api_notifications_index_js_onRequestPatch],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api/orders",
      method: "GET",
      middlewares: [],
      modules: [__api_orders_index_js_onRequestGet],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api/orders",
      method: "POST",
      middlewares: [],
      modules: [__api_orders_index_js_onRequestPost],
    },
  {
      routePath: "/api/payments",
      mountPath: "/api/payments",
      method: "GET",
      middlewares: [],
      modules: [__api_payments_index_js_onRequestGet],
    },
  {
      routePath: "/api/payments",
      mountPath: "/api/payments",
      method: "POST",
      middlewares: [],
      modules: [__api_payments_index_js_onRequestPost],
    },
  {
      routePath: "/api/team",
      mountPath: "/api/team",
      method: "GET",
      middlewares: [],
      modules: [__api_team_index_js_onRequestGet],
    },
  {
      routePath: "/api/team",
      mountPath: "/api/team",
      method: "POST",
      middlewares: [],
      modules: [__api_team_index_js_onRequestPost],
    },
  {
      routePath: "/api",
      mountPath: "/api",
      method: "",
      middlewares: [__api__middleware_js_onRequest],
      modules: [],
    },
  ]