import type { App } from 'vue'
import { authDirective, authRoleDirective } from './core/auth'
import { roleDirective, roleLevelDirective, notRoleDirective } from './core/roles'
import { setupHighlightDirective } from './business/highlight'
import { setupRippleDirective } from './business/ripple'

export function setupGlobDirectives(app: App) {
  app.directive('auth', authDirective)
  app.directive('auth-role', authRoleDirective)
  app.directive('role', roleDirective)
  app.directive('role-level', roleLevelDirective)
  app.directive('not-role', notRoleDirective)
  setupHighlightDirective(app)
  setupRippleDirective(app)
}

export { authDirective, authRoleDirective, roleDirective, roleLevelDirective, notRoleDirective }
